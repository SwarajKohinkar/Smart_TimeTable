import random
from collections import defaultdict
from sqlalchemy.orm import Session

from app.models import (
    Subject, TimetableConfig, Division,
    SubjectTeacher, Room, Teacher
)

from app.services.slot_generator import generate_weekly_slots
from app.services.constraints import extract_lecture_slots, enforce_nep_policies


def generate_ai_timetable(db: Session):

    config = db.query(TimetableConfig).order_by(TimetableConfig.id.desc()).first()
    subjects = db.query(Subject).all()
    divisions = db.query(Division).all()
    mappings = db.query(SubjectTeacher).all()
    rooms = db.query(Room).filter(Room.is_available == True).all()
    teachers_db = db.query(Teacher).all()

    if not config or not subjects or not divisions:
        return {"timetable": [], "error": "Missing configuration"}

    subjects = enforce_nep_policies(subjects)

    # Teacher map
    teacher_name_map = {t.id: t.name for t in teachers_db}

    # Subject → Teachers mapping
    subject_teacher_map = defaultdict(list)
    for m in mappings:
        subject_teacher_map[m.subject_id].append(m.teacher_id)

    # Subject metadata
    subjects_map = {}
    for s in subjects:
        subjects_map[s.name] = {
            "hours": s.weekly_hours,
            "is_lab": s.is_lab,
            "teachers": subject_teacher_map.get(s.id, [])
        }

    # Generate slots
    weekly_slots = generate_weekly_slots(
        config.working_days,
        config.start_time,
        config.end_time,
        config.break_count,
        config.break_duration
    )

    lecture_slots = extract_lecture_slots(weekly_slots)
    slot_count = len(lecture_slots)

    # ---------------- GA ---------------- #

    def create_units():
        units = []
        for s in subjects:
            units += [s.name] * s.weekly_hours
        return units

    def create_chromosome(units):
        chrom = units.copy()
        while len(chrom) < slot_count:
            chrom.append(None)
        random.shuffle(chrom)
        return chrom[:slot_count]

    def fitness(chrom):
        score = 0
        weekly = defaultdict(int)
        daily = defaultdict(lambda: defaultdict(int))

        for i, gene in enumerate(chrom):
            if gene is None:
                score -= 3
                continue

            day = lecture_slots[i]["day"]

            weekly[gene] += 1
            daily[day][gene] += 1

            score += 10

            if daily[day][gene] > 2:
                score -= 5

        for s in subjects:
            diff = abs(weekly[s.name] - s.weekly_hours)
            score -= diff * 6

        return score

    def crossover(p1, p2):
        point = random.randint(1, len(p1) - 2)
        return p1[:point] + p2[point:]

    def mutate(chrom):
        for i in range(len(chrom)):
            if random.random() < 0.1:
                j = random.randint(0, len(chrom) - 1)
                chrom[i], chrom[j] = chrom[j], chrom[i]
        return chrom

    # ---------------- RUN PER DIVISION ---------------- #

    division_results = {}

    for division in divisions:

        units = create_units()
        population = [create_chromosome(units) for _ in range(30)]

        for _ in range(80):
            population = sorted(population, key=fitness, reverse=True)

            next_gen = population[:5]

            while len(next_gen) < 30:
                p1, p2 = random.sample(population[:10], 2)
                child = crossover(p1, p2)
                child = mutate(child)
                next_gen.append(child)

            population = next_gen

        best = max(population, key=fitness)
        division_results[division.name] = best

    # ---------------- BUILD OUTPUT ---------------- #

    result = []
    teacher_schedule = {}   # prevents clashes

    for division in divisions:

        chrom = division_results[division.name]
        day_map = defaultdict(list)

        lecture_index = 0

        # FIXED LOOP (IMPORTANT)
        for day, slots in weekly_slots.items():
            for slot in slots:

                time = slot["time"]

                # 🔹 BREAK SLOT
                if slot["type"] == "break":
                    day_map[day].append({
                        "time": time,
                        "subject": "BREAK",
                        "type": "Break",
                        "teacher": None,
                        "room": None
                    })
                    continue

                # Safety
                if lecture_index >= len(chrom):
                    continue

                gene = chrom[lecture_index]
                lecture_index += 1

                # 🔹 FREE SLOT
                if gene is None:
                    day_map[day].append({
                        "time": time,
                        "subject": "FREE",
                        "type": "Free",
                        "teacher": None,
                        "room": None
                    })
                    continue

                info = subjects_map[gene]
                teacher_ids = info["teachers"]

                # 🔥 CLASH-FREE TEACHER ASSIGNMENT
                teacher_name = "Not Assigned"

                for tid in teacher_ids:
                    key = (tid, day, time)

                    if key not in teacher_schedule:
                        teacher_schedule[key] = division.name
                        teacher_name = teacher_name_map.get(tid, "Unknown")
                        break

                day_map[day].append({
                    "time": time,
                    "subject": gene,
                    "type": "Lab" if info["is_lab"] else "Theory",
                    "teacher": teacher_name,
                    "room": None
                })

        result.append({
            "division": division.name,
            "days": [
                {
                    "day": d,
                    "slots": sorted(slots, key=lambda x: x["time"])
                }
                for d, slots in day_map.items()
            ]
        })

    return {
        "timetable": result
    }
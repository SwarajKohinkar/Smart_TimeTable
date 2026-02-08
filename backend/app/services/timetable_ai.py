import random
from collections import defaultdict
from sqlalchemy.orm import Session

from app.models import Subject, TimetableConfig, Division, SubjectTeacher
from app.services.slot_generator import generate_weekly_slots
from app.services.constraints import (
    extract_lecture_slots,
    expand_subjects,
    enforce_nep_policies,
    violates_weekly_hours
)
from app.services.genetic_algorithm import (
    create_chromosome,
    fitness,
    crossover,
    mutate
)


def generate_ai_timetable(db: Session):

    config = db.query(TimetableConfig).order_by(TimetableConfig.id.desc()).first()
    subjects = db.query(Subject).all()
    divisions = db.query(Division).all()
    mappings = db.query(SubjectTeacher).all()

    if not config or not subjects or not divisions:
        return {"timetable": []}

    subjects = enforce_nep_policies(subjects)

    subjects_map = {
        s.name: {
            "category": s.category,
            "hours": s.weekly_hours,
            "is_lab": s.is_lab
        } for s in subjects
    }

    subject_teacher_map = defaultdict(list)
    for m in mappings:
        subject_teacher_map[m.subject_id].append(m.teacher_id)

    weekly_slots = generate_weekly_slots(
        config.working_days,
        config.start_time,
        config.end_time,
        config.break_count,
        config.break_duration
    )

    lecture_slots = extract_lecture_slots(weekly_slots)

    expanded_slots = []
    for division in divisions:
        for slot in lecture_slots:
            expanded_slots.append({
                "division": division.name,
                "day": slot["day"],
                "time": slot["time"]
            })

    slot_count = len(expanded_slots)

    subject_units = expand_subjects(subjects, divisions)
    random.shuffle(subject_units)
    subject_units = subject_units[:slot_count]

    population = [
        create_chromosome(subject_units, slot_count)
        for _ in range(10)
    ]

    for _ in range(40):
        population = [c for c in population if not violates_weekly_hours(c, subjects_map)]
        population.sort(key=lambda c: fitness(c, subjects_map, expanded_slots), reverse=True)

        next_gen = population[:2]
        while len(next_gen) < 10:
            p1, p2 = random.sample(population[:6], 2)
            next_gen.append(mutate(crossover(p1, p2)))

        population = next_gen

    best = population[0]

    division_day_map = defaultdict(lambda: defaultdict(list))

    for slot, gene in zip(expanded_slots, best):
        division = slot["division"]
        day = slot["day"]
        time = slot["time"]

        if gene is None or gene[0] != division:
            division_day_map[division][day].append({
                "time": time,
                "subject": "FREE",
                "type": "Free"
            })
            continue

        _, subject_name = gene
        subject = next(s for s in subjects if s.name == subject_name)

        division_day_map[division][day].append({
            "time": time,
            "subject": subject_name,
            "type": "Lab" if subject.is_lab else "Theory"
        })

    # ✅ FRONTEND-FRIENDLY ARRAY FORMAT
    result = []
    for division, days in division_day_map.items():
        result.append({
            "division": division,
            "days": [
                {
                    "day": day,
                    "slots": slots
                }
                for day, slots in days.items()
            ]
        })

    return {
        "timetable": result
    }

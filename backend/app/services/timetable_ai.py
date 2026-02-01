import random
from collections import defaultdict
from sqlalchemy.orm import Session

from app.models import (
    Subject,
    TimetableConfig,
    Division,
    Teacher,
    SubjectTeacher
)

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


def generate_ai_timetable(
    db: Session,
    generations: int = 60,
    population_size: int = 12
):

    # 1. Fetch Base Data
    config = db.query(TimetableConfig).order_by(TimetableConfig.id.desc()).first()
    subjects = db.query(Subject).all()
    divisions = db.query(Division).all()
    mappings = db.query(SubjectTeacher).all()

    if not config or not subjects or not divisions:
        return {"error": "Missing configuration, subjects, or divisions"}

    # 2. Enforce NEP / MEP Policies
    subjects = enforce_nep_policies(subjects)

    # 3. Subject Metadata Map
    subjects_map = {
        s.name: {
            "category": s.category,
            "hours": s.weekly_hours,
            "is_lab": s.is_lab
        }
        for s in subjects
    }

    # Subject → Teacher mapping
    subject_teacher_map = defaultdict(list)
    for m in mappings:
        subject_teacher_map[m.subject_id].append(m.teacher_id)

    # 4. Generate Weekly Slots
    weekly_slots = generate_weekly_slots(
        config.working_days,
        config.start_time,
        config.end_time,
        config.break_count,
        config.break_duration
    )

    lecture_slots = extract_lecture_slots(weekly_slots)

    # Expand slots per division
    expanded_slots = []
    for division in divisions:
        for slot in lecture_slots:
            expanded_slots.append({
                "division": division.name,
                "day": slot["day"],
                "time": slot["time"]
            })

    slot_count = len(expanded_slots)

    # 5. Expand Subjects PER DIVISION
    subject_units = expand_subjects(subjects, divisions)

    # Prevent overflow
    random.shuffle(subject_units)
    subject_units = subject_units[:slot_count]

    # 6. Initial Population
    population = [
        create_chromosome(subject_units, slot_count)
        for _ in range(population_size)
    ]

    # 7. Genetic Algorithm Loop
    for _ in range(generations):
        population = [
            c for c in population
            if not violates_weekly_hours(c, subjects_map)
        ]

        population = sorted(
            population,
            key=lambda c: fitness(c, subjects_map, expanded_slots),
            reverse=True
        )

        next_gen = population[:2]

        while len(next_gen) < population_size:
            p1, p2 = random.sample(population[:6], 2)
            child = crossover(p1, p2)
            child = mutate(child)
            next_gen.append(child)

        population = next_gen

    # 8. Best Solution
    best = max(
        population,
        key=lambda c: fitness(c, subjects_map, expanded_slots)
    )

    # 9. Build FULL timetable (NO MISSING SLOTS)
    teacher_assignments = defaultdict(list)
    final_output = defaultdict(list)

    for slot, gene in zip(expanded_slots, best):

        # FREE slot
        if gene is None:
            final_output[slot["division"]].append({
                "day": slot["day"],
                "time": slot["time"],
                "subject": "FREE",
                "teacher_id": None
            })
            continue

        gene_division, subject_name = gene

        # Division mismatch → FREE
        if gene_division != slot["division"]:
            final_output[slot["division"]].append({
                "day": slot["day"],
                "time": slot["time"],
                "subject": "FREE",
                "teacher_id": None
            })
            continue

        # Assign teacher (no clash)
        subject = next(s for s in subjects if s.name == subject_name)
        teacher_ids = subject_teacher_map.get(subject.id, [])

        assigned_teacher = None
        key = (slot["day"], slot["time"])

        for t_id in teacher_ids:
            if t_id not in teacher_assignments[key]:
                assigned_teacher = t_id
                teacher_assignments[key].append(t_id)
                break

        final_output[slot["division"]].append({
            "day": slot["day"],
            "time": slot["time"],
            "subject": subject_name,
            "teacher_id": assigned_teacher
        })

    return final_output

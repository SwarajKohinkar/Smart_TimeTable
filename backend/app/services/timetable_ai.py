from sqlalchemy.orm import Session
from app.models import Subject, TimetableConfig
from app.services.slot_generator import generate_weekly_slots
from app.services.constraints import (
    extract_lecture_slots,
    expand_subjects,
    violates_weekly_hours
)
from app.services.genetic_algorithm import (
    create_chromosome,
    fitness,
    crossover,
    mutate
)
import random


def generate_ai_timetable(db: Session, generations: int = 50, population_size: int = 10):
    # 1️ Fetch config & subjects
    config = db.query(TimetableConfig).order_by(TimetableConfig.id.desc()).first()
    subjects = db.query(Subject).all()

    # 2️ Build subject metadata map (IMPORTANT)
    subjects_map = {
        s.name: {
            "type": s.subject_type,
            "hours": s.weekly_hours
        }
        for s in subjects
    }

    # 3️ Generate slots
    weekly_slots = generate_weekly_slots(
        config.working_days,
        config.start_time,
        config.end_time,
        config.break_count,
        config.break_duration
    )

    lecture_slots = extract_lecture_slots(weekly_slots)
    subject_units = expand_subjects(subjects)
    slot_count = len(lecture_slots)

    # 4️ Initial population
    population = [
        create_chromosome(subject_units, slot_count)
        for _ in range(population_size)
    ]

    # 5️ Genetic Algorithm loop (ADVANCED)
    for _ in range(generations):
        #  Remove invalid chromosomes
        population = [
            c for c in population
            if not violates_weekly_hours(c, subjects_map)
        ]

        #  Sort by advanced fitness
        population = sorted(
            population,
            key=lambda c: fitness(c, subjects_map, lecture_slots),
            reverse=True
        )

        #  Elitism
        next_gen = population[:2]

        while len(next_gen) < population_size:
            p1, p2 = random.sample(population[:5], 2)
            child = crossover(p1, p2)
            child = mutate(child)
            next_gen.append(child)

        population = next_gen

    # 6️ Best solution
    best = max(
        population,
        key=lambda c: fitness(c, subjects_map, lecture_slots)
    )

    # 7️ Frontend-ready timetable output
    timetable = {}

    for slot, subject in zip(lecture_slots, best):
        day = slot["day"]
        timetable.setdefault(day, [])
        timetable[day].append({
            "time": slot["time"],
            "subject": subject
        })

    return timetable

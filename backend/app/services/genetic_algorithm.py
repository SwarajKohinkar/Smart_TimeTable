import random
from typing import List


def create_chromosome(subject_units: List[str], slot_count: int):
    """
    A chromosome is a list where:
    index = slot index
    value = subject assigned
    """
    chromosome = subject_units.copy()

    # Pad with None if fewer subjects than slots
    while len(chromosome) < slot_count:
        chromosome.append(None)

    random.shuffle(chromosome)
    return chromosome[:slot_count]


def fitness(chromosome, subjects_map, lecture_slots):
    """
    Higher score = better timetable
    """
    score = 0
    daily_subject_count = {}

    for idx, subject in enumerate(chromosome):
        if subject is None:
            continue

        day = lecture_slots[idx]["day"]
        subject_type = subjects_map[subject]["type"]

        # Base reward
        score += 5

        # Subject type priority (NEP)
        if subject_type == "Major":
            score += 3
        elif subject_type == "Minor":
            score += 2
        else:  # MOOC / Sports / Extra
            score += 1

        # Daily repetition penalty
        daily_subject_count.setdefault(day, {})
        daily_subject_count[day].setdefault(subject, 0)
        daily_subject_count[day][subject] += 1

        if daily_subject_count[day][subject] > 2:
            score -= 4  # discourage same subject too many times per day

    return score



def crossover(parent1, parent2):
    cut = random.randint(1, len(parent1) - 2)
    child = parent1[:cut] + parent2[cut:]
    return child


def mutate(chromosome, mutation_rate=0.1):
    for i in range(len(chromosome)):
        if random.random() < mutation_rate:
            j = random.randint(0, len(chromosome) - 1)
            chromosome[i], chromosome[j] = chromosome[j], chromosome[i]
    return chromosome

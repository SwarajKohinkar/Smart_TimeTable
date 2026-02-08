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


def fitness(chromosome, subjects_map, expanded_slots):
    """
    Division-aware fitness function.
    """
    score = 0
    daily_count = {}

    for idx, gene in enumerate(chromosome):
        if gene is None:
            continue

        division, subject = gene
        day = expanded_slots[idx]["day"]
        category = subjects_map[subject]["category"]

        key = (division, day)
        daily_count.setdefault(key, {})
        daily_count[key].setdefault(subject, 0)
        daily_count[key][subject] += 1

        # Base reward
        score += 5

        # NEP priority
        if category == "Major":
            score += 3
        elif category == "Minor":
            score += 2
        else:  # OpenElective / COI / UHV / etc.
            score += 1

        # Penalize same subject too many times per day per division
        if daily_count[key][subject] > 2:
            score -= 4

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

import random
from typing import List, Dict, Tuple
from collections import defaultdict


def create_chromosome(subject_units: List[tuple], slot_count: int):
    """
    A chromosome is a list where:
    index = slot index
    value = (division, subject, is_lab) tuple assigned
    """
    chromosome = subject_units.copy()

    # Pad with None if fewer subjects than slots
    while len(chromosome) < slot_count:
        chromosome.append(None)

    random.shuffle(chromosome)
    return chromosome[:slot_count]


def fitness(chromosome, subjects_map: Dict, expanded_slots: List[Dict], 
            consecutive_slots: Dict = None, teacher_availability: Dict = None,
            room_availability: Dict = None) -> int:
    """
    Enhanced division-aware fitness function with:
    - Teacher availability constraints
    - Room allocation constraints
    - Consecutive lab handling
    - Workload balancing
    """
    score = 0
    daily_count = {}
    teacher_schedule = defaultdict(list)
    room_schedule = defaultdict(list)
    lab_positions = defaultdict(list)
    
    consecutive_slots = consecutive_slots or {}

    for idx, gene in enumerate(chromosome):
        if gene is None:
            continue

        division, subject, is_lab = gene if len(gene) > 2 else (*gene, False)
        day = expanded_slots[idx]["day"]
        time = expanded_slots[idx]["time"]
        
        subject_info = subjects_map.get(subject, {})
        category = subject_info.get("category", "Other")
        teachers = subject_info.get("teachers", [])
        room_id = subject_info.get("preferred_room_id")
        
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

        # Track teacher assignments for clash detection
        for teacher_id in teachers:
            teacher_key = (teacher_id, day, time)
            teacher_schedule[teacher_key].append(division)
            
            # Check teacher availability
            if teacher_availability:
                avail_key = (teacher_id, day)
                if avail_key in teacher_availability:
                    if not teacher_availability[avail_key]:
                        score -= 10  # Teacher unavailable penalty

        # Track room assignments
        if room_id:
            room_key = (room_id, day, time)
            room_schedule[room_key].append(division)

        # Track lab positions for consecutive slot checking
        if is_lab:
            lab_positions[day].append(idx)

    # Teacher clash penalty
    for key, divisions in teacher_schedule.items():
        if len(divisions) > 1:
            score -= 15 * (len(divisions) - 1)  # Heavy penalty for teacher clashes

    # Room clash penalty
    for key, divisions in room_schedule.items():
        if len(divisions) > 1:
            score -= 10 * (len(divisions) - 1)

    # Consecutive lab bonus/penalty
    for day, positions in lab_positions.items():
        consecutive_pairs = consecutive_slots.get(day, [])
        for pos in positions:
            is_consecutive = any(pos in pair for pair in consecutive_pairs)
            if is_consecutive:
                score += 8  # Bonus for consecutive lab slots
            else:
                score -= 3  # Penalty for non-consecutive lab

    return score


def crossover(parent1: List, parent2: List) -> List:
    """Two-point crossover for better genetic diversity"""
    if len(parent1) < 3:
        cut = random.randint(0, len(parent1) - 1)
        return parent1[:cut] + parent2[cut:]
    
    cut1 = random.randint(1, len(parent1) - 2)
    cut2 = random.randint(cut1 + 1, len(parent1) - 1)
    child = parent1[:cut1] + parent2[cut1:cut2] + parent1[cut2:]
    return child


def mutate(chromosome: List, mutation_rate: float = 0.1) -> List:
    """Swap mutation with adaptive rate"""
    for i in range(len(chromosome)):
        if random.random() < mutation_rate:
            j = random.randint(0, len(chromosome) - 1)
            chromosome[i], chromosome[j] = chromosome[j], chromosome[i]
    return chromosome


def local_search(chromosome: List, subjects_map: Dict, expanded_slots: List[Dict],
                 max_iterations: int = 10) -> List:
    """
    Local search to improve chromosome quality.
    Tries to swap genes to improve fitness.
    """
    best = chromosome.copy()
    best_fitness = fitness(best, subjects_map, expanded_slots)
    
    for _ in range(max_iterations):
        # Pick two random positions
        i, j = random.sample(range(len(chromosome)), 2)
        
        # Try swap
        candidate = best.copy()
        candidate[i], candidate[j] = candidate[j], candidate[i]
        
        candidate_fitness = fitness(candidate, subjects_map, expanded_slots)
        
        if candidate_fitness > best_fitness:
            best = candidate
            best_fitness = candidate_fitness
    
    return best


def select_parents(population: List, fitness_scores: List, tournament_size: int = 3) -> Tuple:
    """Tournament selection for parent selection"""
    def tournament():
        indices = random.sample(range(len(population)), tournament_size)
        best_idx = max(indices, key=lambda i: fitness_scores[i])
        return population[best_idx].copy()
    
    return tournament(), tournament()


def create_next_generation(population: List, subjects_map: Dict, expanded_slots: List[Dict],
                           mutation_rate: float = 0.1, elite_size: int = 2) -> List:
    """Create the next generation using selection, crossover, and mutation"""
    # Calculate fitness for all
    fitness_scores = [fitness(ind, subjects_map, expanded_slots) for ind in population]
    
    # Sort by fitness (descending)
    sorted_pop = sorted(zip(population, fitness_scores), key=lambda x: x[1], reverse=True)
    
    # Elitism - keep best individuals
    next_gen = [ind.copy() for ind, _ in sorted_pop[:elite_size]]
    
    # Fill rest with offspring
    while len(next_gen) < len(population):
        parent1, parent2 = select_parents(population, fitness_scores)
        child = crossover(parent1, parent2)
        child = mutate(child, mutation_rate)
        next_gen.append(child)
    
    return next_gen

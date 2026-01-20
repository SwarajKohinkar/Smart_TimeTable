from typing import List, Dict


def extract_lecture_slots(weekly_slots: Dict) -> List[Dict]:
    """
    Extract only lecture slots from the weekly slot structure.
    """
    lecture_slots = []

    for day, slots in weekly_slots.items():
        for slot in slots:
            if slot["type"] == "lecture":
                lecture_slots.append({
                    "day": day,
                    "time": slot["time"]
                })

    return lecture_slots


def expand_subjects(subjects) -> List[str]:
    """
    Expand subjects based on weekly hours.
    Example:
    DS (4 hours) → ["DS", "DS", "DS", "DS"]
    """
    expanded = []

    for subject in subjects:
        for _ in range(subject.weekly_hours):
            expanded.append(subject.name)

    return expanded

def violates_weekly_hours(chromosome, subjects_map):
    subject_count = {}

    for subject in chromosome:
        if subject is None:
            continue
        subject_count[subject] = subject_count.get(subject, 0) + 1

    for subject, count in subject_count.items():
        if count > subjects_map[subject]["hours"]:
            return True

    return False

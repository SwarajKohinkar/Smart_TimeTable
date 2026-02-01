from typing import List, Dict
from collections import defaultdict

# Slot Utilities

def extract_lecture_slots(weekly_slots: Dict) -> List[Dict]:
    """
    Extract only lecture/lab slots from the weekly slot structure.
    Breaks are ignored.
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

# Subject Expansion

def expand_subjects(subjects, divisions) -> List[tuple]:
    """
    Expand subjects PER DIVISION based on weekly hours.

    Example:
    DBMS (4 hrs), divisions A,B →
    [
      ("A","DBMS") x4,
      ("B","DBMS") x4
    ]
    """
    expanded = []

    for division in divisions:
        for subject in subjects:
            for _ in range(subject.weekly_hours):
                expanded.append((division.name, subject.name))

    return expanded


# NEP / MEP 2020 Mandatory Enforcement

def enforce_nep_policies(subjects):
    """
    Enforce mandatory NEP / MEP rules:
    - At least 2 Open Elective lectures per week
    - At least 1 COI or UHV lecture per week
    """
    has_open_elective = False
    has_coi_or_uhv = False

    for subject in subjects:
        if subject.category == "OpenElective":
            has_open_elective = True
            if subject.weekly_hours < 2:
                subject.weekly_hours = 2

        if subject.category in ("COI", "UHV"):
            has_coi_or_uhv = True
            if subject.weekly_hours < 1:
                subject.weekly_hours = 1

    # Auto-add if missing
    if not has_open_elective:
        from app.models import Subject
        subjects.append(
            Subject(
                name="Open Elective",
                category="OpenElective",
                is_lab=False,
                weekly_hours=2,
                teachers_required=1
            )
        )

    if not has_coi_or_uhv:
        from app.models import Subject
        subjects.append(
            Subject(
                name="COI",
                category="COI",
                is_lab=False,
                weekly_hours=1,
                teachers_required=1
            )
        )

    return subjects

# Weekly Hour Violation

def violates_weekly_hours(chromosome, subjects_map):
    """
    Ensure weekly hours are respected PER DIVISION.
    """
    count = defaultdict(int)

    for gene in chromosome:
        if gene is None:
            continue

        division, subject = gene
        count[(division, subject)] += 1

        if count[(division, subject)] > subjects_map[subject]["hours"]:
            return True

    return False


# Teacher Clash Constraint (Foundation)

def violates_teacher_clash(assignments):
    """
    assignments:
    {
        (day, time): [teacher_id, teacher_id, ...]
    }
    """
    for teachers in assignments.values():
        if len(teachers) != len(set(teachers)):
            return True
    return False

from typing import List, Dict, Set, Tuple
from collections import defaultdict
from sqlalchemy.orm import Session

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


def get_consecutive_slots(lecture_slots: List[Dict]) -> Dict[str, List[List[int]]]:
    """
    Identify consecutive slot indices per day for lab scheduling.
    Returns dict: {day: [[idx1, idx2], [idx3, idx4], ...]}
    """
    day_slots = defaultdict(list)
    
    for idx, slot in enumerate(lecture_slots):
        day_slots[slot["day"]].append((idx, slot["time"]))
    
    consecutive = {}
    for day, slots_with_idx in day_slots.items():
        slots_with_idx.sort(key=lambda x: x[1])  # Sort by time
        pairs = []
        for i in range(len(slots_with_idx) - 1):
            # Check if consecutive times
            time1 = slots_with_idx[i][1]
            time2 = slots_with_idx[i + 1][1]
            # Simple consecutive check (same day, adjacent slots)
            if _are_consecutive_times(time1, time2):
                pairs.append([slots_with_idx[i][0], slots_with_idx[i + 1][0]])
        consecutive[day] = pairs
    
    return consecutive


def _are_consecutive_times(time1: str, time2: str) -> bool:
    """Check if two time slots are consecutive"""
    try:
        start1, end1 = time1.split('-')
        start2, end2 = time2.split('-')
        return end1 == start2
    except:
        return False


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
                expanded.append((division.name, subject.name, subject.is_lab))

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

        division, subject, _ = gene if len(gene) > 2 else (*gene, False)
        count[(division, subject)] += 1

        if count[(division, subject)] > subjects_map[subject]["hours"]:
            return True

    return False


# Teacher Clash Constraint

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


# Teacher Availability Constraint

def check_teacher_availability(db: Session, teacher_id: int, day: str, time: str) -> bool:
    """
    Check if a teacher is available at a specific day/time.
    Returns True if available (or no availability record exists).
    """
    from app.models import TeacherAvailability
    
    availability = db.query(TeacherAvailability).filter(
        TeacherAvailability.teacher_id == teacher_id,
        TeacherAvailability.day == day
    ).first()
    
    if not availability:
        return True  # No record means available
    
    # Check if time falls within availability window
    try:
        slot_start, slot_end = time.split('-')
        avail_start = availability.start_time
        avail_end = availability.end_time
        
        if not availability.is_available:
            return False
            
        return slot_start >= avail_start and slot_end <= avail_end
    except:
        return True


# Room Allocation Constraint

def check_room_availability(room_schedule: Dict, room_id: int, day: str, time: str) -> bool:
    """
    Check if a room is available at a specific day/time.
    """
    key = (room_id, day, time)
    return key not in room_schedule


def allocate_room_for_subject(db: Session, subject, day: str, time: str, 
                               room_schedule: Dict, used_rooms: Set) -> Tuple[int, bool]:
    """
    Find an available room for a subject.
    Returns (room_id, success) tuple.
    """
    from app.models import Room
    
    # Check if subject has preferred room
    if subject.preferred_room_id:
        if check_room_availability(room_schedule, subject.preferred_room_id, day, time):
            return subject.preferred_room_id, True
    
    # Find available room based on subject requirements
    room_type = "Lab" if subject.requires_lab or subject.is_lab else "Lecture"
    
    rooms = db.query(Room).filter(
        Room.room_type == room_type,
        Room.is_available == True,
        ~Room.id.in_(used_rooms)
    ).all()
    
    for room in rooms:
        if check_room_availability(room_schedule, room.id, day, time):
            return room.id, True
    
    # Fallback: any available room
    rooms = db.query(Room).filter(
        Room.is_available == True
    ).all()
    
    for room in rooms:
        if check_room_availability(room_schedule, room.id, day, time):
            return room.id, True
    
    return None, False


# Consecutive Lab Constraint

def check_consecutive_lab_placement(chromosome: List, expanded_slots: List[Dict], 
                                      consecutive_slots: Dict) -> int:
    """
    Check if labs are placed in consecutive slots.
    Returns penalty score (lower is better).
    """
    penalty = 0
    lab_positions = defaultdict(list)
    
    for idx, gene in enumerate(chromosome):
        if gene is None:
            continue
        
        is_lab = gene[2] if len(gene) > 2 else False
        if is_lab:
            day = expanded_slots[idx]["day"]
            lab_positions[day].append(idx)
    
    # Check if labs are in consecutive slots
    for day, positions in lab_positions.items():
        consecutive_pairs = consecutive_slots.get(day, [])
        for pos in positions:
            is_consecutive = any(pos in pair for pair in consecutive_pairs)
            if not is_consecutive:
                penalty += 5  # Penalty for non-consecutive lab
    
    return penalty


# Build Teacher Schedule from Chromosome

def build_teacher_schedule(chromosome: List, expanded_slots: List[Dict], 
                           subject_teacher_map: Dict, subjects_map: Dict) -> Dict:
    """
    Build a schedule showing which teachers are assigned where.
    Returns: {(teacher_id, day, time): [divisions]}
    """
    schedule = defaultdict(list)
    
    for idx, gene in enumerate(chromosome):
        if gene is None:
            continue
        
        division = expanded_slots[idx]["division"]
        day = expanded_slots[idx]["day"]
        time = expanded_slots[idx]["time"]
        subject_name = gene[1] if len(gene) > 1 else gene[1]
        
        # Get teachers for this subject
        subject_info = subjects_map.get(subject_name, {})
        teacher_ids = subject_info.get("teachers", [])
        
        for teacher_id in teacher_ids:
            key = (teacher_id, day, time)
            schedule[key].append(division)
    
    return schedule


# Calculate Teacher Workload

def calculate_teacher_workload(chromosome: List, subject_teacher_map: Dict, 
                                subjects_map: Dict) -> Dict[int, int]:
    """
    Calculate total hours assigned to each teacher.
    Returns: {teacher_id: hours}
    """
    workload = defaultdict(int)
    
    for gene in chromosome:
        if gene is None:
            continue
        
        subject_name = gene[1] if len(gene) > 1 else gene[1]
        subject_info = subjects_map.get(subject_name, {})
        teacher_ids = subject_info.get("teachers", [])
        
        for teacher_id in teacher_ids:
            workload[teacher_id] += 1
    
    return dict(workload)

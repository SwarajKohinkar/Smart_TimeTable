from app.utils.time_utils import time_to_minutes, format_slot


def generate_daily_slots(
    start_time: str,
    end_time: str,
    break_count: int,
    break_duration: int,
    lecture_duration: int = 60,
):
    """
    Generate slots for a single day with breaks included.
    """
    start_min = time_to_minutes(start_time)
    end_min = time_to_minutes(end_time)

    slots = []
    current = start_min
    breaks_inserted = 0

    while current + lecture_duration <= end_min:
        # Insert break evenly after some lectures
        if break_count > 0 and breaks_inserted < break_count:
            # heuristic: add a break after every 2 lectures
            if len(slots) > 0 and len(slots) % 2 == 0:
                break_start = current
                break_end = current + break_duration
                if break_end <= end_min:
                    slots.append({
                        "type": "break",
                        "time": format_slot(break_start, break_end)
                    })
                    current = break_end
                    breaks_inserted += 1
                    continue

        # Lecture slot
        slot_start = current
        slot_end = current + lecture_duration
        slots.append({
            "type": "lecture",
            "time": format_slot(slot_start, slot_end)
        })
        current = slot_end

    return slots


def generate_weekly_slots(
    working_days: int,
    start_time: str,
    end_time: str,
    break_count: int,
    break_duration: int,
):
    """
    Generate Day × Slot matrix for the full week.
    """
    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    daily_slots = generate_daily_slots(
        start_time=start_time,
        end_time=end_time,
        break_count=break_count,
        break_duration=break_duration,
    )

    timetable = {}
    for i in range(working_days):
        timetable[day_names[i]] = daily_slots

    return timetable

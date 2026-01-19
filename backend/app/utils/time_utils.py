def time_to_minutes(time_str: str) -> int:
    """Convert HH:MM to total minutes"""
    hours, minutes = map(int, time_str.split(":"))
    return hours * 60 + minutes


def minutes_to_time(minutes: int) -> str:
    """Convert total minutes to HH:MM"""
    hours = minutes // 60
    mins = minutes % 60
    return f"{hours:02d}:{mins:02d}"


def format_slot(start_min: int, end_min: int) -> str:
    """Format a slot as HH:MM-HH:MM"""
    return f"{minutes_to_time(start_min)}-{minutes_to_time(end_min)}"

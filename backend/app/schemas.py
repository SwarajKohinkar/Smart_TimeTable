from pydantic import BaseModel
from typing import Optional

# Division Schemas
class DivisionCreate(BaseModel):
    name: str


# Teacher Schemas

class TeacherCreate(BaseModel):
    name: str



# Subject Schemas

class SubjectCreate(BaseModel):
    name: str

    # Major / Minor / OpenElective / COI / UHV etc.
    category: str

    # True = Lab, False = Lecture
    is_lab: bool = False

    # Weekly hours (labs usually higher)
    weekly_hours: int

    # Number of teachers available for this subject
    teachers_required: int



# Subject–Teacher Mapping Schema

class SubjectTeacherCreate(BaseModel):
    subject_id: int
    teacher_id: int


# Timetable Configuration Schema

class TimetableConfigCreate(BaseModel):
    working_days: int
    start_time: str
    end_time: str
    break_count: int
    break_duration: int

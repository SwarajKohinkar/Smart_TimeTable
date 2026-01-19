from pydantic import BaseModel


class SubjectCreate(BaseModel):
    name: str
    subject_type: str
    weekly_hours: int
    teachers_required: int


class TimetableConfigCreate(BaseModel):
    working_days: int
    start_time: str
    end_time: str
    break_count: int
    break_duration: int

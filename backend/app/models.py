from sqlalchemy import Column, Integer, String
from app.database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    subject_type = Column(String)
    weekly_hours = Column(Integer)
    teachers_required = Column(Integer)


class TimetableConfig(Base):
    __tablename__ = "timetable_config"

    id = Column(Integer, primary_key=True, index=True)
    working_days = Column(Integer)
    start_time = Column(String)
    end_time = Column(String)
    break_count = Column(Integer)
    break_duration = Column(Integer)

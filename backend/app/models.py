from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

# Division Model
class Division(Base):
    __tablename__ = "divisions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # A, B, C


# Teacher Model

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)


# Subject Model

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    # Academic category (Major, Minor, OpenElective, COI, UHV, etc.)
    category = Column(String)

    # Lecture or Lab
    is_lab = Column(Boolean, default=False)

    # Weekly hours (labs may have higher values)
    weekly_hours = Column(Integer)

    # Number of teachers allowed for this subject
    teachers_required = Column(Integer)



# Subject ↔ Teacher Mapping
class SubjectTeacher(Base):
    __tablename__ = "subject_teachers"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))

    subject = relationship("Subject")
    teacher = relationship("Teacher")

# Timetable Configuration
class TimetableConfig(Base):
    __tablename__ = "timetable_config"

    id = Column(Integer, primary_key=True, index=True)
    working_days = Column(Integer)
    start_time = Column(String)
    end_time = Column(String)
    break_count = Column(Integer)
    break_duration = Column(Integer)

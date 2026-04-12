from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# Division Model
class Division(Base):
    __tablename__ = "divisions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # A, B, C
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Teacher Model
class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, nullable=True)
    max_hours_per_week = Column(Integer, default=20)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    availability = relationship("TeacherAvailability", back_populates="teacher", cascade="all, delete-orphan")
    assignments = relationship("SubjectTeacher", back_populates="teacher", cascade="all, delete-orphan")


# Teacher Availability Model
class TeacherAvailability(Base):
    __tablename__ = "teacher_availability"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    day = Column(String)  # Monday, Tuesday, etc.
    start_time = Column(String)
    end_time = Column(String)
    is_available = Column(Boolean, default=True)
    
    # Relationships
    teacher = relationship("Teacher", back_populates="availability")


# Subject Model
class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    # Academic category (Major, Minor, OpenElective, COI, UHV, etc.)
    category = Column(String)

    # Lecture and/or Lab
    is_lab = Column(Boolean, default=False)
    is_lecture = Column(Boolean, default=True)

    # Weekly hours (labs may have higher values)
    weekly_hours = Column(Integer)

    # Number of teachers allowed for this subject
    teachers_required = Column(Integer)
    
    # Room requirements
    requires_lab = Column(Boolean, default=False)
    preferred_room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    teachers = relationship("SubjectTeacher", back_populates="subject", cascade="all, delete-orphan")


# Subject ↔ Teacher Mapping
class SubjectTeacher(Base):
    __tablename__ = "subject_teachers"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))

    subject = relationship("Subject", back_populates="teachers")
    teacher = relationship("Teacher", back_populates="assignments")


# Room/Lab Model
class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    building = Column(String, nullable=True)
    capacity = Column(Integer, default=60)
    room_type = Column(String, default="Lecture")  # Lecture, Lab, Seminar
    facilities = Column(Text, nullable=True)  # JSON string of facilities
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Timetable Configuration
class TimetableConfig(Base):
    __tablename__ = "timetable_config"

    id = Column(Integer, primary_key=True, index=True)
    working_days = Column(Integer)
    start_time = Column(String)
    end_time = Column(String)
    break_count = Column(Integer)
    break_duration = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Timetable Version Model
class TimetableVersion(Base):
    __tablename__ = "timetable_versions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    timetable_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=False)


# Conflict Log Model
class ConflictLog(Base):
    __tablename__ = "conflict_logs"

    id = Column(Integer, primary_key=True, index=True)
    conflict_type = Column(String)  # teacher_clash, room_clash, etc.
    description = Column(Text)
    timetable_version_id = Column(Integer, ForeignKey("timetable_versions.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# User Model for Authentication
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

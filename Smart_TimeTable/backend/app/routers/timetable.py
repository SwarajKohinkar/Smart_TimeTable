from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from collections import defaultdict
import json
import uuid

from app.database import SessionLocal
from app.models import TimetableConfig, TimetableVersion, ConflictLog, Division, Teacher, Subject, SubjectTeacher, Room
from app.services.slot_generator import generate_weekly_slots
from app.services.timetable_ai import generate_ai_timetable
from app import schemas

router = APIRouter()

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Slot Preview API
@router.get("/generate-slots")
def generate_slots(db: Session = Depends(get_db)):
    """Generate slot structure based on configuration"""
    config = db.query(TimetableConfig).order_by(TimetableConfig.id.desc()).first()

    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Timetable configuration not found"
        )

    timetable = generate_weekly_slots(
        working_days=config.working_days,
        start_time=config.start_time,
        end_time=config.end_time,
        break_count=config.break_count,
        break_duration=config.break_duration,
    )

    return {
        "working_days": config.working_days,
        "timetable": timetable
    }


# AI Timetable API
@router.get("/generate-ai-timetable")
def generate_ai(db: Session = Depends(get_db)):
    """Generate AI-powered timetable"""
    timetable = generate_ai_timetable(db)
    return {
        "timetable": timetable
    }


# Timetable Version APIs
@router.post("/versions", response_model=schemas.TimetableVersionResponse, status_code=status.HTTP_201_CREATED)
def save_timetable_version(version: schemas.TimetableVersionCreate, db: Session = Depends(get_db)):
    """Save a timetable version"""
    db_version = TimetableVersion(
        name=version.name,
        description=version.description,
        timetable_data=version.timetable_data
    )
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    return db_version


@router.get("/versions", response_model=List[schemas.TimetableVersionResponse])
def get_timetable_versions(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """Get all timetable versions"""
    versions = db.query(TimetableVersion).order_by(TimetableVersion.created_at.desc()).offset(skip).limit(limit).all()
    return versions


@router.get("/versions/{version_id}", response_model=schemas.TimetableVersionResponse)
def get_timetable_version(version_id: int, db: Session = Depends(get_db)):
    """Get a specific timetable version"""
    version = db.query(TimetableVersion).filter(TimetableVersion.id == version_id).first()
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Timetable version with id {version_id} not found"
        )
    return version


@router.put("/versions/{version_id}/activate", response_model=schemas.TimetableVersionResponse)
def activate_timetable_version(version_id: int, db: Session = Depends(get_db)):
    """Set a timetable version as active"""
    # Deactivate all versions
    db.query(TimetableVersion).update({"is_active": False})
    
    version = db.query(TimetableVersion).filter(TimetableVersion.id == version_id).first()
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Timetable version with id {version_id} not found"
        )
    version.is_active = True
    db.commit()
    db.refresh(version)
    return version


@router.delete("/versions/{version_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_timetable_version(version_id: int, db: Session = Depends(get_db)):
    """Delete a timetable version"""
    version = db.query(TimetableVersion).filter(TimetableVersion.id == version_id).first()
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Timetable version with id {version_id} not found"
        )
    db.delete(version)
    db.commit()
    return None


# Conflict Detection API
@router.get("/detect-conflicts/{version_id}", response_model=List[schemas.ConflictLogResponse])
def detect_conflicts(version_id: int, db: Session = Depends(get_db)):
    """Detect conflicts in a timetable version"""
    version = db.query(TimetableVersion).filter(TimetableVersion.id == version_id).first()
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Timetable version with id {version_id} not found"
        )
    
    conflicts = []
    timetable_data = version.timetable_data
    
    # Build teacher and room schedules
    teacher_schedule = defaultdict(list)
    room_schedule = defaultdict(list)
    
    # Get subject-teacher mappings
    mappings = db.query(SubjectTeacher).all()
    subject_teacher_map = defaultdict(list)
    for m in mappings:
        subject_teacher_map[m.subject_id].append(m.teacher_id)
    
    # Analyze timetable for conflicts
    if "timetable" in timetable_data:
        for division_data in timetable_data["timetable"]:
            division = division_data.get("division")
            for day_data in division_data.get("days", []):
                day = day_data.get("day")
                for slot in day_data.get("slots", []):
                    time = slot.get("time")
                    subject_name = slot.get("subject")
                    
                    if subject_name and subject_name != "FREE":
                        # Find subject
                        subject = db.query(Subject).filter(Subject.name == subject_name).first()
                        if subject:
                            # Get teachers for this subject
                            for teacher_id in subject_teacher_map.get(subject.id, []):
                                teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
                                if teacher:
                                    key = (teacher.name, day, time)
                                    teacher_schedule[key].append({
                                        "division": division,
                                        "subject": subject_name
                                    })
    
    # Detect teacher conflicts
    for key, assignments in teacher_schedule.items():
        if len(assignments) > 1:
            teacher_name, day, time = key
            conflict = ConflictLog(
                conflict_type="teacher_clash",
                description=f"Teacher '{teacher_name}' is assigned to multiple divisions on {day} at {time}: {', '.join([f'{a['division']}({a['subject']})' for a in assignments])}",
                timetable_version_id=version_id
            )
            db.add(conflict)
            conflicts.append(conflict)
    
    db.commit()
    return conflicts


@router.get("/conflicts", response_model=List[schemas.ConflictLogResponse])
def get_conflicts(version_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Get all conflicts, optionally filtered by version"""
    query = db.query(ConflictLog)
    if version_id:
        query = query.filter(ConflictLog.timetable_version_id == version_id)
    return query.order_by(ConflictLog.created_at.desc()).all()


# Teacher Workload API
@router.get("/teacher-workload")
def get_teacher_workload(db: Session = Depends(get_db)):
    """Get workload statistics for all teachers"""
    teachers = db.query(Teacher).all()
    mappings = db.query(SubjectTeacher).all()
    subjects = db.query(Subject).all()
    
    # Build teacher-subject mapping
    teacher_subjects = defaultdict(list)
    for m in mappings:
        subject = next((s for s in subjects if s.id == m.subject_id), None)
        if subject:
            teacher_subjects[m.teacher_id].append(subject)
    
    workload = []
    for teacher in teachers:
        total_hours = sum(s.weekly_hours for s in teacher_subjects.get(teacher.id, []))
        workload.append({
            "teacher_id": teacher.id,
            "teacher_name": teacher.name,
            "assigned_hours": total_hours,
            "max_hours": teacher.max_hours_per_week,
            "utilization": round(total_hours / teacher.max_hours_per_week * 100, 1) if teacher.max_hours_per_week > 0 else 0,
            "subjects": [{"name": s.name, "hours": s.weekly_hours} for s in teacher_subjects.get(teacher.id, [])]
        })
    
    return workload


# Share Link API
@router.post("/share/{version_id}")
def create_share_link(version_id: int, db: Session = Depends(get_db)):
    """Generate a shareable link for a timetable version"""
    version = db.query(TimetableVersion).filter(TimetableVersion.id == version_id).first()
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Timetable version with id {version_id} not found"
        )
    
    share_id = str(uuid.uuid4())[:8]
    return {
        "share_id": share_id,
        "share_url": f"/shared/{share_id}",
        "version_id": version_id
    }


# Compare Versions API
@router.get("/compare/{version_id_1}/{version_id_2}")
def compare_versions(version_id_1: int, version_id_2: int, db: Session = Depends(get_db)):
    """Compare two timetable versions"""
    v1 = db.query(TimetableVersion).filter(TimetableVersion.id == version_id_1).first()
    v2 = db.query(TimetableVersion).filter(TimetableVersion.id == version_id_2).first()
    
    if not v1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Timetable version with id {version_id_1} not found"
        )
    if not v2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Timetable version with id {version_id_2} not found"
        )
    
    return {
        "version_1": {"id": v1.id, "name": v1.name, "created_at": v1.created_at},
        "version_2": {"id": v2.id, "name": v2.name, "created_at": v2.created_at},
        "data_1": v1.timetable_data,
        "data_2": v2.timetable_data
    }

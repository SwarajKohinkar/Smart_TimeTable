from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from app.services.timetable_ai import generate_ai_timetable
from app.database import SessionLocal
from app import models, schemas

router = APIRouter()

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# Division APIs
# -------------------------

@router.post("/divisions", response_model=schemas.DivisionResponse, status_code=status.HTTP_201_CREATED)
def create_division(division: schemas.DivisionCreate, db: Session = Depends(get_db)):
    """Create a new division"""
    try:
        db_division = models.Division(**division.model_dump())
        db.add(db_division)
        db.commit()
        db.refresh(db_division)
        return db_division
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Division with name '{division.name}' already exists"
        )

@router.get("/divisions", response_model=List[schemas.DivisionResponse])
def read_divisions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all divisions"""
    divisions = db.query(models.Division).offset(skip).limit(limit).all()
    return divisions

@router.get("/divisions/{division_id}", response_model=schemas.DivisionResponse)
def read_division(division_id: int, db: Session = Depends(get_db)):
    """Get a specific division by ID"""
    division = db.query(models.Division).filter(models.Division.id == division_id).first()
    if not division:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Division with id {division_id} not found"
        )
    return division

@router.put("/divisions/{division_id}", response_model=schemas.DivisionResponse)
def update_division(division_id: int, division: schemas.DivisionUpdate, db: Session = Depends(get_db)):
    """Update a division"""
    db_division = db.query(models.Division).filter(models.Division.id == division_id).first()
    if not db_division:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Division with id {division_id} not found"
        )
    try:
        for key, value in division.model_dump().items():
            setattr(db_division, key, value)
        db.commit()
        db.refresh(db_division)
        return db_division
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Division with name '{division.name}' already exists"
        )

@router.delete("/divisions/{division_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_division(division_id: int, db: Session = Depends(get_db)):
    """Delete a division"""
    db_division = db.query(models.Division).filter(models.Division.id == division_id).first()
    if not db_division:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Division with id {division_id} not found"
        )
    db.delete(db_division)
    db.commit()
    return None


@router.delete("/divisions/{division_id}")
def delete_division(division_id: int, db: Session = Depends(get_db)):
    division = db.query(models.Division).filter(models.Division.id == division_id).first()
    if division:
        db.delete(division)
        db.commit()
    return {"message": "Division deleted successfully"}

# -------------------------
# Teacher APIs
# -------------------------

@router.post("/teachers", response_model=schemas.TeacherResponse, status_code=status.HTTP_201_CREATED)
def create_teacher(teacher: schemas.TeacherCreate, db: Session = Depends(get_db)):
    """Create a new teacher"""
    try:
        db_teacher = models.Teacher(**teacher.model_dump())
        db.add(db_teacher)
        db.commit()
        db.refresh(db_teacher)
        return db_teacher
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Teacher with email '{teacher.email}' already exists"
        )

@router.get("/teachers", response_model=List[schemas.TeacherResponse])
def read_teachers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all teachers"""
    teachers = db.query(models.Teacher).offset(skip).limit(limit).all()
    return teachers

@router.get("/teachers/{teacher_id}", response_model=schemas.TeacherResponse)
def read_teacher(teacher_id: int, db: Session = Depends(get_db)):
    """Get a specific teacher by ID"""
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Teacher with id {teacher_id} not found"
        )
    return teacher

@router.put("/teachers/{teacher_id}", response_model=schemas.TeacherResponse)
def update_teacher(teacher_id: int, teacher: schemas.TeacherUpdate, db: Session = Depends(get_db)):
    """Update a teacher"""
    db_teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Teacher with id {teacher_id} not found"
        )
    try:
        for key, value in teacher.model_dump().items():
            setattr(db_teacher, key, value)
        db.commit()
        db.refresh(db_teacher)
        return db_teacher
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Teacher with email '{teacher.email}' already exists"
        )

@router.delete("/teachers/{teacher_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    """Delete a teacher"""
    db_teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Teacher with id {teacher_id} not found"
        )
    db.delete(db_teacher)
    db.commit()
    return None


# -------------------------
# Teacher Availability APIs
# -------------------------

@router.post("/teacher-availability", response_model=schemas.TeacherAvailabilityResponse, status_code=status.HTTP_201_CREATED)
def create_teacher_availability(availability: schemas.TeacherAvailabilityCreate, db: Session = Depends(get_db)):
    """Set teacher availability for a specific day/time"""
    teacher = db.query(models.Teacher).filter(models.Teacher.id == availability.teacher_id).first()
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Teacher with id {availability.teacher_id} not found"
        )
    db_availability = models.TeacherAvailability(**availability.model_dump())
    db.add(db_availability)
    db.commit()
    db.refresh(db_availability)
    return db_availability

@router.get("/teacher-availability/{teacher_id}", response_model=List[schemas.TeacherAvailabilityResponse])
def read_teacher_availability(teacher_id: int, db: Session = Depends(get_db)):
    """Get availability for a specific teacher"""
    availability = db.query(models.TeacherAvailability).filter(
        models.TeacherAvailability.teacher_id == teacher_id
    ).all()
    return availability


@router.delete("/teachers/{teacher_id}")
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if teacher:
        db.delete(teacher)
        db.commit()
    return {"message": "Teacher deleted successfully"}

# -------------------------
# Subject APIs
# -------------------------

@router.post("/subjects", response_model=schemas.SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    """Create a new subject"""
    db_subject = models.Subject(**subject.model_dump())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/subjects", response_model=List[schemas.SubjectResponse])
def read_subjects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all subjects"""
    subjects = db.query(models.Subject).offset(skip).limit(limit).all()
    return subjects

@router.get("/subjects/{subject_id}", response_model=schemas.SubjectResponse)
def read_subject(subject_id: int, db: Session = Depends(get_db)):
    """Get a specific subject by ID"""
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with id {subject_id} not found"
        )
    return subject

@router.put("/subjects/{subject_id}", response_model=schemas.SubjectResponse)
def update_subject(subject_id: int, subject: schemas.SubjectUpdate, db: Session = Depends(get_db)):
    """Update a subject"""
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with id {subject_id} not found"
        )
    for key, value in subject.model_dump().items():
        setattr(db_subject, key, value)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.delete("/subjects/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    """Delete a subject"""
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with id {subject_id} not found"
        )
    db.delete(db_subject)
    db.commit()
    return None


@router.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if subject:
        db.delete(subject)
        db.commit()
    return {"message": "Subject deleted successfully"}

# -------------------------
# Subject ↔ Teacher Mapping
# -------------------------

@router.post("/subject-teachers", response_model=schemas.SubjectTeacherResponse, status_code=status.HTTP_201_CREATED)
def assign_teacher(mapping: schemas.SubjectTeacherCreate, db: Session = Depends(get_db)):
    """Assign a teacher to a subject"""
    # Verify subject exists
    subject = db.query(models.Subject).filter(models.Subject.id == mapping.subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with id {mapping.subject_id} not found"
        )
    # Verify teacher exists
    teacher = db.query(models.Teacher).filter(models.Teacher.id == mapping.teacher_id).first()
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Teacher with id {mapping.teacher_id} not found"
        )
    # Check if mapping already exists
    existing = db.query(models.SubjectTeacher).filter(
        models.SubjectTeacher.subject_id == mapping.subject_id,
        models.SubjectTeacher.teacher_id == mapping.teacher_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This teacher is already assigned to this subject"
        )
    
    db_mapping = models.SubjectTeacher(**mapping.model_dump())
    db.add(db_mapping)
    db.commit()
    db.refresh(db_mapping)
    return db_mapping

@router.get("/subject-teachers", response_model=List[schemas.SubjectTeacherResponse])
def read_subject_teachers(db: Session = Depends(get_db)):
    """Get all subject-teacher mappings"""
    return db.query(models.SubjectTeacher).all()

@router.delete("/subject-teachers/{mapping_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_teacher_assignment(mapping_id: int, db: Session = Depends(get_db)):
    """Remove a teacher assignment from a subject"""
    db_mapping = db.query(models.SubjectTeacher).filter(models.SubjectTeacher.id == mapping_id).first()
    if not db_mapping:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject-teacher mapping with id {mapping_id} not found"
        )
    db.delete(db_mapping)
    db.commit()
    return None


# -------------------------
# Room APIs
# -------------------------

@router.post("/rooms", response_model=schemas.RoomResponse, status_code=status.HTTP_201_CREATED)
def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db)):
    """Create a new room/lab"""
    try:
        db_room = models.Room(**room.model_dump())
        db.add(db_room)
        db.commit()
        db.refresh(db_room)
        return db_room
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Room with name '{room.name}' already exists"
        )

@router.get("/rooms", response_model=List[schemas.RoomResponse])
def read_rooms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all rooms"""
    rooms = db.query(models.Room).offset(skip).limit(limit).all()
    return rooms

@router.get("/rooms/{room_id}", response_model=schemas.RoomResponse)
def read_room(room_id: int, db: Session = Depends(get_db)):
    """Get a specific room by ID"""
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room with id {room_id} not found"
        )
    return room

@router.put("/rooms/{room_id}", response_model=schemas.RoomResponse)
def update_room(room_id: int, room: schemas.RoomUpdate, db: Session = Depends(get_db)):
    """Update a room"""
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not db_room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room with id {room_id} not found"
        )
    try:
        for key, value in room.model_dump().items():
            setattr(db_room, key, value)
        db.commit()
        db.refresh(db_room)
        return db_room
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Room with name '{room.name}' already exists"
        )

@router.delete("/rooms/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    """Delete a room"""
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not db_room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room with id {room_id} not found"
        )
    db.delete(db_room)
    db.commit()
    return None


# -------------------------
# Timetable Configuration
# -------------------------

@router.post("/config", response_model=schemas.TimetableConfigResponse, status_code=status.HTTP_201_CREATED)
def create_config(config: schemas.TimetableConfigCreate, db: Session = Depends(get_db)):
    """Create timetable configuration"""
    db_config = models.TimetableConfig(**config.model_dump())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@router.get("/config", response_model=schemas.TimetableConfigResponse)
def read_config(db: Session = Depends(get_db)):
    """Get the latest timetable configuration"""
    config = db.query(models.TimetableConfig).order_by(models.TimetableConfig.id.desc()).first()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No timetable configuration found"
        )
    return config

@router.put("/config/{config_id}", response_model=schemas.TimetableConfigResponse)
def update_config(config_id: int, config: schemas.TimetableConfigCreate, db: Session = Depends(get_db)):
    """Update timetable configuration"""
    db_config = db.query(models.TimetableConfig).filter(models.TimetableConfig.id == config_id).first()
    if not db_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Configuration with id {config_id} not found"
        )
    for key, value in config.model_dump().items():
        setattr(db_config, key, value)
    db.commit()
    db.refresh(db_config)
    return db_config
from app.services.timetable_ai import generate_ai_timetable


@router.get("/generate-ai-timetable")
def generate_ai_timetable_api(db: Session = Depends(get_db)):
    return generate_ai_timetable(db)
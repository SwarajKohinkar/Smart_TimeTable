from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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

# Division APIs

@router.post("/divisions")
def add_division(division: schemas.DivisionCreate, db: Session = Depends(get_db)):
    new_division = models.Division(**division.dict())
    db.add(new_division)
    db.commit()
    return {"message": "Division added successfully"}

# Teacher APIs

@router.post("/teachers")
def add_teacher(teacher: schemas.TeacherCreate, db: Session = Depends(get_db)):
    new_teacher = models.Teacher(**teacher.dict())
    db.add(new_teacher)
    db.commit()
    return {"message": "Teacher added successfully"}



# Subject APIs (Lecture / Lab)

@router.post("/subjects")
def add_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    new_subject = models.Subject(**subject.dict())
    db.add(new_subject)
    db.commit()
    return {"message": "Subject added successfully"}


# Subject ↔ Teacher Mapping

@router.post("/subject-teachers")
def assign_teacher(
    mapping: schemas.SubjectTeacherCreate,
    db: Session = Depends(get_db)
):
    new_mapping = models.SubjectTeacher(**mapping.dict())
    db.add(new_mapping)
    db.commit()
    return {"message": "Teacher assigned to subject successfully"}

# Timetable Configuration
@router.post("/config")
def add_config(config: schemas.TimetableConfigCreate, db: Session = Depends(get_db)):
    new_config = models.TimetableConfig(**config.dict())
    db.add(new_config)
    db.commit()
    return {"message": "Timetable configuration saved"}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas

router = APIRouter()   


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/subjects")
def add_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    new_subject = models.Subject(**subject.dict())
    db.add(new_subject)
    db.commit()
    return {"message": "Subject added successfully"}


@router.post("/config")
def add_config(config: schemas.TimetableConfigCreate, db: Session = Depends(get_db)):
    new_config = models.TimetableConfig(**config.dict())
    db.add(new_config)
    db.commit()
    return {"message": "Timetable configuration saved"}

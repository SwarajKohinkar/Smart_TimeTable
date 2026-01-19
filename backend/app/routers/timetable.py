from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import TimetableConfig
from app.services.slot_generator import generate_weekly_slots

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/generate-slots")
def generate_slots(db: Session = Depends(get_db)):
    config = db.query(TimetableConfig).order_by(TimetableConfig.id.desc()).first()

    if not config:
        return {"error": "Timetable configuration not found"}

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

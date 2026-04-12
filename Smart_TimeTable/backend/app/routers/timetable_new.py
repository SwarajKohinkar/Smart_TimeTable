from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import TimetableConfig, Division, Subject, Teacher, SubjectTeacher
from app.services.slot_generator import generate_weekly_slots
from app.services.timetable_ai import generate_ai_timetable

router = APIRouter()

# DB Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Slot Preview API (unchanged)

@router.get("/generate-slots")
def generate_slots(db: Session = Depends(get_db)):
    config = db.query(TimetableConfig).order_by(TimetableConfig.id.desc()).first()

    if not config:
        raise HTTPException(status_code=400, detail="Timetable configuration not found. Go to Input Data → Configuration and click Save Configuration.")

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


# Readiness Score API (NEW)

@router.get("/readiness-score")
def get_readiness_score(db: Session = Depends(get_db)):
    """
    Analyze input data readiness. Returns a score (0-100) and detailed feedback.
    """
    config = db.query(TimetableConfig).order_by(TimetableConfig.id.desc()).first()
    divisions = db.query(Division).all()
    subjects = db.query(Subject).all()
    teachers = db.query(Teacher).all()
    mappings = db.query(SubjectTeacher).all()

    score = 0
    warnings = []
    errors = []

    # Configuration check (20 points)
    if config:
        score += 20
    else:
        errors.append("No configuration saved. Set working days, times, and breaks.")

    # Divisions check (20 points)
    if len(divisions) >= 2:
        score += 20
    elif len(divisions) == 1:
        score += 10
        warnings.append("Only 1 division. Consider adding more for meaningful timetables.")
    else:
        errors.append("No divisions added. Add at least 2 divisions.")

    # Teachers check (20 points)
    if len(teachers) >= 5:
        score += 20
    elif len(teachers) >= 2:
        score += 10
        warnings.append(f"Only {len(teachers)} teachers. Consider adding more for flexibility.")
    else:
        errors.append("Insufficient teachers. Add at least 2.")

    # Subjects check (20 points)
    if len(subjects) >= 5:
        score += 20
    elif len(subjects) >= 2:
        score += 10
        warnings.append(f"Only {len(subjects)} subjects. Add more for diversity.")
    else:
        errors.append("Insufficient subjects. Add at least 2.")

    # Teacher-Subject mapping check (20 points)
    if len(mappings) >= len(subjects):
        score += 20
    elif len(mappings) > 0:
        score += 10
        warnings.append(
            f"Only {len(mappings)}/{len(subjects)} subjects mapped to teachers. "
            "Map more subjects to teachers for optimal scheduling."
        )
    else:
        warnings.append(
            "No teacher-subject mappings. AI will assign randomly. "
            "Add mappings in Teacher-Subject Mapping for better results."
        )

    # Weekly hours feasibility check
    if subjects:
        total_weekly_hours = sum(s.weekly_hours for s in subjects)
        if config:
            slots_per_day = 6  # Approximate
            available_slots = config.working_days * slots_per_day * len(divisions)
            weekly_slots_needed = total_weekly_hours * len(divisions)

            if weekly_slots_needed > available_slots:
                warnings.append(
                    f"Not enough slots ({weekly_slots_needed} needed, {available_slots} available). "
                    "Consider reducing subject hours or adding more days."
                )

    return {
        "score": min(score, 100),
        "is_ready": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "summary": {
            "divisions": len(divisions),
            "teachers": len(teachers),
            "subjects": len(subjects),
            "mappings": len(mappings),
        }
    }


# AI Timetable API (NEW)

@router.get("/generate-ai-timetable")
def generate_ai(db: Session = Depends(get_db)):
    # Validate all required data exists
    config = db.query(TimetableConfig).order_by(TimetableConfig.id.desc()).first()
    divisions = db.query(Division).all()
    subjects = db.query(Subject).all()
    teachers = db.query(Teacher).all()
    
    if not config:
        raise HTTPException(status_code=400, detail="Configuration not found. Go to Input Data → Configuration and click Save Configuration.")
    
    if not divisions:
        raise HTTPException(status_code=400, detail="No divisions found. Add divisions in Input Data → Divisions tab first.")
    
    if not subjects:
        raise HTTPException(status_code=400, detail="No subjects found. Add subjects in Input Data → Subjects tab first.")
    
    if not teachers:
        raise HTTPException(status_code=400, detail="No teachers found. Add teachers in Input Data → Teachers tab first.")
    
    return generate_ai_timetable(db)

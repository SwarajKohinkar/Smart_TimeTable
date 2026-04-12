from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Response
from sqlalchemy.orm import Session
from typing import List
import csv
import io
import json
from datetime import datetime

from app.database import SessionLocal
from app import models, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CSV Export Endpoints
@router.get("/export/subjects/csv")
def export_subjects_csv(db: Session = Depends(get_db)):
    """Export subjects to CSV"""
    subjects = db.query(models.Subject).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['id', 'name', 'category', 'is_lab', 'weekly_hours', 'teachers_required', 'requires_lab'])
    
    for s in subjects:
        writer.writerow([s.id, s.name, s.category, s.is_lab, s.weekly_hours, s.teachers_required, s.requires_lab])
    
    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=subjects_{datetime.now().strftime('%Y%m%d')}.csv"}
    )


@router.get("/export/teachers/csv")
def export_teachers_csv(db: Session = Depends(get_db)):
    """Export teachers to CSV"""
    teachers = db.query(models.Teacher).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['id', 'name', 'email', 'max_hours_per_week'])
    
    for t in teachers:
        writer.writerow([t.id, t.name, t.email or '', t.max_hours_per_week])
    
    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=teachers_{datetime.now().strftime('%Y%m%d')}.csv"}
    )


@router.get("/export/divisions/csv")
def export_divisions_csv(db: Session = Depends(get_db)):
    """Export divisions to CSV"""
    divisions = db.query(models.Division).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['id', 'name'])
    
    for d in divisions:
        writer.writerow([d.id, d.name])
    
    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=divisions_{datetime.now().strftime('%Y%m%d')}.csv"}
    )


@router.get("/export/rooms/csv")
def export_rooms_csv(db: Session = Depends(get_db)):
    """Export rooms to CSV"""
    rooms = db.query(models.Room).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['id', 'name', 'building', 'capacity', 'room_type', 'facilities', 'is_available'])
    
    for r in rooms:
        writer.writerow([r.id, r.name, r.building or '', r.capacity, r.room_type, r.facilities or '', r.is_available])
    
    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=rooms_{datetime.now().strftime('%Y%m%d')}.csv"}
    )


@router.get("/export/timetable/{version_id}/csv")
def export_timetable_csv(version_id: int, db: Session = Depends(get_db)):
    """Export timetable version to CSV"""
    version = db.query(models.TimetableVersion).filter(models.TimetableVersion.id == version_id).first()
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Timetable version with id {version_id} not found"
        )
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['division', 'day', 'time', 'subject', 'type'])
    
    timetable_data = version.timetable_data
    if "timetable" in timetable_data:
        for division_data in timetable_data["timetable"]:
            division = division_data.get("division")
            for day_data in division_data.get("days", []):
                day = day_data.get("day")
                for slot in day_data.get("slots", []):
                    writer.writerow([
                        division,
                        day,
                        slot.get("time"),
                        slot.get("subject"),
                        slot.get("type")
                    ])
    
    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=timetable_v{version_id}_{datetime.now().strftime('%Y%m%d')}.csv"}
    )


@router.get("/export/timetable/{version_id}/json")
def export_timetable_json(version_id: int, db: Session = Depends(get_db)):
    """Export timetable version to JSON"""
    version = db.query(models.TimetableVersion).filter(models.TimetableVersion.id == version_id).first()
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Timetable version with id {version_id} not found"
        )
    
    return Response(
        content=json.dumps(version.timetable_data, indent=2),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=timetable_v{version_id}_{datetime.now().strftime('%Y%m%d')}.json"}
    )


# CSV Import Endpoints
@router.post("/import/subjects/csv", response_model=schemas.BulkImportResponse)
async def import_subjects_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Import subjects from CSV"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV"
        )
    
    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    
    success = 0
    failed = 0
    errors = []
    
    for row in reader:
        try:
            subject = models.Subject(
                name=row['name'],
                category=row.get('category', 'Other'),
                is_lab=row.get('is_lab', 'false').lower() == 'true',
                weekly_hours=int(row.get('weekly_hours', 1)),
                teachers_required=int(row.get('teachers_required', 1)),
                requires_lab=row.get('requires_lab', 'false').lower() == 'true'
            )
            db.add(subject)
            success += 1
        except Exception as e:
            failed += 1
            errors.append(f"Row {reader.line_num}: {str(e)}")
    
    db.commit()
    return schemas.BulkImportResponse(success=success, failed=failed, errors=errors)


@router.post("/import/teachers/csv", response_model=schemas.BulkImportResponse)
async def import_teachers_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Import teachers from CSV"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV"
        )
    
    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    
    success = 0
    failed = 0
    errors = []
    
    for row in reader:
        try:
            teacher = models.Teacher(
                name=row['name'],
                email=row.get('email') or None,
                max_hours_per_week=int(row.get('max_hours_per_week', 20))
            )
            db.add(teacher)
            success += 1
        except Exception as e:
            failed += 1
            errors.append(f"Row {reader.line_num}: {str(e)}")
    
    db.commit()
    return schemas.BulkImportResponse(success=success, failed=failed, errors=errors)


@router.post("/import/divisions/csv", response_model=schemas.BulkImportResponse)
async def import_divisions_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Import divisions from CSV"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV"
        )
    
    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    
    success = 0
    failed = 0
    errors = []
    
    for row in reader:
        try:
            division = models.Division(name=row['name'])
            db.add(division)
            success += 1
        except Exception as e:
            failed += 1
            errors.append(f"Row {reader.line_num}: {str(e)}")
    
    db.commit()
    return schemas.BulkImportResponse(success=success, failed=failed, errors=errors)


@router.post("/import/rooms/csv", response_model=schemas.BulkImportResponse)
async def import_rooms_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Import rooms from CSV"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV"
        )
    
    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    
    success = 0
    failed = 0
    errors = []
    
    for row in reader:
        try:
            room = models.Room(
                name=row['name'],
                building=row.get('building') or None,
                capacity=int(row.get('capacity', 60)),
                room_type=row.get('room_type', 'Lecture'),
                facilities=row.get('facilities') or None,
                is_available=row.get('is_available', 'true').lower() == 'true'
            )
            db.add(room)
            success += 1
        except Exception as e:
            failed += 1
            errors.append(f"Row {reader.line_num}: {str(e)}")
    
    db.commit()
    return schemas.BulkImportResponse(success=success, failed=failed, errors=errors)


# Excel Export (using pandas)
@router.get("/export/all/excel")
def export_all_excel(db: Session = Depends(get_db)):
    """Export all data to Excel"""
    try:
        import pandas as pd
        
        output = io.BytesIO()
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Subjects
            subjects = db.query(models.Subject).all()
            df_subjects = pd.DataFrame([{
                'id': s.id, 'name': s.name, 'category': s.category,
                'is_lab': s.is_lab, 'weekly_hours': s.weekly_hours,
                'teachers_required': s.teachers_required
            } for s in subjects])
            df_subjects.to_excel(writer, sheet_name='Subjects', index=False)
            
            # Teachers
            teachers = db.query(models.Teacher).all()
            df_teachers = pd.DataFrame([{
                'id': t.id, 'name': t.name, 'email': t.email,
                'max_hours_per_week': t.max_hours_per_week
            } for t in teachers])
            df_teachers.to_excel(writer, sheet_name='Teachers', index=False)
            
            # Divisions
            divisions = db.query(models.Division).all()
            df_divisions = pd.DataFrame([{'id': d.id, 'name': d.name} for d in divisions])
            df_divisions.to_excel(writer, sheet_name='Divisions', index=False)
            
            # Rooms
            rooms = db.query(models.Room).all()
            df_rooms = pd.DataFrame([{
                'id': r.id, 'name': r.name, 'building': r.building,
                'capacity': r.capacity, 'room_type': r.room_type,
                'is_available': r.is_available
            } for r in rooms])
            df_rooms.to_excel(writer, sheet_name='Rooms', index=False)
        
        output.seek(0)
        return Response(
            content=output.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=timetable_data_{datetime.now().strftime('%Y%m%d')}.xlsx"}
        )
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Excel export requires pandas and openpyxl. Please install them."
        )

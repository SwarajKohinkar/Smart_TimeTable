from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime

# Division Schemas
class DivisionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=10, pattern="^[A-Za-z0-9]+$")

class DivisionCreate(DivisionBase):
    pass

class DivisionUpdate(DivisionBase):
    pass

class DivisionResponse(DivisionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Teacher Schemas
class TeacherBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    max_hours_per_week: int = Field(default=20, ge=1, le=40)

class TeacherCreate(TeacherBase):
    pass

class TeacherUpdate(TeacherBase):
    pass

class TeacherResponse(TeacherBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Teacher Availability Schemas
class TeacherAvailabilityBase(BaseModel):
    day: str = Field(..., pattern="^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$")
    start_time: str = Field(..., pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
    end_time: str = Field(..., pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
    is_available: bool = True

class TeacherAvailabilityCreate(TeacherAvailabilityBase):
    teacher_id: int

class TeacherAvailabilityResponse(TeacherAvailabilityBase):
    id: int
    teacher_id: int
    
    class Config:
        from_attributes = True


# Subject Schemas
class SubjectBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    category: str = Field(..., pattern="^(Major|Minor|OpenElective|COI|UHV|Other)$")
    is_lab: bool = False
    is_lecture: bool = True
    weekly_hours: int = Field(..., ge=1, le=20)
    teachers_required: int = Field(default=1, ge=1, le=5)
    requires_lab: bool = False
    preferred_room_id: Optional[int] = None

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(SubjectBase):
    pass

class SubjectResponse(SubjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Subject–Teacher Mapping Schema
class SubjectTeacherCreate(BaseModel):
    subject_id: int = Field(..., gt=0)
    teacher_id: int = Field(..., gt=0)

class SubjectTeacherResponse(SubjectTeacherCreate):
    id: int
    
    class Config:
        from_attributes = True


# Room Schemas
class RoomBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    building: Optional[str] = Field(None, max_length=100)
    capacity: int = Field(default=60, ge=1, le=500)
    room_type: str = Field(default="Lecture", pattern="^(Lecture|Lab|Seminar|Other)$")
    facilities: Optional[str] = None
    is_available: bool = True

class RoomCreate(RoomBase):
    pass

class RoomUpdate(RoomBase):
    pass

class RoomResponse(RoomBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Timetable Configuration Schema
class TimetableConfigBase(BaseModel):
    working_days: int = Field(..., ge=1, le=7)
    start_time: str = Field(..., pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
    end_time: str = Field(..., pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
    break_count: int = Field(..., ge=0, le=5)
    break_duration: int = Field(..., ge=5, le=120)
    
    @field_validator('end_time')
    @classmethod
    def end_time_after_start_time(cls, v, info):
        if 'start_time' in info.data and v <= info.data['start_time']:
            raise ValueError('end_time must be after start_time')
        return v

class TimetableConfigCreate(TimetableConfigBase):
    pass

class TimetableConfigResponse(TimetableConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Timetable Version Schemas
class TimetableVersionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None

class TimetableVersionCreate(TimetableVersionBase):
    timetable_data: dict

class TimetableVersionResponse(TimetableVersionBase):
    id: int
    timetable_data: dict
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Conflict Log Schemas
class ConflictLogResponse(BaseModel):
    id: int
    conflict_type: str
    description: str
    timetable_version_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True


# User Schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern="^[a-zA-Z0-9_]+$")
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


# Bulk Import Schemas
class BulkImportResponse(BaseModel):
    success: int
    failed: int
    errors: List[str] = []

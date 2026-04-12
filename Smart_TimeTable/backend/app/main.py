from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from sqlalchemy import inspect, text

from app.database import engine
from app import models

from app.routers.inputs import router as input_router
from app.routers.timetable import router as timetable_router
from app.routers.auth import router as auth_router
from app.routers.import_export import router as import_export_router
from app.routers.chat import router as chat_router

# Create all tables
models.Base.metadata.create_all(bind=engine)

# Migrate: add is_lecture column if missing
inspector = inspect(engine)
if "subjects" in inspector.get_table_names():
    columns = [col["name"] for col in inspector.get_columns("subjects")]
    if "is_lecture" not in columns:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE subjects ADD COLUMN is_lecture BOOLEAN DEFAULT 1"))

app = FastAPI(
    title="AI Timetable Generator",
    description="An intelligent timetable generation system using genetic algorithms",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred",
            "error": str(exc) if app.debug else "Internal server error"
        }
    )


# Health Check
@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "message": "AI Timetable Generator API is running"
    }


@app.get("/health")
def health():
    return {"status": "ok"}


# Include Routers
app.include_router(input_router, prefix="/api", tags=["Inputs"])
app.include_router(timetable_router, prefix="/api", tags=["Timetable"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(import_export_router, prefix="/api", tags=["Import/Export"])
app.include_router(chat_router, prefix="/api", tags=["AI Chat"])

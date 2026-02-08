from fastapi import FastAPI
from app.database import engine
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.routers.inputs import router as input_router
from app.routers.timetable import router as timetable_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Timetable Generator",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(input_router, prefix="/api", tags=["Inputs"])
app.include_router(timetable_router, prefix="/api", tags=["Timetable"])

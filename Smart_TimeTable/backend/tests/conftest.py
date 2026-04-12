import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.main import app
from fastapi.testclient import TestClient


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database session override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    from app.database import get_db
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def sample_division():
    return {
        "name": "Division A",
        "year": 1,
        "program": "Computer Science"
    }


@pytest.fixture
def sample_teacher():
    return {
        "name": "Dr. John Smith",
        "email": "john.smith@university.edu",
        "department": "Computer Science",
        "max_hours_per_week": 20
    }


@pytest.fixture
def sample_subject():
    return {
        "name": "Data Structures",
        "code": "CS101",
        "category": "Major",
        "weekly_hours": 4,
        "is_lab": False
    }


@pytest.fixture
def sample_room():
    return {
        "name": "Room 101",
        "room_type": "Lecture",
        "capacity": 60,
        "building": "Main Building",
        "is_available": True
    }


@pytest.fixture
def sample_config():
    return {
        "working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "start_time": "09:00",
        "end_time": "17:00",
        "break_count": 1,
        "break_duration": 60,
        "slot_duration": 60
    }


@pytest.fixture
def auth_headers(client):
    """Create a user and return auth headers."""
    # Register user
    client.post("/api/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    })
    
    # Login
    response = client.post("/api/auth/login", data={
        "username": "testuser",
        "password": "testpassword123"
    })
    
    token = response.json().get("access_token")
    return {"Authorization": f"Bearer {token}"}

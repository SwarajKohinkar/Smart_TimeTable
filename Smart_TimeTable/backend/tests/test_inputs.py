"""Tests for input data CRUD endpoints."""
import pytest
from fastapi import status


class TestDivisions:
    """Test division endpoints."""
    
    def test_create_division(self, client, sample_division):
        """Test creating a new division."""
        response = client.post("/api/divisions", json=sample_division)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == sample_division["name"]
        assert data["year"] == sample_division["year"]
        assert "id" in data

    def test_create_division_duplicate(self, client, sample_division):
        """Test creating duplicate division returns 409."""
        client.post("/api/divisions", json=sample_division)
        response = client.post("/api/divisions", json=sample_division)
        assert response.status_code == status.HTTP_409_CONFLICT

    def test_get_divisions(self, client, sample_division):
        """Test getting all divisions."""
        client.post("/api/divisions", json=sample_division)
        response = client.get("/api/divisions")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 1

    def test_get_division_by_id(self, client, sample_division):
        """Test getting a specific division."""
        create_response = client.post("/api/divisions", json=sample_division)
        division_id = create_response.json()["id"]
        
        response = client.get(f"/api/divisions/{division_id}")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["name"] == sample_division["name"]

    def test_get_division_not_found(self, client):
        """Test getting non-existent division returns 404."""
        response = client.get("/api/divisions/999")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_division(self, client, sample_division):
        """Test updating a division."""
        create_response = client.post("/api/divisions", json=sample_division)
        division_id = create_response.json()["id"]
        
        update_data = {"name": "Division B", "year": 2, "program": "Electronics"}
        response = client.put(f"/api/divisions/{division_id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["name"] == "Division B"

    def test_delete_division(self, client, sample_division):
        """Test deleting a division."""
        create_response = client.post("/api/divisions", json=sample_division)
        division_id = create_response.json()["id"]
        
        response = client.delete(f"/api/divisions/{division_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify deleted
        get_response = client.get(f"/api/divisions/{division_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND


class TestTeachers:
    """Test teacher endpoints."""
    
    def test_create_teacher(self, client, sample_teacher):
        """Test creating a new teacher."""
        response = client.post("/api/teachers", json=sample_teacher)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == sample_teacher["name"]
        assert data["email"] == sample_teacher["email"]

    def test_create_teacher_duplicate_email(self, client, sample_teacher):
        """Test creating teacher with duplicate email returns 409."""
        client.post("/api/teachers", json=sample_teacher)
        response = client.post("/api/teachers", json=sample_teacher)
        assert response.status_code == status.HTTP_409_CONFLICT

    def test_get_teachers(self, client, sample_teacher):
        """Test getting all teachers."""
        client.post("/api/teachers", json=sample_teacher)
        response = client.get("/api/teachers")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) >= 1

    def test_update_teacher(self, client, sample_teacher):
        """Test updating a teacher."""
        create_response = client.post("/api/teachers", json=sample_teacher)
        teacher_id = create_response.json()["id"]
        
        update_data = {"name": "Dr. Jane Doe", "email": "jane.doe@university.edu", 
                       "department": "Mathematics", "max_hours_per_week": 15}
        response = client.put(f"/api/teachers/{teacher_id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["name"] == "Dr. Jane Doe"

    def test_delete_teacher(self, client, sample_teacher):
        """Test deleting a teacher."""
        create_response = client.post("/api/teachers", json=sample_teacher)
        teacher_id = create_response.json()["id"]
        
        response = client.delete(f"/api/teachers/{teacher_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT


class TestSubjects:
    """Test subject endpoints."""
    
    def test_create_subject(self, client, sample_subject):
        """Test creating a new subject."""
        response = client.post("/api/subjects", json=sample_subject)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == sample_subject["name"]
        assert data["code"] == sample_subject["code"]

    def test_get_subjects(self, client, sample_subject):
        """Test getting all subjects."""
        client.post("/api/subjects", json=sample_subject)
        response = client.get("/api/subjects")
        assert response.status_code == status.HTTP_200_OK

    def test_update_subject(self, client, sample_subject):
        """Test updating a subject."""
        create_response = client.post("/api/subjects", json=sample_subject)
        subject_id = create_response.json()["id"]
        
        update_data = {**sample_subject, "name": "Advanced Data Structures", "weekly_hours": 5}
        response = client.put(f"/api/subjects/{subject_id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK

    def test_delete_subject(self, client, sample_subject):
        """Test deleting a subject."""
        create_response = client.post("/api/subjects", json=sample_subject)
        subject_id = create_response.json()["id"]
        
        response = client.delete(f"/api/subjects/{subject_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT


class TestRooms:
    """Test room endpoints."""
    
    def test_create_room(self, client, sample_room):
        """Test creating a new room."""
        response = client.post("/api/rooms", json=sample_room)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == sample_room["name"]
        assert data["room_type"] == sample_room["room_type"]

    def test_get_rooms(self, client, sample_room):
        """Test getting all rooms."""
        client.post("/api/rooms", json=sample_room)
        response = client.get("/api/rooms")
        assert response.status_code == status.HTTP_200_OK

    def test_update_room(self, client, sample_room):
        """Test updating a room."""
        create_response = client.post("/api/rooms", json=sample_room)
        room_id = create_response.json()["id"]
        
        update_data = {**sample_room, "name": "Room 102", "capacity": 80}
        response = client.put(f"/api/rooms/{room_id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK

    def test_delete_room(self, client, sample_room):
        """Test deleting a room."""
        create_response = client.post("/api/rooms", json=sample_room)
        room_id = create_response.json()["id"]
        
        response = client.delete(f"/api/rooms/{room_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT

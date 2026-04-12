"""Tests for timetable generation and versioning endpoints."""
import pytest
from fastapi import status


class TestTimetableGeneration:
    """Test timetable generation endpoints."""
    
    def test_generate_slots(self, client, sample_config):
        """Test slot generation."""
        # Create config first
        client.post("/api/config", json=sample_config)
        
        response = client.get("/api/generate-slots")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "slots" in data

    def test_generate_ai_timetable_no_data(self, client):
        """Test AI timetable generation without data returns error."""
        response = client.get("/api/generate-ai-timetable")
        # Should work but return empty or error
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST]

    def test_generate_ai_timetable_with_data(self, client, sample_division, 
                                              sample_teacher, sample_subject, 
                                              sample_config):
        """Test AI timetable generation with data."""
        # Create prerequisite data
        client.post("/api/divisions", json=sample_division)
        client.post("/api/teachers", json=sample_teacher)
        client.post("/api/subjects", json=sample_subject)
        client.post("/api/config", json=sample_config)
        
        response = client.get("/api/generate-ai-timetable")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "timetable" in data


class TestTimetableVersions:
    """Test timetable versioning endpoints."""
    
    def test_save_version(self, client):
        """Test saving a timetable version."""
        response = client.post("/api/versions", json={
            "name": "Version 1",
            "description": "First version",
            "timetable_data": {"divisions": []}
        })
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "Version 1"

    def test_get_versions(self, client):
        """Test getting all versions."""
        client.post("/api/versions", json={
            "name": "Version 1",
            "description": "First version",
            "timetable_data": {"divisions": []}
        })
        
        response = client.get("/api/versions")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) >= 1

    def test_get_version_by_id(self, client):
        """Test getting a specific version."""
        create_response = client.post("/api/versions", json={
            "name": "Version 1",
            "description": "First version",
            "timetable_data": {"divisions": []}
        })
        version_id = create_response.json()["id"]
        
        response = client.get(f"/api/versions/{version_id}")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["name"] == "Version 1"

    def test_activate_version(self, client):
        """Test activating a version."""
        create_response = client.post("/api/versions", json={
            "name": "Version to Activate",
            "description": "Test activation",
            "timetable_data": {"divisions": []}
        })
        version_id = create_response.json()["id"]
        
        response = client.put(f"/api/versions/{version_id}/activate")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["is_active"] == True

    def test_delete_version(self, client):
        """Test deleting a version."""
        create_response = client.post("/api/versions", json={
            "name": "Version to Delete",
            "description": "Test deletion",
            "timetable_data": {"divisions": []}
        })
        version_id = create_response.json()["id"]
        
        response = client.delete(f"/api/versions/{version_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT


class TestConflictDetection:
    """Test conflict detection endpoints."""
    
    def test_detect_conflicts(self, client):
        """Test conflict detection."""
        # Create a version first
        create_response = client.post("/api/versions", json={
            "name": "Test Version",
            "description": "For conflict detection",
            "timetable_data": {
                "divisions": [{
                    "division": "Division A",
                    "days": [{
                        "day": "Monday",
                        "slots": [{
                            "time": "09:00",
                            "subject": "Math",
                            "type": "Theory",
                            "teachers": [1]
                        }]
                    }]
                }]
            }
        })
        version_id = create_response.json()["id"]
        
        response = client.get(f"/api/detect-conflicts/{version_id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "conflicts" in data or isinstance(data, list)

    def test_get_conflicts(self, client):
        """Test getting all conflicts."""
        response = client.get("/api/conflicts")
        assert response.status_code == status.HTTP_200_OK


class TestTeacherWorkload:
    """Test teacher workload endpoint."""
    
    def test_get_teacher_workload(self, client):
        """Test getting teacher workload."""
        response = client.get("/api/teacher-workload")
        assert response.status_code == status.HTTP_200_OK


class TestShareLinks:
    """Test share link endpoints."""
    
    def test_create_share_link(self, client):
        """Test creating a share link."""
        # Create a version first
        create_response = client.post("/api/versions", json={
            "name": "Shareable Version",
            "description": "For sharing",
            "timetable_data": {"divisions": []}
        })
        version_id = create_response.json()["id"]
        
        response = client.post(f"/api/share/{version_id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "share_code" in data or "url" in data


class TestVersionComparison:
    """Test version comparison endpoint."""
    
    def test_compare_versions(self, client):
        """Test comparing two versions."""
        # Create two versions
        response1 = client.post("/api/versions", json={
            "name": "Version 1",
            "description": "First",
            "timetable_data": {"divisions": []}
        })
        version_id_1 = response1.json()["id"]
        
        response2 = client.post("/api/versions", json={
            "name": "Version 2",
            "description": "Second",
            "timetable_data": {"divisions": []}
        })
        version_id_2 = response2.json()["id"]
        
        response = client.get(f"/api/compare/{version_id_1}/{version_id_2}")
        assert response.status_code == status.HTTP_200_OK

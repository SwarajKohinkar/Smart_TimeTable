"""Tests for import/export endpoints."""
import pytest
import io
import csv
from fastapi import status


class TestExport:
    """Test export endpoints."""
    
    def test_export_subjects_csv(self, client, sample_subject):
        """Test exporting subjects as CSV."""
        client.post("/api/subjects", json=sample_subject)
        
        response = client.get("/api/export/subjects/csv")
        assert response.status_code == status.HTTP_200_OK
        assert response.headers["content-type"] == "text/csv; charset=utf-8"

    def test_export_teachers_csv(self, client, sample_teacher):
        """Test exporting teachers as CSV."""
        client.post("/api/teachers", json=sample_teacher)
        
        response = client.get("/api/export/teachers/csv")
        assert response.status_code == status.HTTP_200_OK
        assert response.headers["content-type"] == "text/csv; charset=utf-8"

    def test_export_divisions_csv(self, client, sample_division):
        """Test exporting divisions as CSV."""
        client.post("/api/divisions", json=sample_division)
        
        response = client.get("/api/export/divisions/csv")
        assert response.status_code == status.HTTP_200_OK
        assert response.headers["content-type"] == "text/csv; charset=utf-8"

    def test_export_rooms_csv(self, client, sample_room):
        """Test exporting rooms as CSV."""
        client.post("/api/rooms", json=sample_room)
        
        response = client.get("/api/export/rooms/csv")
        assert response.status_code == status.HTTP_200_OK
        assert response.headers["content-type"] == "text/csv; charset=utf-8"

    def test_export_all_excel(self, client, sample_division, sample_teacher, 
                               sample_subject, sample_room):
        """Test exporting all data as Excel."""
        client.post("/api/divisions", json=sample_division)
        client.post("/api/teachers", json=sample_teacher)
        client.post("/api/subjects", json=sample_subject)
        client.post("/api/rooms", json=sample_room)
        
        response = client.get("/api/export/all/excel")
        assert response.status_code == status.HTTP_200_OK
        assert "spreadsheet" in response.headers["content-type"] or \
               "octet-stream" in response.headers["content-type"]


class TestImport:
    """Test import endpoints."""
    
    def _create_csv_file(self, headers, rows):
        """Helper to create a CSV file for testing."""
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(headers)
        for row in rows:
            writer.writerow(row)
        output.seek(0)
        return output.getvalue().encode('utf-8')

    def test_import_subjects_csv(self, client):
        """Test importing subjects from CSV."""
        csv_content = self._create_csv_file(
            ["name", "code", "category", "weekly_hours", "is_lab"],
            [["Algorithms", "CS201", "Major", "4", "false"]]
        )
        
        files = {"file": ("subjects.csv", csv_content, "text/csv")}
        response = client.post("/api/import/subjects/csv", files=files)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["imported_count"] >= 1

    def test_import_teachers_csv(self, client):
        """Test importing teachers from CSV."""
        csv_content = self._create_csv_file(
            ["name", "email", "department", "max_hours_per_week"],
            [["Dr. Smith", "smith@uni.edu", "CS", "20"]]
        )
        
        files = {"file": ("teachers.csv", csv_content, "text/csv")}
        response = client.post("/api/import/teachers/csv", files=files)
        assert response.status_code == status.HTTP_200_OK

    def test_import_divisions_csv(self, client):
        """Test importing divisions from CSV."""
        csv_content = self._create_csv_file(
            ["name", "year", "program"],
            [["Division B", "2", "Electronics"]]
        )
        
        files = {"file": ("divisions.csv", csv_content, "text/csv")}
        response = client.post("/api/import/divisions/csv", files=files)
        assert response.status_code == status.HTTP_200_OK

    def test_import_rooms_csv(self, client):
        """Test importing rooms from CSV."""
        csv_content = self._create_csv_file(
            ["name", "room_type", "capacity", "building", "is_available"],
            [["Lab 201", "Lab", "30", "Science Block", "true"]]
        )
        
        files = {"file": ("rooms.csv", csv_content, "text/csv")}
        response = client.post("/api/import/rooms/csv", files=files)
        assert response.status_code == status.HTTP_200_OK

    def test_import_with_errors(self, client):
        """Test import with invalid data returns partial results."""
        csv_content = self._create_csv_file(
            ["name", "code", "category", "weekly_hours", "is_lab"],
            [["Valid Subject", "CS301", "Major", "4", "false"],
             ["", "", "", "", ""]]  # Invalid row
        )
        
        files = {"file": ("subjects.csv", csv_content, "text/csv")}
        response = client.post("/api/import/subjects/csv", files=files)
        # Should still succeed with partial import
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_207_MULTI_STATUS]

"""Tests for authentication endpoints."""
import pytest
from fastapi import status


class TestAuth:
    """Test authentication endpoints."""
    
    def test_register_user(self, client):
        """Test user registration."""
        response = client.post("/api/auth/register", json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        })
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["username"] == "newuser"
        assert data["email"] == "newuser@example.com"
        assert "id" in data

    def test_register_duplicate_username(self, client):
        """Test registering duplicate username returns 409."""
        client.post("/api/auth/register", json={
            "username": "duplicateuser",
            "email": "user1@example.com",
            "password": "password123"
        })
        response = client.post("/api/auth/register", json={
            "username": "duplicateuser",
            "email": "user2@example.com",
            "password": "password123"
        })
        assert response.status_code == status.HTTP_409_CONFLICT

    def test_register_duplicate_email(self, client):
        """Test registering duplicate email returns 409."""
        client.post("/api/auth/register", json={
            "username": "user1",
            "email": "duplicate@example.com",
            "password": "password123"
        })
        response = client.post("/api/auth/register", json={
            "username": "user2",
            "email": "duplicate@example.com",
            "password": "password123"
        })
        assert response.status_code == status.HTTP_409_CONFLICT

    def test_login_success(self, client):
        """Test successful login."""
        client.post("/api/auth/register", json={
            "username": "loginuser",
            "email": "login@example.com",
            "password": "password123"
        })
        
        response = client.post("/api/auth/login", data={
            "username": "loginuser",
            "password": "password123"
        })
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_username(self, client):
        """Test login with invalid username."""
        response = client.post("/api/auth/login", data={
            "username": "nonexistent",
            "password": "password123"
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_invalid_password(self, client):
        """Test login with invalid password."""
        client.post("/api/auth/register", json={
            "username": "wrongpassuser",
            "email": "wrongpass@example.com",
            "password": "correctpassword"
        })
        
        response = client.post("/api/auth/login", data={
            "username": "wrongpassuser",
            "password": "wrongpassword"
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user(self, client, auth_headers):
        """Test getting current user with valid token."""
        response = client.get("/api/auth/me", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["username"] == "testuser"

    def test_get_current_user_no_token(self, client):
        """Test getting current user without token returns 401."""
        response = client.get("/api/auth/me")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user_invalid_token(self, client):
        """Test getting current user with invalid token returns 401."""
        response = client.get("/api/auth/me", headers={
            "Authorization": "Bearer invalid_token"
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout(self, client, auth_headers):
        """Test logout endpoint."""
        response = client.post("/api/auth/logout", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK

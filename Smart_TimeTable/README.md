# Smart TimeTable ΓÇö AI Timetable Generator

An intelligent timetable generation system that uses **genetic algorithms** to automatically create conflict-free academic schedules. Built with a React frontend and FastAPI backend.

---

## System Architecture

```
User (Browser)
      Γåô
React Frontend (UI Forms & Display)
      Γåô API Requests (Axios)
FastAPI Backend (Timetable Logic + AI)
      Γåô
SQLite Database (local) / Supabase PostgreSQL (production)
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** (Vite) | UI framework & build tool |
| **Tailwind CSS 3** | Utility-first CSS styling |
| **React Router DOM 6** | Client-side routing |
| **Axios** | HTTP requests to backend API |
| **Recharts** | Charts & statistics dashboards |
| **Framer Motion** | Animations & transitions |
| **Lucide React** | Icon library |
| **Zustand** | Lightweight state management |
| **jsPDF + jspdf-autotable** | PDF export of timetables |
| **html2pdf.js** | HTML-to-PDF conversion |

### Backend

| Technology | Purpose |
|---|---|
| **Python 3** | Backend language |
| **FastAPI** | REST API framework |
| **Uvicorn** | ASGI server |
| **SQLAlchemy** | ORM & database access |
| **Pydantic** | Data validation & schemas |
| **NumPy** | Numerical operations for optimization |
| **Pandas** | Data processing |
| **Genetic Algorithm** | Custom timetable optimization engine |
| **python-jose** | JWT authentication |
| **passlib + bcrypt** | Password hashing |
| **openpyxl** | Excel import/export |

### Database

| Technology | Purpose |
|---|---|
| **SQLite** | Local development database |
| **Supabase (PostgreSQL)** | Production hosted database |

### DevOps / Testing

| Technology | Purpose |
|---|---|
| **Pytest** | Backend unit & integration tests |
| **httpx** | Async test client for FastAPI |
| **Vite** | Frontend dev server & build |
| **PostCSS + Autoprefixer** | CSS processing |

---

## Prerequisites

Make sure you have the following installed before starting:

- **Python 3.10+** ΓÇö [Download](https://www.python.org/downloads/)
- **Node.js 18+** (includes npm) ΓÇö [Download](https://nodejs.org/)
- **Git** ΓÇö [Download](https://git-scm.com/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Smart_TimeTable
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Windows (CMD):
.venv\Scripts\activate.bat
# macOS / Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install Node dependencies
npm install
```

---

## Running the Project

### Start the Backend Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The API will be available at: **http://localhost:8000**

- Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Start the Frontend Dev Server

```bash
cd frontend
npm run dev
```

The frontend will be available at: **http://localhost:5173**

> The Vite dev server is pre-configured to proxy `/api` requests to the backend at `http://localhost:8000`.

---

## Running Tests

### Backend Tests

```bash
cd backend
pytest
```

With coverage:

```bash
pytest --cov=app
```

---

## Project Structure

```
Smart_TimeTable/
Γö£ΓöÇΓöÇ backend/
Γöé   Γö£ΓöÇΓöÇ app/
Γöé   Γöé   Γö£ΓöÇΓöÇ main.py              # FastAPI app entry point
Γöé   Γöé   Γö£ΓöÇΓöÇ database.py          # SQLAlchemy DB setup
Γöé   Γöé   Γö£ΓöÇΓöÇ models.py            # Database models
Γöé   Γöé   Γö£ΓöÇΓöÇ schemas.py           # Pydantic schemas
Γöé   Γöé   Γö£ΓöÇΓöÇ routers/             # API route handlers
Γöé   Γöé   Γöé   Γö£ΓöÇΓöÇ auth.py          # Authentication endpoints
Γöé   Γöé   Γöé   Γö£ΓöÇΓöÇ chat.py          # AI chat endpoints
Γöé   Γöé   Γöé   Γö£ΓöÇΓöÇ import_export.py # Excel import/export
Γöé   Γöé   Γöé   Γö£ΓöÇΓöÇ inputs.py        # Academic data CRUD
Γöé   Γöé   Γöé   ΓööΓöÇΓöÇ timetable.py     # Timetable generation
Γöé   Γöé   Γö£ΓöÇΓöÇ services/            # Business logic
Γöé   Γöé   Γöé   Γö£ΓöÇΓöÇ genetic_algorithm.py  # GA-based optimizer
Γöé   Γöé   Γöé   Γö£ΓöÇΓöÇ constraints.py        # Scheduling constraints
Γöé   Γöé   Γöé   Γö£ΓöÇΓöÇ slot_generator.py     # Time slot generation
Γöé   Γöé   Γöé   ΓööΓöÇΓöÇ timetable_ai.py       # AI timetable service
Γöé   Γöé   ΓööΓöÇΓöÇ utils/
Γöé   Γöé       ΓööΓöÇΓöÇ time_utils.py
Γöé   Γö£ΓöÇΓöÇ tests/                   # Pytest test suite
Γöé   Γö£ΓöÇΓöÇ requirements.txt         # Python dependencies
Γöé   ΓööΓöÇΓöÇ pytest.ini               # Pytest configuration
Γöé
Γö£ΓöÇΓöÇ frontend/
Γöé   Γö£ΓöÇΓöÇ src/
Γöé   Γöé   Γö£ΓöÇΓöÇ App.jsx              # Root component & routes
Γöé   Γöé   Γö£ΓöÇΓöÇ pages/               # Page components
Γöé   Γöé   Γö£ΓöÇΓöÇ components/          # Reusable UI components
Γöé   Γöé   Γö£ΓöÇΓöÇ services/api.js      # Axios API client
Γöé   Γöé   Γö£ΓöÇΓöÇ store/               # Zustand state stores
Γöé   Γöé   Γö£ΓöÇΓöÇ context/             # React context providers
Γöé   Γöé   ΓööΓöÇΓöÇ utils/               # Utility functions
Γöé   Γö£ΓöÇΓöÇ package.json             # Node dependencies
Γöé   Γö£ΓöÇΓöÇ vite.config.js           # Vite configuration
Γöé   Γö£ΓöÇΓöÇ tailwind.config.js       # Tailwind CSS config
Γöé   ΓööΓöÇΓöÇ postcss.config.js        # PostCSS config
Γöé
ΓööΓöÇΓöÇ README.md
```

---

## API Endpoints Overview

| Prefix | Tag | Description |
|---|---|---|
| `/api` | Inputs | CRUD for teachers, subjects, rooms, divisions |
| `/api` | Timetable | Generate & retrieve timetables |
| `/api/auth` | Authentication | Register, login, JWT tokens |
| `/api` | Import/Export | Excel upload/download |
| `/api` | AI Chat | AI-powered scheduling assistant |

---

## Key Features

- **Genetic Algorithm Optimization** ΓÇö Automatically generates conflict-free timetables
- **Constraint Handling** ΓÇö Teacher availability, room capacity, no overlapping lectures
- **Excel Import/Export** ΓÇö Bulk data upload and timetable download
- **PDF Export** ΓÇö Download timetables as formatted PDFs
- **Statistics Dashboard** ΓÇö Visualize teacher workloads and schedule metrics
- **AI Chat Assistant** ΓÇö Ask questions about your timetable
- **Conflict Visualization** ΓÇö Identify and resolve scheduling conflicts
- **Version History** ΓÇö Track changes across timetable generations
- **Authentication** ΓÇö JWT-based user registration and login


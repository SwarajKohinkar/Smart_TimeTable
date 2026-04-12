# PIMPRI CHINCHWAD EDUCATION TRUST
## PIMPRI CHINCHWAD UNIVERSITY
### *Legacy of Nurturing Excellence Since 1990*
#### *(Established under Govt. of Maharashtra Act No. V of 2023)*

---

# CEP Project Group Meeting Log

---

---

## Meeting Log — 1

**Meeting Date:** 20/01/2026

**Meeting Number:** 01

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- Introduction of the project idea — AI-Powered Smart Timetable Generator.
- Identifying the core problem and discussing scope.
- Finalization of technology stack and system architecture.
- Database schema design and role distribution.

**Discussion Summary:**

Discussed challenges in manual timetable creation like teacher clashes, room conflicts, and uneven workload. Proposed a full-stack web app using Genetic Algorithm. Finalized tech stack: FastAPI + SQLAlchemy backend, React 18 + Vite + TailwindCSS frontend, SQLite for dev and Supabase PostgreSQL for production.

**Target(s) to meet before next meeting:**

- Set up development environment and project structure.
- Create SQLAlchemy ORM models for all 10 database tables.
- Design all REST API endpoints.

**Guide Signature:** ___________________________

---

---

## Meeting Log — 2

**Meeting Date:** 27/01/2026

**Meeting Number:** 02

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- Implementation of backend database layer with SQLAlchemy.
- Development of Pydantic validation schemas.
- Setup of FastAPI entry point and CORS configuration.
- Input Data router with CRUD endpoints.

**Discussion Summary:**

All 10 ORM models created (Division, Teacher, Subject, Room, TimetableConfig, etc.) with Pydantic schemas for validation. FastAPI configured with CORS middleware and health checks. Input Data router implemented with full CRUD for divisions, teachers, subjects, rooms, and subject-teacher mapping.

**Target(s) to meet before next meeting:**

- Set up frontend routing with React Router.
- Build InputData page with tabbed interface.
- Create Axios-based API service layer.

**Guide Signature:** ___________________________

---

---

## Meeting Log — 3

**Meeting Date:** 03/02/2026

**Meeting Number:** 03

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- Frontend page structure and routing setup.
- Slot generator service for weekly timetable structure.
- Timetable configuration endpoints.
- Generate Timetable page with slot preview.

**Discussion Summary:**

Frontend routing configured with 7 routes. Axios API service created with JWT auto-attachment. Slot Generator Service built to generate daily/weekly time slots with lecture/break types. Generate Timetable page implemented with Preview Mode (slot matrix) and AI Mode.

**Target(s) to meet before next meeting:**

- Design the core Genetic Algorithm service.
- Define chromosome encoding and fitness function.
- Implement genetic operators (crossover, mutation, selection).

**Guide Signature:** ___________________________

---

---

## Meeting Log — 4

**Meeting Date:** 10/02/2026

**Meeting Number:** 04

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- Design and implementation of the Genetic Algorithm service.
- Chromosome encoding and population initialization.
- Fitness function with multi-objective optimization.
- Genetic operators: crossover, mutation, and selection.

**Discussion Summary:**

GA service implemented with chromosome encoding (gene = subject-slot tuple), population size 40, and fitness function with rewards (+5 base, +3 Major) and penalties (-15 teacher clash, -10 room clash). Two-point crossover, adaptive swap mutation (15% to 3%), tournament selection (size 3) with elitism (top 4) added.

**Target(s) to meet before next meeting:**

- Implement constraint checking for teacher/room availability.
- Develop NEP/MEP 2020 policy enforcement.
- Create per-division GA approach in Timetable AI Service.

**Guide Signature:** ___________________________

---

---

## Meeting Log — 5

**Meeting Date:** 17/02/2026

**Meeting Number:** 05

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- Constraints Service with validation functions.
- NEP/MEP 2020 policy enforcement.
- Per-division GA approach with global teacher schedule.
- Timetable version management system.

**Discussion Summary:**

Constraints service built with teacher/room availability checks, consecutive lab slot detection, and NEP enforcement (Open Elective >= 2 hrs, COI >= 1 hr, UHV >= 1 hr). Per-division GA implemented — each division runs independent GA with global teacher schedule to prevent cross-division clashes.

**Target(s) to meet before next meeting:**

- Implement version management (save, list, activate, delete).
- Build conflict detection and teacher workload endpoints.
- Create frontend display for AI-generated timetables.

**Guide Signature:** ___________________________

---

---

## Meeting Log — 6

**Meeting Date:** 24/02/2026

**Meeting Number:** 06

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- Timetable version management and conflict detection.
- Teacher workload analysis and utilization calculation.
- JWT-based authentication system.
- Import/Export module for CSV, JSON, PDF.

**Discussion Summary:**

Version management and conflict detection (teacher/room clashes) implemented with ConflictLog table. Teacher workload endpoint calculates utilization percentage. Authentication added with bcrypt hashing and JWT tokens (24-hour expiry). Import/Export module supports CSV for all resources and PDF export using jsPDF.

**Target(s) to meet before next meeting:**

- Build Statistics dashboard with Recharts charts.
- Develop Teacher Workload and Home pages.
- Create sharing functionality for timetables.

**Guide Signature:** ___________________________

---

---

## Meeting Log — 7

**Meeting Date:** 03/03/2026

**Meeting Number:** 07

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- Statistics dashboard with data visualization.
- Teacher Workload analysis page.
- Home page and Dashboard page development.
- Share Timetable functionality.

**Discussion Summary:**

Statistics page built with summary cards and Recharts charts (workload bar, category pie, hours distribution). Teacher Workload page has sortable table with color-coded utilization. Home page with Framer Motion animations and Dashboard as navigation hub completed. Share page enables social media sharing.

**Target(s) to meet before next meeting:**

- Create Layout component with sticky navigation.
- Build ErrorBoundary and validation utilities.
- Set up Pytest and Vitest testing frameworks.

**Guide Signature:** ___________________________

---

---

## Meeting Log — 8

**Meeting Date:** 10/03/2026

**Meeting Number:** 08

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- Layout component and supporting UI components.
- Validation utilities for all input forms.
- Testing frameworks setup and writing test cases.
- Notification Center with Zustand store.

**Discussion Summary:**

Layout component built with sticky navigation, animated logo, and route indicator. Validation utilities created for all forms. Pytest configured with in-memory SQLite fixtures; Vitest with jsdom. Backend test suites written for auth, inputs, import_export, and timetable routers. Notification Center added with Zustand.

**Target(s) to meet before next meeting:**

- Implement advanced components (EnhancedTimetableGrid, QualityMetrics).
- Fix configuration save validation bug.
- Optimize GA for better timetable distribution.

**Guide Signature:** ___________________________

---

---

## Meeting Log — 9

**Meeting Date:** 17/03/2026

**Meeting Number:** 09

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- Bug fixing: config save failure and GA distribution.
- Dual Lecture/Lab subject support with teacher popup.
- Database migration for is_lecture column.
- Advanced frontend components integration.

**Discussion Summary:**

Fixed config save bug (break_duration max mismatch). Rewrote timetable_ai.py with per-division GA to fix mostly-FREE-slots issue. Added is_lecture column with dual checkboxes and teacher selection popup modal. Advanced components added: ConflictVisualization, AlgorithmVisualization, TimetableVersionHistory.

**Target(s) to meet before next meeting:**

- Implement AI Chatbot with floating widget UI.
- Create backend chat endpoint with OpenAI/Gemini support.
- Final UI polish and animations.

**Guide Signature:** ___________________________

---

---

## Meeting Log — 10

**Meeting Date:** 24/03/2026

**Meeting Number:** 10

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- AI Chatbot feature — backend and frontend.
- OpenAI and Google Gemini API integration.
- Fallback response system for offline mode.
- Floating chat widget with animations.

**Discussion Summary:**

AI Chatbot backend created with POST /api/chat supporting OpenAI, Gemini, and keyword-based fallback modes. Frontend floating widget built with chat window, message bubbles, typing indicator, and Framer Motion animations. Integrated into Layout component for availability on all pages.

**Target(s) to meet before next meeting:**

- Conduct end-to-end testing of all features.
- Prepare deployment configuration.
- Complete project documentation.

**Guide Signature:** ___________________________

---

---

## Meeting Log — 11

**Meeting Date:** 31/03/2026

**Meeting Number:** 11

**Project Title:** AI-Powered Smart Timetable Generator

**Guide Name:** ___________________________

**Present Members:**

1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________

**Agenda of Meeting:**

- Final end-to-end testing and bug resolution.
- Deployment setup and configuration.
- Project documentation and feature summary.
- Future scope discussion.

**Discussion Summary:**

All 30+ API endpoints tested and verified. GA tested with 3 divisions x 6 subjects x 5 teachers producing optimized timetables. Deployment configured for Vercel (frontend) and Render (backend) with Supabase PostgreSQL for production.

**Future Scope:**

- University ERP integration and mobile app development.
- Advanced AI models (Reinforcement Learning) for optimization.
- Real-time collaborative editing and calendar integration.

**Target(s) to meet before next meeting:**

- Final project submission and presentation.
- Deploy to production (Vercel + Render + Supabase).
- Collect feedback from faculty for improvements.

**Guide Signature:** ___________________________

---

---

*End of CEP Project Group Meeting Logs — AI-Powered Smart Timetable Generator*

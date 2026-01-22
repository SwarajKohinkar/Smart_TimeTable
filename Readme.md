We are building an AI-Based Timetable Generation System aligned with NEP 2020, designed for colleges and universities that follow multidisciplinary education structures.

The goal of this project is to automatically generate a valid, optimized weekly timetable based on academic inputs such as subjects, teachers, working days, time slots, breaks, and different subject categories (major, minor, MOOC, sports, extracurricular).

The system eliminates manual timetable creation, reduces conflicts, and supports the flexibility required by NEP 2020.

 What the Application Does
1. Takes Academic Inputs

The application allows the user (admin/college) to input:

Number of working days

Daily start and end time

Number of breaks and duration of each break

Subjects with:

Subject type (Major / Minor / MOOC / Sports / Extracurricular / OpenElective/ UHV/ COI)

Credits or weekly hours

Number of teachers per subject

Basic constraints (no overlap, breaks respected, etc.)

From this data, the system automatically generates valid time slots.

2. Applies Rules & Constraints

The system enforces:

No teacher clashes

No overlapping subjects in the same slot

Breaks are strictly respected

Major subjects prioritized in better slots

MOOCs, sports, and extracurriculars placed flexibly

3. Uses AI-Based Optimization

A Genetic Algorithm is used to:

Generate multiple timetable possibilities

Score them using a fitness function

Select the best, clash-free, balanced timetable

This is the AI core of the project.

4. Produces Output

The final output includes:

Weekly timetable (day × time)

Subject-wise schedule

Teacher-wise allocation

All results are shown on the frontend in a clean UI.

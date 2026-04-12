/**
 * Data Validation Utilities for Timetable System
 */

export const validateDivision = (division) => {
  const errors = []
  
  if (!division.name || division.name.trim() === '') {
    errors.push('Division name is required')
  }
  if (division.name && division.name.length > 50) {
    errors.push('Division name must be less than 50 characters')
  }
  if (!division.capacity || division.capacity <= 0) {
    errors.push('Division capacity must be greater than 0')
  }
  if (division.capacity > 200) {
    errors.push('Division capacity seems too high (>200). Double-check?')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateTeacher = (teacher) => {
  const errors = []

  if (!teacher.name || teacher.name.trim() === '') {
    errors.push('Teacher name is required')
  }
  if (teacher.name && teacher.name.length > 50) {
    errors.push('Teacher name must be less than 50 characters')
  }
  if (!teacher.department || teacher.department.trim() === '') {
    errors.push('Teacher department is required')
  }
  if (teacher.maxHours && teacher.maxHours <= 0) {
    errors.push('Max teaching hours must be greater than 0')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateSubject = (subject) => {
  const errors = []

  if (!subject.name || subject.name.trim() === '') {
    errors.push('Subject name is required')
  }
  if (subject.name && subject.name.length > 50) {
    errors.push('Subject name must be less than 50 characters')
  }
  if (!subject.code || subject.code.trim() === '') {
    errors.push('Subject code is required')
  }
  if (subject.code && subject.code.length > 10) {
    errors.push('Subject code must be less than 10 characters')
  }
  if (!subject.department || subject.department.trim() === '') {
    errors.push('Subject department is required')
  }
  if (subject.credits && subject.credits <= 0) {
    errors.push('Subject credits must be greater than 0')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateConfiguration = (config) => {
  const errors = []
  const warnings = []

  // Required fields
  if (!config.start_time) {
    errors.push('Start time is required')
  }
  if (!config.end_time) {
    errors.push('End time is required')
  }
  if (!config.working_days || config.working_days <= 0) {
    errors.push('Working days must be greater than 0')
  }
  if (!config.break_duration || config.break_duration <= 0) {
    errors.push('Break duration must be greater than 0')
  }

  // Validations
  if (config.start_time && config.end_time) {
    const [startH, startM] = config.start_time.split(':').map(Number)
    const [endH, endM] = config.end_time.split(':').map(Number)
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    if (startMinutes >= endMinutes) {
      errors.push('Start time must be before end time')
    }

    const totalMinutes = endMinutes - startMinutes
    if (totalMinutes < 240) {
      warnings.push('Total work hours seems too short (< 4 hours)')
    }
  }

  if (config.break_duration > 120) {
    warnings.push('Break duration is quite long (>2 hours)')
  }

  if (config.working_days > 6) {
    warnings.push('More than 6 working days might be too many')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export const validateTimetableData = (divisions, teachers, subjects) => {
  const errors = []
  const warnings = []

  // Check if data exists
  if (!divisions || divisions.length === 0) {
    errors.push('At least one division is required')
  }
  if (!teachers || teachers.length === 0) {
    errors.push('At least one teacher is required')
  }
  if (!subjects || subjects.length === 0) {
    errors.push('At least one subject is required')
  }

  // Check minimum counts
  if (divisions && divisions.length > 0 && teachers && teachers.length < 3) {
    warnings.push('Having fewer than 3 teachers might limit scheduling flexibility')
  }

  // Check teacher-subject relationship
  if (teachers && subjects) {
    const teacherIds = new Set(teachers.map((t) => t.id))
    subjects.forEach((subject) => {
      if (subject.teacher_id && !teacherIds.has(subject.teacher_id)) {
        errors.push(`Subject "${subject.name}" has an invalid teacher reference`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      divisionsCount: divisions?.length || 0,
      teachersCount: teachers?.length || 0,
      subjectsCount: subjects?.length || 0,
    },
  }
}

export const validateFormField = (fieldName, value) => {
  const sanitizeValue = (val) => (typeof val === 'string' ? val.trim() : val)

  switch (fieldName) {
    case 'name':
    case 'email':
    case 'phone':
      return sanitizeValue(value).length > 0 ? null : 'This field is required'
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? null : 'Please enter a valid email'
    case 'number':
      return !isNaN(value) && value > 0 ? null : 'Please enter a valid number'
    default:
      return null
  }
}

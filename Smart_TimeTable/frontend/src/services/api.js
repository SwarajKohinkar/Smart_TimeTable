import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Divisions API
export const divisionsAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/divisions?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/divisions/${id}`),
  create: (data) => api.post('/divisions', data),
  update: (id, data) => api.put(`/divisions/${id}`, data),
  delete: (id) => api.delete(`/divisions/${id}`),
}

// Teachers API
export const teachersAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/teachers?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
  setAvailability: (data) => api.post('/teacher-availability', data),
  getAvailability: (teacherId) => api.get(`/teacher-availability/${teacherId}`),
}

// Subjects API
export const subjectsAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/subjects?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
}

// Subject-Teacher Mapping API
export const subjectTeacherAPI = {
  getAll: () => api.get('/subject-teachers'),
  assign: (data) => api.post('/subject-teachers', data),
  remove: (id) => api.delete(`/subject-teachers/${id}`),
}

// Rooms API
export const roomsAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/rooms?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
}

// Timetable API
export const timetableAPI = {
  generateSlots: () => api.get('/generate-slots'),
  generateAITimetable: () => api.get('/generate-ai-timetable'),
  saveConfig: (data) => api.post('/config', data),
  getConfig: () => api.get('/config'),
  updateConfig: (id, data) => api.put(`/config/${id}`, data),
  
  // Versions
  saveVersion: (data) => api.post('/versions', data),
  getVersions: (skip = 0, limit = 20) => api.get(`/versions?skip=${skip}&limit=${limit}`),
  getVersion: (id) => api.get(`/versions/${id}`),
  activateVersion: (id) => api.put(`/versions/${id}/activate`),
  deleteVersion: (id) => api.delete(`/versions/${id}`),
  
  // Conflicts
  detectConflicts: (versionId) => api.get(`/detect-conflicts/${versionId}`),
  getConflicts: (versionId = null) => api.get(`/conflicts${versionId ? `?version_id=${versionId}` : ''}`),
  
  // Workload
  getTeacherWorkload: () => api.get('/teacher-workload'),
  
  // Share
  createShareLink: (versionId) => api.post(`/share/${versionId}`),
  
  // Compare
  compareVersions: (id1, id2) => api.get(`/compare/${id1}/${id2}`),
}

// AI Chat API
export const chatAPI = {
  send: (message) => api.post('/chat', { message }),
  status: () => api.get('/chat/status'),
}

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (formData) => api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

// Export API
export const exportAPI = {
  subjectsCSV: () => api.get('/export/subjects/csv', { responseType: 'blob' }),
  teachersCSV: () => api.get('/export/teachers/csv', { responseType: 'blob' }),
  divisionsCSV: () => api.get('/export/divisions/csv', { responseType: 'blob' }),
  roomsCSV: () => api.get('/export/rooms/csv', { responseType: 'blob' }),
  timetableCSV: (versionId) => api.get(`/export/timetable/${versionId}/csv`, { responseType: 'blob' }),
  timetableJSON: (versionId) => api.get(`/export/timetable/${versionId}/json`, { responseType: 'blob' }),
  allExcel: () => api.get('/export/all/excel', { responseType: 'blob' }),
}

// Import API
export const importAPI = {
  subjectsCSV: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/import/subjects/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  teachersCSV: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/import/teachers/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  divisionsCSV: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/import/divisions/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  roomsCSV: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/import/rooms/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

// Helper function to download files
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export default api

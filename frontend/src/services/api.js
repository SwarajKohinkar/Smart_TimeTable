import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const divisionsAPI = {
  getAll: () => api.get('/divisions'),
  create: (data) => api.post('/divisions', data),
  delete: (id) => api.delete(`/divisions/${id}`),
}

export const teachersAPI = {
  getAll: () => api.get('/teachers'),
  create: (data) => api.post('/teachers', data),
  delete: (id) => api.delete(`/teachers/${id}`),
}

export const subjectsAPI = {
  getAll: () => api.get('/subjects'),
  create: (data) => api.post('/subjects', data),
  delete: (id) => api.delete(`/subjects/${id}`),
}

export const timetableAPI = {
  generateSlots: () => api.get('/generate-slots'),
  generateAITimetable: () => api.get('/generate-ai-timetable'),
  saveConfig: (data) => api.post('/timetable-config', data),
  getConfig: () => api.get('/timetable-config'),
}

export default api

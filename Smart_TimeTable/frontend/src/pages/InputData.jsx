import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, AlertTriangle, X } from 'lucide-react'
import { divisionsAPI, teachersAPI, subjectsAPI, timetableAPI, subjectTeacherAPI } from '../services/api'

export default function InputData() {
  const [activeTab, setActiveTab] = useState('divisions')
  const [divisions, setDivisions] = useState([])
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [showResetModal, setShowResetModal] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const hasData = divisions.length > 0 || teachers.length > 0 || subjects.length > 0

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'divisions') {
        const response = await divisionsAPI.getAll()
        setDivisions(response.data)
      } else if (activeTab === 'teachers') {
        const response = await teachersAPI.getAll()
        setTeachers(response.data)
      } else if (activeTab === 'subjects') {
        const [subjectsRes, teachersRes] = await Promise.all([
          subjectsAPI.getAll(),
          teachersAPI.getAll()
        ])
        setSubjects(subjectsRes.data)
        setTeachers(teachersRes.data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (activeTab === 'divisions') {
        await divisionsAPI.create(formData)
      } else if (activeTab === 'teachers') {
        await teachersAPI.create(formData)
      } else if (activeTab === 'subjects') {
        await subjectsAPI.create(formData)
      }
      setFormData({})
      loadData()
    } catch (error) {
      console.error('Error creating data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    setLoading(true)
    try {
      if (activeTab === 'divisions') {
        await divisionsAPI.delete(id)
      } else if (activeTab === 'teachers') {
        await teachersAPI.delete(id)
      } else if (activeTab === 'subjects') {
        await subjectsAPI.delete(id)
      }
      loadData()
    } catch (error) {
      console.error('Error deleting data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetAll = async () => {
    setIsResetting(true)
    try {
      // Delete all divisions
      const divisionsResponse = await divisionsAPI.getAll()
      for (const division of divisionsResponse.data) {
        await divisionsAPI.delete(division.id)
      }

      // Delete all teachers
      const teachersResponse = await teachersAPI.getAll()
      for (const teacher of teachersResponse.data) {
        await teachersAPI.delete(teacher.id)
      }

      // Delete all subjects
      const subjectsResponse = await subjectsAPI.getAll()
      for (const subject of subjectsResponse.data) {
        await subjectsAPI.delete(subject.id)
      }

      // Reset local state
      setDivisions([])
      setTeachers([])
      setSubjects([])
      setFormData({})
      
      // Close modal and show success
      setShowResetModal(false)
      setShowSuccessToast(true)
      
      // Hide toast after 3 seconds
      setTimeout(() => setShowSuccessToast(false), 3000)
    } catch (error) {
      console.error('Error resetting data:', error)
      alert('Failed to reset data. Please try again.')
    } finally {
      setIsResetting(false)
    }
  }

  const tabs = [
    { id: 'divisions', label: 'Divisions' },
    { id: 'teachers', label: 'Teachers' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'config', label: 'Configuration' }
  ]

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Input Data</h2>
          <p className="mt-2 text-gray-600">
            Manage divisions, teachers, subjects, and timetable configuration
          </p>
        </div>
        
        {/* Reset All Data Button */}
        <motion.button
          whileHover={{ scale: hasData ? 1.05 : 1 }}
          whileTap={{ scale: hasData ? 0.95 : 1 }}
          onClick={() => setShowResetModal(true)}
          disabled={!hasData || loading || isResetting}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
            hasData && !loading && !isResetting
              ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100 hover:border-red-300 hover:shadow-lg'
              : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          Reset All Data
        </motion.button>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isResetting && setShowResetModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Confirm Reset</h3>
                  </div>
                  {!isResetting && (
                    <button
                      onClick={() => setShowResetModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  This will <span className="font-bold text-red-600">permanently delete</span> all added:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    All divisions ({divisions.length})
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    All teachers ({teachers.length})
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    All subjects ({subjects.length})
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Configuration settings
                  </li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    WARNING: This action cannot be undone!
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={() => setShowResetModal(false)}
                  disabled={isResetting}
                  className="px-4 py-2 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetAll}
                  disabled={isResetting}
                  className="px-6 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isResetting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Yes, Reset Everything
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-green-200 p-4 flex items-center gap-3 min-w-[300px]">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Success!</p>
                <p className="text-sm text-gray-600">All input data has been cleared</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'divisions' && (
            <DivisionsTab
              divisions={divisions}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
              loading={loading}
            />
          )}
          {activeTab === 'teachers' && (
            <TeachersTab
              teachers={teachers}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
              loading={loading}
            />
          )}
          {activeTab === 'subjects' && (
            <SubjectsTab
              subjects={subjects}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
              loading={loading}
              teachers={teachers}
              loadData={loadData}
            />
          )}
          {activeTab === 'config' && <ConfigTab />}
        </div>
      </div>
    </div>
  )
}

function DivisionsTab({ divisions, formData, setFormData, handleSubmit, handleDelete, loading }) {
  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Division Name (e.g., A, B, C)"
            value={formData.name || ''}
            onChange={(e) => setFormData({ name: e.target.value })}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Add Division
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {divisions.map((division) => (
              <tr key={division.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {division.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {division.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(division.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {divisions.length === 0 && (
          <p className="text-center py-4 text-gray-500">No divisions added yet</p>
        )}
      </div>
    </div>
  )
}

function TeachersTab({ teachers, formData, setFormData, handleSubmit, handleDelete, loading }) {
  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Teacher Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ name: e.target.value })}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Add Teacher
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {teacher.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {teacher.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teachers.length === 0 && (
          <p className="text-center py-4 text-gray-500">No teachers added yet</p>
        )}
      </div>
    </div>
  )
}

function SubjectsTab({ subjects, formData, setFormData, handleSubmit, handleDelete, loading, teachers, loadData }) {
  const [showTeacherPopup, setShowTeacherPopup] = useState(false)
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [pendingSubjectData, setPendingSubjectData] = useState(null)
  const [assigning, setAssigning] = useState(false)
  const [subjectTeacherMappings, setSubjectTeacherMappings] = useState([])

  useEffect(() => {
    fetchMappings()
  }, [subjects])

  const fetchMappings = async () => {
    try {
      const res = await subjectTeacherAPI.getAll()
      setSubjectTeacherMappings(res.data)
    } catch (e) {
      console.error('Failed to load subject-teacher mappings', e)
    }
  }

  const getAssignedTeachers = (subjectId) => {
    const teacherIds = subjectTeacherMappings
      .filter(m => m.subject_id === subjectId)
      .map(m => m.teacher_id)
    return teachers
      .filter(t => teacherIds.includes(t.id))
      .map(t => t.name)
  }

  const onFormSubmit = (e) => {
    e.preventDefault()
    if (!formData.is_lab && !formData.is_lecture) {
      alert('Please select at least one type: Lecture or Lab')
      return
    }
    // Store the form data and show teacher popup
    setPendingSubjectData({
      name: formData.name,
      category: formData.category,
      is_lab: formData.is_lab || false,
      is_lecture: formData.is_lecture !== false, // default true
      weekly_hours: parseInt(formData.weekly_hours),
      teachers_required: parseInt(formData.teachers_required) || 1,
    })
    setSelectedTeachers([])
    setShowTeacherPopup(true)
  }

  const handleAssignAndCreate = async () => {
    if (selectedTeachers.length === 0) {
      alert('Please select at least one teacher')
      return
    }
    setAssigning(true)
    try {
      // Create the subject
      const response = await subjectsAPI.create(pendingSubjectData)
      const newSubjectId = response.data.id

      // Assign selected teachers
      for (const teacherId of selectedTeachers) {
        await subjectTeacherAPI.assign({ subject_id: newSubjectId, teacher_id: teacherId })
      }

      setFormData({})
      setShowTeacherPopup(false)
      setPendingSubjectData(null)
      setSelectedTeachers([])
      loadData()
    } catch (error) {
      console.error('Error creating subject:', error)
      if (error.response?.data?.detail) {
        alert('Error: ' + (Array.isArray(error.response.data.detail) ? error.response.data.detail.map(d => d.msg).join(', ') : error.response.data.detail))
      } else {
        alert('Failed to create subject')
      }
    } finally {
      setAssigning(false)
    }
  }

  const toggleTeacher = (teacherId) => {
    setSelectedTeachers(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    )
  }

  const getTypeLabel = (subject) => {
    if (subject.is_lab && subject.is_lecture) return 'Both'
    if (subject.is_lab) return 'Lab'
    return 'Lecture'
  }

  return (
    <div>
      <form onSubmit={onFormSubmit} className="mb-6">
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                placeholder="e.g., Data Structures"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
              >
                <option value="">Select Category</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
                <option value="OpenElective">Open Elective</option>
                <option value="COI">COI</option>
                <option value="UHV">UHV</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekly Hours
              </label>
              <input
                type="number"
                placeholder="e.g., 3"
                value={formData.weekly_hours || ''}
                onChange={(e) => setFormData({ ...formData, weekly_hours: e.target.value ? parseInt(e.target.value) : '' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
                min="1"
                max="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teachers Required
              </label>
              <input
                type="number"
                placeholder="e.g., 2"
                value={formData.teachers_required || 1}
                onChange={(e) => setFormData({ ...formData, teachers_required: e.target.value ? parseInt(e.target.value) : 1 })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
                min="1"
                max="5"
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-4 h-[42px]">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_lecture"
                    checked={formData.is_lecture !== false}
                    onChange={(e) => setFormData({ ...formData, is_lecture: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_lecture" className="ml-2 block text-sm font-medium text-gray-700">
                    Lecture
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_lab"
                    checked={formData.is_lab || false}
                    onChange={(e) => setFormData({ ...formData, is_lab: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_lab" className="ml-2 block text-sm font-medium text-gray-700">
                    Lab
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Subject'}
          </button>
        </div>
      </form>

      {/* Teacher Selection Popup */}
      <AnimatePresence>
        {showTeacherPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !assigning && setShowTeacherPopup(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Assign Teachers</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Select teacher(s) for <span className="font-semibold text-indigo-600">{pendingSubjectData?.name}</span>
                    </p>
                  </div>
                  {!assigning && (
                    <button
                      onClick={() => setShowTeacherPopup(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 max-h-64 overflow-y-auto">
                {teachers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No teachers available. Please add teachers first.</p>
                ) : (
                  <div className="space-y-2">
                    {teachers.map((teacher) => (
                      <label
                        key={teacher.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedTeachers.includes(teacher.id)
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTeachers.includes(teacher.id)}
                          onChange={() => toggleTeacher(teacher.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">{teacher.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-between items-center">
                <span className="text-sm text-gray-500">
                  {selectedTeachers.length} teacher{selectedTeachers.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTeacherPopup(false)}
                    disabled={assigning}
                    className="px-4 py-2 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignAndCreate}
                    disabled={assigning || selectedTeachers.length === 0}
                    className="px-6 py-2 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {assigning ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </>
                    ) : 'Create Subject'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Teachers
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subject.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subject.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subject.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subject.is_lab && subject.is_lecture
                      ? 'bg-purple-100 text-purple-800'
                      : subject.is_lab
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {getTypeLabel(subject)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subject.weekly_hours}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {getAssignedTeachers(subject.id).length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {getAssignedTeachers(subject.id).map((name, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">No teachers</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subjects.length === 0 && (
          <p className="text-center py-4 text-gray-500">No subjects added yet</p>
        )}
      </div>
    </div>
  )
}

function ConfigTab() {
  const [config, setConfig] = useState({
    working_days: 5,
    start_time: '09:00',
    end_time: '17:00',
    break_count: 1,
    break_duration: 60
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await timetableAPI.getConfig()
      setConfig({
        working_days: response.data.working_days,
        start_time: response.data.start_time,
        end_time: response.data.end_time,
        break_count: response.data.break_count,
        break_duration: response.data.break_duration
      })
      setSaved(true)
    } catch (error) {
      // No config found, use defaults
      console.log('No existing config')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (config.end_time <= config.start_time) {
      alert('End Time must be after Start Time')
      return
    }
    setLoading(true)
    try {
      const configData = {
        working_days: parseInt(config.working_days),
        start_time: config.start_time,
        end_time: config.end_time,
        break_count: parseInt(config.break_count),
        break_duration: parseInt(config.break_duration)
      }
      await timetableAPI.saveConfig(configData)
      setSaved(true)
      alert('Configuration saved successfully!')
    } catch (error) {
      console.error('Error saving config:', error)
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail
        if (Array.isArray(detail)) {
          alert('Validation error: ' + detail.map(d => d.msg).join(', '))
        } else {
          alert('Failed to save configuration: ' + detail)
        }
      } else {
        alert('Failed to save configuration')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Working Days
          </label>
          <input
            type="number"
            value={config.working_days}
            onChange={(e) => setConfig({ ...config, working_days: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="1"
            max="7"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            value={config.start_time}
            onChange={(e) => setConfig({ ...config, start_time: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="time"
            value={config.end_time}
            onChange={(e) => setConfig({ ...config, end_time: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Break Count
          </label>
          <input
            type="number"
            value={config.break_count}
            onChange={(e) => setConfig({ ...config, break_count: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            max="5"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Break Duration (minutes)
          </label>
          <input
            type="number"
            value={config.break_duration}
            onChange={(e) => setConfig({ ...config, break_duration: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="15"
            max="120"
            step="15"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        Save Configuration
      </button>
    </form>
  )
}

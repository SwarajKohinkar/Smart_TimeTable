import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, AlertTriangle, X } from 'lucide-react'
import { divisionsAPI, teachersAPI, subjectsAPI } from '../services/api'

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
        const response = await subjectsAPI.getAll()
        setSubjects(response.data)
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

function SubjectsTab({ subjects, formData, setFormData, handleSubmit, handleDelete, loading }) {
  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
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
                value={formData.teachers_required || ''}
                onChange={(e) => setFormData({ ...formData, teachers_required: e.target.value ? parseInt(e.target.value) : '' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
                min="1"
                max="10"
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center h-[42px]">
                <input
                  type="checkbox"
                  id="is_lab"
                  checked={formData.is_lab || false}
                  onChange={(e) => setFormData({ ...formData, is_lab: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is_lab" className="ml-2 block text-sm font-medium text-gray-700">
                  Is Lab Subject
                </label>
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
                  {subject.is_lab ? 'Lab' : 'Lecture'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subject.weekly_hours}
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Save configuration logic here
      console.log('Saving config:', config)
      alert('Configuration saved successfully')
    } catch (error) {
      console.error('Error saving config:', error)
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

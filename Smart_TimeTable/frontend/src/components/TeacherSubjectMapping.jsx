import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Check } from 'lucide-react'
import { subjectsAPI, teachersAPI } from '../services/api'
import { useNotificationStore } from '../store/notificationStore'

export default function TeacherSubjectMapping({ isOpen, onClose, onSave }) {
  const { addNotification } = useNotificationStore()
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [mappings, setMappings] = useState({}) // { subjectId: [teacherIds] }
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    setLoading(true)
    try {
      const [subRes, teachRes] = await Promise.all([
        subjectsAPI.getAll(),
        teachersAPI.getAll(),
      ])
      setSubjects(subRes.data)
      setTeachers(teachRes.data)
      
      // Initialize mappings (in real app, fetch from backend)
      const initialMappings = {}
      subRes.data.forEach(s => {
        initialMappings[s.id] = []
      })
      setMappings(initialMappings)
    } catch (error) {
      console.error('Error loading data:', error)
      addNotification({
        type: 'error',
        message: 'Failed to load subjects and teachers',
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleTeacher = (subjectId, teacherId) => {
    setMappings(prev => {
      const current = prev[subjectId] || []
      if (current.includes(teacherId)) {
        return {
          ...prev,
          [subjectId]: current.filter(id => id !== teacherId),
        }
      } else {
        return {
          ...prev,
          [subjectId]: [...current, teacherId],
        }
      }
    })
  }

  const handleSave = async () => {
    // In a real app, save mappings to backend
    onSave?.(mappings)
    addNotification({
      type: 'success',
      message: 'Teacher-Subject mappings saved!',
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Teacher-Subject Mapping
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-6">
                {subjects.map((subject) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subject.category} • {subject.weekly_hours} hrs/week
                        {subject.is_lab && ' • Lab'}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {teachers.map((teacher) => {
                        const isSelected = (mappings[subject.id] || []).includes(
                          teacher.id
                        )
                        return (
                          <motion.button
                            key={teacher.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleTeacher(subject.id, teacher.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            {teacher.name}
                            {isSelected && <Check className="w-4 h-4" />}
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              Save Mappings
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

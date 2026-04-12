import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, CheckCircle, Clock, User, MapPin } from 'lucide-react'
import { timetableAPI } from '../services/api'

export default function ConflictVisualization({ versionId, onClose }) {
  const [loading, setLoading] = useState(true)
  const [conflicts, setConflicts] = useState([])
  const [detecting, setDetecting] = useState(false)

  useEffect(() => {
    if (versionId) {
      fetchConflicts()
    }
  }, [versionId])

  const fetchConflicts = async () => {
    try {
      setLoading(true)
      const response = await timetableAPI.getConflicts(versionId)
      setConflicts(response.data || [])
    } catch (error) {
      console.error('Error fetching conflicts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDetect = async () => {
    try {
      setDetecting(true)
      const response = await timetableAPI.detectConflicts(versionId)
      setConflicts(response.data || [])
    } catch (error) {
      console.error('Error detecting conflicts:', error)
    } finally {
      setDetecting(false)
    }
  }

  const getConflictIcon = (type) => {
    switch (type) {
      case 'teacher_clash':
        return <User className="w-5 h-5 text-red-400" />
      case 'room_clash':
        return <MapPin className="w-5 h-5 text-orange-400" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
    }
  }

  const getConflictColor = (type) => {
    switch (type) {
      case 'teacher_clash':
        return 'border-red-500/50 bg-red-500/10'
      case 'room_clash':
        return 'border-orange-500/50 bg-orange-500/10'
      default:
        return 'border-yellow-500/50 bg-yellow-500/10'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Conflict Detection</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDetect}
              disabled={detecting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg disabled:opacity-50"
            >
              {detecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Run Detection
                </>
              )}
            </motion.button>
          </div>

          {/* Conflicts List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading conflicts...</p>
            </div>
          ) : conflicts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Conflicts Found</h3>
              <p className="text-gray-400">The timetable is conflict-free!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">{conflicts.length} conflict(s) detected</span>
              </div>

              {conflicts.map((conflict, idx) => (
                <motion.div
                  key={conflict.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`border rounded-xl p-4 ${getConflictColor(conflict.conflict_type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getConflictIcon(conflict.conflict_type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium capitalize">
                          {conflict.conflict_type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(conflict.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{conflict.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

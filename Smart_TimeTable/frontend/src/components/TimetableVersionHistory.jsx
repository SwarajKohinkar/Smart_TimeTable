import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trash2, Copy, ChevronDown } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function TimetableVersionHistory() {
  const { isDarkMode } = useTheme()
  const [versions, setVersions] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  // Load versions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('timetableVersions')
    if (saved) {
      setVersions(JSON.parse(saved))
    }
  }, [])

  // Save versions to localStorage
  useEffect(() => {
    if (versions.length > 0) {
      localStorage.setItem('timetableVersions', JSON.stringify(versions))
    }
  }, [versions])

  const saveVersion = (timetable, name = '') => {
    const newVersion = {
      id: Date.now(),
      name: name || `Timetable ${versions.length + 1}`,
      timestamp: new Date().toISOString(),
      data: timetable,
      description: '',
    }
    setVersions([newVersion, ...versions])
    return newVersion.id
  }

  const deleteVersion = (id) => {
    setVersions(versions.filter((v) => v.id !== id))
  }

  const duplicateVersion = (id) => {
    const version = versions.find((v) => v.id === id)
    if (version) {
      const newVersion = {
        ...version,
        id: Date.now(),
        name: `${version.name} (Copy)`,
      }
      setVersions([newVersion, ...versions])
    }
  }

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Version History
        </h2>
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
          {versions.length} version{versions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No saved versions yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {versions.map((version) => (
              <motion.div
                key={version.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-lg border overflow-hidden transition-all ${
                  expandedId === version.id
                    ? 'border-blue-400 dark:border-blue-600'
                    : 'border-gray-200 dark:border-gray-700'
                }
                ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-750'
                    : 'bg-gray-50 hover:bg-white'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === version.id ? null : version.id)
                  }
                  className="w-full p-4 flex items-center gap-3 hover:opacity-80 transition"
                >
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {version.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(version.timestamp)}
                    </p>
                  </div>
                  <motion.div
                    animate={{
                      rotate: expandedId === version.id ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === version.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800 dark:to-transparent"
                    >
                      {version.description && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                          {version.description}
                        </p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => duplicateVersion(version.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition text-sm font-medium"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>

                        <button
                          onClick={() => {
                            // Copy version data to clipboard
                            navigator.clipboard.writeText(
                              JSON.stringify(version.data, null, 2)
                            )
                          }}
                          className="flex items-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm font-medium"
                        >
                          Copy Data
                        </button>

                        <button
                          onClick={() => deleteVersion(version.id)}
                          className="ml-auto flex items-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export const useTimetableVersioning = () => {
  const [versions, setVersions] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('timetableVersions')
    if (saved) {
      setVersions(JSON.parse(saved))
    }
  }, [])

  const saveVersion = (timetable, name = '') => {
    const newVersion = {
      id: Date.now(),
      name: name || `Timetable ${versions.length + 1}`,
      timestamp: new Date().toISOString(),
      data: timetable,
    }
    const updated = [newVersion, ...versions]
    setVersions(updated)
    localStorage.setItem('timetableVersions', JSON.stringify(updated))
    return newVersion.id
  }

  return { versions, saveVersion }
}

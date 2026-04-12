import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ValidationFeedback({
  errors = [],
  warnings = [],
  info = [],
  onDismiss = () => {},
}) {
  const { isDarkMode } = useTheme()

  if (errors.length === 0 && warnings.length === 0 && info.length === 0) {
    return null
  }

  const messages = [
    ...errors.map((msg) => ({ type: 'error', message: msg })),
    ...warnings.map((msg) => ({ type: 'warning', message: msg })),
    ...info.map((msg) => ({ type: 'info', message: msg })),
  ]

  const getIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getStyles = (type) => {
    switch (type) {
      case 'error':
        return {
          container: isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200',
          text: isDarkMode ? 'text-red-300' : 'text-red-800',
          header: isDarkMode ? 'text-red-400' : 'text-red-700',
        }
      case 'warning':
        return {
          container: isDarkMode ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200',
          text: isDarkMode ? 'text-amber-300' : 'text-amber-800',
          header: isDarkMode ? 'text-amber-400' : 'text-amber-700',
        }
      case 'info':
        return {
          container: isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200',
          text: isDarkMode ? 'text-blue-300' : 'text-blue-800',
          header: isDarkMode ? 'text-blue-400' : 'text-blue-700',
        }
      default:
        return {
          container: isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200',
          text: isDarkMode ? 'text-green-300' : 'text-green-800',
          header: isDarkMode ? 'text-green-400' : 'text-green-700',
        }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -10 },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-3 mb-6"
    >
      <AnimatePresence>
        {messages.map((item, idx) => {
          const styles = getStyles(item.type)
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              exit={{ opacity: 0, x: -20 }}
              className={`border rounded-lg p-4 flex items-start gap-3 ${styles.container}`}
            >
              <div className="flex-shrink-0 mt-0.5">{getIcon(item.type)}</div>
              <div className="flex-1">
                <p className={`text-sm ${styles.text}`}>{item.message}</p>
              </div>
              <button
                onClick={() => onDismiss(idx)}
                className={`flex-shrink-0 hover:opacity-70 transition ${styles.text}`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}

export function ValidationSummary({ validation }) {
  const { isDarkMode } = useTheme()

  if (!validation || (!validation.errors?.length && !validation.warnings?.length)) {
    return null
  }

  return (
    <div className="space-y-4">
      {validation.summary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-lg p-4 border-2 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <h3 className={`font-semibold mb-2 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-900'
          }`}>
            Data Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Divisions
              </p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {validation.summary.divisionsCount}
              </p>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Teachers
              </p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {validation.summary.teachersCount}
              </p>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Subjects
              </p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {validation.summary.subjectsCount}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <ValidationFeedback
        errors={validation.errors}
        warnings={validation.warnings}
      />
    </div>
  )
}

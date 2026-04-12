import { motion } from 'framer-motion'
import {
  Sparkles,
  Moon,
  BarChart3,
  FileText,
  Clock,
  Filter,
  Zap,
  Shield,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const featuresList = [
  {
    id: 1,
    icon: Moon,
    title: 'Dark Mode',
    description: 'Switch between light and dark themes for comfortable viewing at any time',
    color: 'blue',
  },
  {
    id: 2,
    icon: BarChart3,
    title: 'Enhanced Timetable Grid',
    description: 'Color-coded subjects, hover effects, and improved typography',
    color: 'green',
  },
  {
    id: 3,
    icon: Zap,
    title: 'Statistics Dashboard',
    description: 'Charts, metrics, and analytics for timetable distribution and utilization',
    color: 'purple',
  },
  {
    id: 4,
    icon: FileText,
    title: 'Multi-Format Export',
    description: 'Export timetables as PDF, CSV, or JSON with professional formatting',
    color: 'red',
  },
  {
    id: 5,
    icon: Filter,
    title: 'Advanced Views',
    description: 'Week, Day, Teacher, and Grid views for flexible timetable visualization',
    color: 'amber',
  },
  {
    id: 6,
    icon: Clock,
    title: 'Version History',
    description: 'Save, manage, and compare different timetable versions',
    color: 'indigo',
  },
  {
    id: 7,
    icon: Sparkles,
    title: 'Smart Notifications',
    description: 'Real-time feedback and status updates for all operations',
    color: 'pink',
  },
  {
    id: 8,
    icon: Shield,
    title: 'Data Validation',
    description: 'Comprehensive validation with helpful error messages and warnings',
    color: 'cyan',
  },
]

export default function FeaturesShowcase() {
  const { isDarkMode } = useTheme()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const colorMap = {
    blue: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20',
    green: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/20',
    purple: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/20',
    red: 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/20',
    amber: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/20',
    indigo:
      'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-900/20',
    pink: 'from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-900/20',
    cyan: 'from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-900/20',
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-800 dark:from-gray-100 dark:via-blue-300 dark:to-violet-300 bg-clip-text text-transparent mb-4">
          ✨ New Features
        </h2>
        <p className={`text-lg ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Discover all the powerful features we've added to make timetable management better
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {featuresList.map((feature) => {
          const Icon = feature.icon
          const bgGradient = colorMap[feature.color]

          return (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm p-6 bg-gradient-to-br ${bgGradient} cursor-pointer transition-all hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-gray-900/50`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-900/50`}>
                  <Icon className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Implementation Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-xl border-2 p-8 ${
          isDarkMode
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}
      >
        <h3 className={`text-2xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          🚀 What's Been Implemented
        </h3>
        <ul className="space-y-3">
          {[
            'Advanced theme switching with dark/light mode support',
            'Enhanced timetable visualization with color-coded subjects',
            'Comprehensive statistics dashboard with charts',
            'Multiple export formats (PDF, CSV, JSON)',
            'Multi-view layouts (Week, Day, Teacher, Grid)',
            'Version history and timetable versioning',
            'Smart notification system for all actions',
            'Data validation with helpful error messages',
            'Zustand-based state management',
            'Responsive design for all screen sizes',
          ].map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              className={`flex items-start gap-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              <span className="text-green-500 font-bold mt-1">✓</span>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`rounded-xl border-2 p-8 ${
          isDarkMode
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}
      >
        <h3 className={`text-2xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          📦 New Dependencies Added
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['recharts', 'jspdf', 'zustand', 'html2pdf.js', 'jspdf-autotable'].map(
            (pkg) => (
              <div
                key={pkg}
                className={`px-3 py-2 rounded-lg text-center font-mono text-sm font-semibold ${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {pkg}
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  )
}

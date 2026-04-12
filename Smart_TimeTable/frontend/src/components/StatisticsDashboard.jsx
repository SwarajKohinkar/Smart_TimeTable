import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'

export default function StatisticsDashboard({ timetable, config }) {
  const { isDarkMode } = useTheme()

  // Calculate statistics
  const calculateStats = () => {
    if (!timetable?.timetable) return null

    const days = Object.keys(timetable.timetable)
    const slots = timetable.timetable[days[0]] || []

    // Class distribution by day
    const classDistribution = days.map((day) => ({
      day,
      classes: timetable.timetable[day].filter((s) => s.subject !== 'Break').length,
    }))

    // Subject breakdown
    const subjectMap = {}
    days.forEach((day) => {
      timetable.timetable[day].forEach((slot) => {
        if (slot.subject !== 'Break') {
          subjectMap[slot.subject] = (subjectMap[slot.subject] || 0) + 1
        }
      })
    })

    const subjectData = Object.entries(subjectMap).map(([subject, count]) => ({
      name: subject,
      value: count,
    }))

    // Break distribution
    const breakCount = days.reduce(
      (count, day) =>
        count + timetable.timetable[day].filter((s) => s.subject === 'Break').length,
      0
    )

    return {
      classDistribution,
      subjectData,
      totalClasses: days.length * slots.filter((s) => s.subject !== 'Break').length,
      totalBreaks: breakCount,
      totalSlots: days.length * slots.length,
    }
  }

  const stats = calculateStats()

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No timetable data available
      </div>
    )
  }

  const COLORS = [
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#06b6d4',
    '#6366f1',
    '#f97316',
  ]

  const chartTheme = {
    colors: isDarkMode
      ? {
          text: '#f3f4f6',
          axis: '#9ca3af',
          grid: '#374151',
        }
      : {
          text: '#1f2937',
          axis: '#6b7280',
          grid: '#e5e7eb',
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Classes', value: stats.totalClasses, color: 'blue' },
          { label: 'Total Slots', value: stats.totalSlots, color: 'indigo' },
          { label: 'Break Sessions', value: stats.totalBreaks, color: 'green' },
          {
            label: 'Utilization',
            value: `${Math.round((stats.totalClasses / stats.totalSlots) * 100)}%`,
            color: 'purple',
          },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="">
            <div
              className={`bg-${stat.color}-50 dark:bg-${stat.color}-900/30 rounded-lg p-4 border border-${stat.color}-200 dark:border-${stat.color}-700`}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Class Distribution by Day
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.classDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartTheme.colors.grid}
              />
              <XAxis stroke={chartTheme.colors.axis} />
              <YAxis stroke={chartTheme.colors.axis} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: chartTheme.colors.text,
                }}
              />
              <Bar dataKey="classes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Subject Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.subjectData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: chartTheme.colors.text,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}

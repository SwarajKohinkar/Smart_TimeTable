import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function QualityMetrics({ timetable, divisions }) {
  const { isDarkMode } = useTheme()

  if (!timetable || !divisions || divisions.length === 0) {
    return null
  }

  // Calculate metrics
  const calculateMetrics = () => {
    let totalSlots = 0
    let filledSlots = 0
    let freeSlots = 0
    let uniqueTeachers = new Set()
    let uniqueSubjects = new Set()
    const teacherLoad = {}
    const divisionLoad = {}

    divisions.forEach((div) => {
      divisionLoad[div.division] = { filled: 0, total: 0 }
      
      div.days.forEach((day) => {
        day.slots.forEach((slot) => {
          totalSlots++
          divisionLoad[div.division].total++

          if (slot.subject !== 'FREE') {
            filledSlots++
            divisionLoad[div.division].filled++
            uniqueSubjects.add(slot.subject)
            
            if (slot.teacher) {
              uniqueTeachers.add(slot.teacher)
              teacherLoad[slot.teacher] = (teacherLoad[slot.teacher] || 0) + 1
            }
          } else {
            freeSlots++
          }
        })
      })
    })

    const utilizationRate = ((filledSlots / totalSlots) * 100).toFixed(1)
    
    // Balance calculations
    const divisionUtilization = Object.entries(divisionLoad).map(([div, load]) => ({
      division: div,
      utilization: ((load.filled / load.total) * 100).toFixed(1),
    }))

    const teacherDistribution = Object.entries(teacherLoad).map(([teacher, load]) => ({
      teacher,
      load,
    }))

    return {
      utilizationRate,
      filledSlots,
      freeSlots,
      totalSlots,
      uniqueSubjects: uniqueSubjects.size,
      uniqueTeachers: uniqueTeachers.size,
      divisionUtilization,
      teacherDistribution,
    }
  }

  const metrics = calculateMetrics()

  const MetricCard = ({ icon: Icon, label, value, unit, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-4 ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className={`text-sm font-medium ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {label}
        </p>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className={`text-2xl font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {value}{unit}
      </p>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={BarChart3}
          label="Utilization Rate"
          value={metrics.utilizationRate}
          unit="%"
          color="text-blue-500"
        />
        <MetricCard
          icon={BookOpen}
          label="Filled Slots"
          value={metrics.filledSlots}
          unit={`/${metrics.totalSlots}`}
          color="text-green-500"
        />
        <MetricCard
          icon={Users}
          label="Teachers"
          value={metrics.uniqueTeachers}
          unit=""
          color="text-purple-500"
        />
        <MetricCard
          icon={TrendingUp}
          label="Subjects"
          value={metrics.uniqueSubjects}
          unit=""
          color="text-orange-500"
        />
      </div>

      {/* Division Utilization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Division-wise Utilization
        </h3>
        <div className="space-y-3">
          {metrics.divisionUtilization.map((item) => (
            <div key={item.division}>
              <div className="flex justify-between mb-1">
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Division {item.division}
                </span>
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {item.utilization}%
                </span>
              </div>
              <div className={`w-full h-2 rounded-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.utilization}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Teacher Load Distribution */}
      {metrics.teacherDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border p-6 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Teacher Load Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.teacherDistribution.map((item) => (
              <div
                key={item.teacher}
                className={`p-3 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {item.teacher || 'Unassigned'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm font-semibold">
                    {item.load} slots
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quality Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border p-6 bg-gradient-to-r ${
          metrics.utilizationRate > 70
            ? 'from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 border-green-300 dark:border-green-700'
            : 'from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 border-amber-300 dark:border-amber-700'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-2 ${
          metrics.utilizationRate > 70
            ? 'text-green-900 dark:text-green-200'
            : 'text-amber-900 dark:text-amber-200'
        }`}>
          Overall Timetable Quality
        </h3>
        <p className={`text-sm ${
          metrics.utilizationRate > 70
            ? 'text-green-800 dark:text-green-300'
            : 'text-amber-800 dark:text-amber-300'
        }`}>
          {metrics.utilizationRate > 70
            ? `Excellent! Your timetable has ${metrics.utilizationRate}% slot utilization with balanced teacher and division loads.`
            : `Good! Your timetable utilizes ${metrics.utilizationRate}% of available slots. Consider optimizing subject hours for better distribution.`}
        </p>
      </motion.div>
    </div>
  )
}

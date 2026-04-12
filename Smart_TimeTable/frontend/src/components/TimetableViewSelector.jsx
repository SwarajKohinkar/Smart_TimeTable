import { useState } from 'react'
import { motion } from 'framer-motion'
import { Grid, Calendar, Users, CalendarRange } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function TimetableViewSelector({ timetable, onViewChange }) {
  const { isDarkMode } = useTheme()
  const [selectedView, setSelectedView] = useState('week')

  const views = [
    { id: 'week', label: 'Week View', icon: CalendarRange },
    { id: 'day', label: 'Day View', icon: Calendar },
    { id: 'teacher', label: 'Teacher View', icon: Users },
    { id: 'grid', label: 'Grid View', icon: Grid },
  ]

  const handleViewChange = (viewId) => {
    setSelectedView(viewId)
    onViewChange?.(viewId)
  }

  return (
    <div className="flex gap-2 mb-6 p-2 rounded-lg flex-wrap bg-gray-100 dark:bg-gray-800">
      {views.map((view) => {
        const Icon = view.icon
        const isActive = selectedView === view.id

        return (
          <motion.button
            key={view.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewChange(view.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isActive
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {view.label}
          </motion.button>
        )
      })}
    </div>
  )
}

export function WeekView({ slots }) {
  const days = Object.keys(slots)
  const cellSlots = slots[days[0]] || []

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 dark:from-blue-900 to-indigo-50 dark:to-indigo-900">
            <th className="border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold">
              Time
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cellSlots.map((slot, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium bg-gray-50 dark:bg-gray-800">
                {slot.start_time} - {slot.end_time}
              </td>
              {days.map((day) => {
                const cellSlot = slots[day][idx]
                return (
                  <td
                    key={`${day}-${idx}`}
                    className="border border-gray-200 dark:border-gray-700 px-4 py-3"
                  >
                    <div
                      className={`p-2 rounded text-sm ${
                        cellSlot.subject === 'Break'
                          ? 'bg-gray-300 dark:bg-gray-600'
                          : 'bg-blue-100 dark:bg-blue-900'
                      }`}
                    >
                      <div className="font-semibold">{cellSlot.subject}</div>
                      {cellSlot.teacher && (
                        <div className="text-xs">{cellSlot.teacher}</div>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DayView({ slots, selectedDay = null }) {
  const days = Object.keys(slots)
  const [currentDay, setCurrentDay] = useState(selectedDay || days[0])
  const daySlots = slots[currentDay] || []

  return (
    <div className="space-y-4">
      {/* Day Selector */}
      <div className="flex gap-2 flex-wrap">
        {days.map((day) => (
          <motion.button
            key={day}
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentDay(day)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              currentDay === day
                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {day}
          </motion.button>
        ))}
      </div>

      {/* Day Slots */}
      <div className="space-y-2">
        {daySlots.map((slot, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 rounded-lg border-2 ${
              slot.subject === 'Break'
                ? 'bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700'
                : 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {slot.subject}
              </h3>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {slot.start_time} - {slot.end_time}
              </span>
            </div>
            {slot.teacher && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Teacher: {slot.teacher}
              </p>
            )}
            {slot.room && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Room: {slot.room}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function TeacherView({ slots }) {
  const teacherMap = {}

  // Group by teacher
  Object.values(slots).forEach((daySlots) => {
    daySlots.forEach((slot) => {
      if (slot.teacher && slot.subject !== 'Break') {
        if (!teacherMap[slot.teacher]) {
          teacherMap[slot.teacher] = []
        }
        teacherMap[slot.teacher].push(slot)
      }
    })
  })

  const teachers = Object.entries(teacherMap)

  if (teachers.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
        No teacher-wise entries found. Teacher View is available after subjects are assigned with teacher mappings in AI timetable generation.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {teachers.map(([teacher, teacherSlots]) => (
        <motion.div
          key={teacher}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30"
        >
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-200 mb-3">
            {teacher}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {teacherSlots.map((slot, idx) => (
              <div
                key={idx}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  {slot.subject}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {slot.start_time} - {slot.end_time}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

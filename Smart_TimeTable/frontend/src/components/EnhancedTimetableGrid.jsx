import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const SUBJECT_COLORS = {
  'Math': 'bg-blue-100 dark:bg-blue-900',
  'English': 'bg-purple-100 dark:bg-purple-900',
  'Science': 'bg-green-100 dark:bg-green-900',
  'History': 'bg-amber-100 dark:bg-amber-900',
  'Geography': 'bg-teal-100 dark:bg-teal-900',
  'PE': 'bg-red-100 dark:bg-red-900',
  'Art': 'bg-pink-100 dark:bg-pink-900',
  'Computer': 'bg-indigo-100 dark:bg-indigo-900',
}

function getColorForSubject(subject) {
  const key = Object.keys(SUBJECT_COLORS).find(k => subject.toLowerCase().includes(k.toLowerCase()))
  return SUBJECT_COLORS[key] || 'bg-gray-100 dark:bg-gray-800'
}

export default function EnhancedTimetableGrid({ days, slots }) {
  const { isDarkMode } = useTheme()
  
  if (!days || !slots) return <div>No timetable data</div>

  const daysList = Object.keys(slots)

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse bg-white dark:bg-gray-900">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Time
            </th>
            {daysList.map((day) => (
              <th
                key={day}
                className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots[daysList[0]].map((slot, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50">
                {slot.start_time} - {slot.end_time}
              </td>
              {daysList.map((day, dayIdx) => {
                const cellSlot = slots[day][idx]
                const isBreak = cellSlot.subject === 'Break'
                const bgColor = isBreak
                  ? 'bg-gray-300 dark:bg-gray-600'
                  : getColorForSubject(cellSlot.subject)

                return (
                  <td
                    key={`${day}-${idx}`}
                    className={`border border-gray-200 dark:border-gray-700 px-4 py-3 align-center`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`${bgColor} rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-lg`}
                    >
                      <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {cellSlot.subject}
                      </div>
                      {cellSlot.teacher && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {cellSlot.teacher}
                        </div>
                      )}
                      {cellSlot.room && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Room {cellSlot.room}
                        </div>
                      )}
                    </motion.div>
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

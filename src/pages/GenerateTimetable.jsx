import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { timetableAPI } from '../services/api'

export default function GenerateTimetable() {
  const [loading, setLoading] = useState(false)
  const [timetable, setTimetable] = useState(null)
  const [viewMode, setViewMode] = useState('preview')
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  const days = timetable?.timetable ? Object.keys(timetable.timetable) : []
  const currentDay = days[currentDayIndex]
  const currentSlots = timetable?.timetable?.[currentDay] || []

  const goToNextDay = () => {
    if (currentDayIndex < days.length - 1) {
      setSlideDirection(1)
      setCurrentDayIndex(currentDayIndex + 1)
    }
  }

  const goToPreviousDay = () => {
    if (currentDayIndex > 0) {
      setSlideDirection(-1)
      setCurrentDayIndex(currentDayIndex - 1)
    }
  }

  const goToDay = (index) => {
    setSlideDirection(index > currentDayIndex ? 1 : -1)
    setCurrentDayIndex(index)
  }

  const handleGenerateSlots = async () => {
    setLoading(true)
    try {
      const response = await timetableAPI.generateSlots()
      setTimetable(response.data)
      setViewMode('preview')
      setCurrentDayIndex(0) // Reset to first day
    } catch (error) {
      console.error('Error generating slots:', error)
      alert('Failed to generate time slots. Please check your configuration.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAI = async () => {
    setLoading(true)
    try {
      const response = await timetableAPI.generateAITimetable()
      setTimetable(response.data)
      setViewMode('ai')
    } catch (error) {
      console.error('Error generating AI timetable:', error)
      alert('Failed to generate AI timetable. Please ensure all data is configured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Generate Timetable</h2>
        <p className="mt-2 text-gray-600">
          Preview time slots or generate an optimized AI timetable
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleGenerateSlots}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading && viewMode === 'preview' ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Preview Time Slots'
            )}
          </button>

          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading && viewMode === 'ai' ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate AI Timetable'
            )}
          </button>
        </div>
      </div>

      {timetable && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">
              {viewMode === 'preview' ? 'Time Slots Preview' : 'AI Generated Timetable'}
            </h3>
          </div>
          
          <div className="p-6">
            {viewMode === 'preview' && timetable.timetable && (
              <div className="relative">
                {/* Day Navigation Header */}
                <div className="flex items-center justify-between mb-6 px-4">
                  {/* Previous Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goToPreviousDay}
                    disabled={currentDayIndex === 0}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      currentDayIndex === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-lg'
                    }`}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>

                  {/* Current Day Display */}
                  <div className="flex-1 mx-4">
                    <motion.div
                      key={currentDay}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <h4 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        {currentDay}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentSlots.length} {currentSlots.length === 1 ? 'slot' : 'slots'}
                      </p>
                    </motion.div>

                    {/* Day Indicator Dots */}
                    <div className="flex justify-center gap-2 mt-3">
                      {days.map((day, index) => (
                        <motion.button
                          key={day}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => goToDay(index)}
                          className={`transition-all duration-300 rounded-full ${
                            index === currentDayIndex
                              ? 'w-8 h-2 bg-gradient-to-r from-indigo-500 to-violet-500'
                              : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to ${day}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Next Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goToNextDay}
                    disabled={currentDayIndex === days.length - 1}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      currentDayIndex === days.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-lg'
                    }`}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Time Slots Container with Animation */}
                <div className="relative overflow-hidden">
                  <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
                    <motion.div
                      key={currentDay}
                      custom={slideDirection}
                      initial={prefersReducedMotion ? { opacity: 0 } : {
                        opacity: 0,
                        x: slideDirection > 0 ? 300 : -300
                      }}
                      animate={{
                        opacity: 1,
                        x: 0
                      }}
                      exit={prefersReducedMotion ? { opacity: 0 } : {
                        opacity: 0,
                        x: slideDirection > 0 ? -300 : 300
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        opacity: { duration: 0.2 }
                      }}
                      className="bg-gradient-to-br from-indigo-50/50 to-violet-50/50 rounded-2xl p-6 shadow-lg border border-indigo-100"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {currentSlots.map((slot, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: prefersReducedMotion ? 0 : idx * 0.03,
                              type: "spring",
                              stiffness: 300,
                              damping: 25
                            }}
                            whileHover={{ 
                              scale: 1.05,
                              y: -4,
                              transition: { type: "spring", stiffness: 400, damping: 20 }
                            }}
                            className={`p-3 rounded-xl text-center text-sm shadow-md transition-shadow duration-300 hover:shadow-xl ${
                              slot.type === 'break'
                                ? 'bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300'
                                : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-900 border-2 border-blue-200'
                            }`}
                          >
                            <div className="font-semibold text-base">{slot.start} - {slot.end}</div>
                            <div className="text-xs mt-1.5 capitalize font-medium opacity-80">{slot.type}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Swipe Hint for Mobile */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-4 text-center text-xs text-gray-400 md:hidden"
                >
                  <span className="inline-flex items-center gap-1">
                    <ChevronLeft className="w-3 h-3" />
                    Swipe to navigate
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </motion.div>
              </div>
            )}

            {viewMode === 'ai' && timetable.timetable && (
              <div className="space-y-6">
                {Object.entries(timetable.timetable).map(([divisionName, divisionData]) => (
                  <motion.div 
                    key={divisionName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl overflow-hidden shadow-xl border border-green-100"
                  >
                    {/* Division Header with Gradient Badge */}
                    <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-6 py-4 border-b border-green-100">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{
                            boxShadow: [
                              "0 0 20px rgba(34, 197, 94, 0.3)",
                              "0 0 30px rgba(16, 185, 129, 0.4)",
                              "0 0 20px rgba(34, 197, 94, 0.3)"
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg"
                        >
                          <h4 className="font-bold text-white text-lg">Division {divisionName}</h4>
                        </motion.div>
                        <div className="flex items-center gap-2 ml-auto">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 bg-green-500 rounded-full"
                          />
                          <span className="text-xs font-medium text-green-700">AI Generated</span>
                        </div>
                      </div>
                    </div>

                    {/* Table Container with Scroll Shadows */}
                    <div className="relative">
                      {/* Left scroll shadow */}
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/80 to-transparent pointer-events-none z-10" />
                      {/* Right scroll shadow */}
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none z-10" />
                      
                      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100">
                        <table className="min-w-full divide-y divide-green-200">
                          {/* Enhanced Header */}
                          <thead className="bg-gradient-to-r from-gray-50 to-green-50 sticky top-0 z-20">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-green-100 bg-white/50 backdrop-blur-sm">
                                <span className="flex items-center gap-2">
                                  <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                                  Day
                                </span>
                              </th>
                              {divisionData.schedule && divisionData.schedule[Object.keys(divisionData.schedule)[0]]?.map((_, idx) => (
                                <th key={idx} className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider bg-gradient-to-b from-green-50/50 to-transparent">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-green-600">Slot {idx + 1}</span>
                                    <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent" />
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>

                          {/* Enhanced Body */}
                          <tbody className="bg-white divide-y divide-green-100">
                            {divisionData.schedule && Object.entries(divisionData.schedule).map(([day, slots], rowIdx) => (
                              <motion.tr 
                                key={day}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: rowIdx * 0.05 }}
                                className={`transition-all duration-300 hover:bg-green-50/50 group ${
                                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                }`}
                              >
                                {/* Day Cell */}
                                <td className="px-6 py-4 whitespace-nowrap border-r border-green-100 bg-gradient-to-r from-white to-transparent">
                                  <div className="flex items-center gap-3">
                                    <motion.div
                                      whileHover={{ scale: 1.1, rotate: 5 }}
                                      className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
                                    >
                                      <span className="text-white font-bold text-xs">
                                        {day.substring(0, 3).toUpperCase()}
                                      </span>
                                    </motion.div>
                                    <span className="text-sm font-bold text-gray-900">{day}</span>
                                  </div>
                                </td>

                                {/* Slot Cells */}
                                {slots.map((slot, idx) => (
                                  <td key={idx} className="px-6 py-4 text-center">
                                    {slot.type === 'break' ? (
                                      <motion.span 
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300 shadow-sm hover:shadow-md transition-all"
                                      >
                                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                                        Break
                                      </motion.span>
                                    ) : slot.subject ? (
                                      <motion.div 
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        className="inline-block"
                                      >
                                        <div className={`px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all ${
                                          slot.subject.toLowerCase().includes('lab') || slot.subject.toLowerCase().includes('practical')
                                            ? 'bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-300'
                                            : slot.subject.toLowerCase() === 'free' || slot.subject.toLowerCase() === 'free period'
                                            ? 'bg-gradient-to-br from-gray-100 to-slate-100 border border-gray-300'
                                            : 'bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-300'
                                        }`}>
                                          <div className={`font-bold text-xs mb-1 ${
                                            slot.subject.toLowerCase().includes('lab') || slot.subject.toLowerCase().includes('practical')
                                              ? 'text-purple-900'
                                              : slot.subject.toLowerCase() === 'free' || slot.subject.toLowerCase() === 'free period'
                                              ? 'text-gray-600'
                                              : 'text-blue-900'
                                          }`}>
                                            {slot.subject}
                                          </div>
                                          {slot.teacher && (
                                            <div className={`text-[10px] font-medium ${
                                              slot.subject.toLowerCase().includes('lab') || slot.subject.toLowerCase().includes('practical')
                                                ? 'text-purple-600'
                                                : slot.subject.toLowerCase() === 'free' || slot.subject.toLowerCase() === 'free period'
                                                ? 'text-gray-500'
                                                : 'text-blue-600'
                                            }`}>
                                              {slot.teacher}
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    ) : (
                                      <span className="text-gray-300 text-lg font-light">—</span>
                                    )}
                                  </td>
                                ))}
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Table Footer with Legend */}
                    <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-4 border-t border-green-100">
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <span className="font-semibold text-gray-600">Legend:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-300 rounded" />
                          <span className="text-gray-600">Theory</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-300 rounded" />
                          <span className="text-gray-600">Lab</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-300 rounded-full" />
                          <span className="text-gray-600">Break</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-br from-gray-100 to-slate-100 border border-gray-300 rounded" />
                          <span className="text-gray-600">Free</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!timetable.timetable && (
              <div className="text-center py-8 text-gray-500">
                <p>No timetable data available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!timetable && (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No timetable generated</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by generating time slots or an AI-powered timetable
          </p>
        </div>
      )}
    </div>
  )
}

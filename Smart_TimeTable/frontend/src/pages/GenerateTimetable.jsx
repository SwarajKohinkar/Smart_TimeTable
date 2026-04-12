import { useState, useEffect } from 'react'
import { timetableAPI } from '../services/api'

export default function GenerateTimetable() {
  const [timetable, setTimetable] = useState(null)
  const [viewMode, setViewMode] = useState('preview')
  const [loading, setLoading] = useState(false)

  const divisions = timetable?.timetable || []

  const handleGenerateSlots = async () => {
    setLoading(true)
    const res = await timetableAPI.generateSlots()
    setTimetable(res.data)
    setViewMode('preview')
    setLoading(false)
  }

  const handleGenerateAI = async () => {
    setLoading(true)
    const res = await timetableAPI.generateAITimetable()
    setTimetable(res.data)
    setViewMode('ai')
    setLoading(false)
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Generate Timetable</h2>

      <div className="flex gap-4 mb-6">
        <button onClick={handleGenerateSlots} className="bg-blue-600 text-white px-4 py-2 rounded">
          Preview Slots
        </button>
        <button onClick={handleGenerateAI} className="bg-green-600 text-white px-4 py-2 rounded">
          Generate AI Timetable
        </button>
      </div>

      {/* ================= PREVIEW SLOTS ================= */}
      {viewMode === 'preview' && timetable?.timetable && (
        <div className="space-y-6">
          {Object.entries(timetable.timetable).map(([day, slots]) => (
            <div key={day}>
              <h3 className="font-bold text-lg mb-3">{day}</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {slots.map((slot, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-center shadow ${
                      slot.type === 'break'
                        ? 'bg-yellow-100 border border-yellow-300'
                        : 'bg-blue-100 border border-blue-300'
                    }`}
                  >
                    <div className="font-semibold">{slot.time}</div>
                    <div className="text-xs capitalize">{slot.type}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= AI TIMETABLE ================= */}
      {viewMode === 'ai' && divisions.length > 0 && (
        <div className="space-y-10">
          {divisions.map((division) => (
            <div key={division.division} className="bg-white rounded-lg shadow p-4">

              <h3 className="text-xl font-bold mb-4">
                Division {division.division}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Day</th>
                      {division.days[0].slots.map((_, i) => (
                        <th key={i} className="border p-2">
                          Slot {i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {division.days.map((day) => (
                      <tr key={day.day}>
                        <td className="border p-2 font-semibold">
                          {day.day}
                        </td>

                        {day.slots.map((slot, i) => (
                          <td key={i} className="border p-2 text-center">

                            <div className={`p-2 rounded ${
                              slot.type === 'Lab'
                                ? 'bg-purple-100'
                                : slot.type === 'Break'
                                ? 'bg-yellow-100'
                                : slot.type === 'Free'
                                ? 'bg-gray-100'
                                : 'bg-blue-100'
                            }`}>

                              <div className="text-xs font-bold">
                                {slot.time}
                              </div>

                              <div className="text-sm mt-1">
                                {slot.subject}
                              </div>

                              <div className="text-[10px] text-gray-600">
                                {slot.teacher || ""}
                              </div>

                            </div>

                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
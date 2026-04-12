import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Clock, TrendingUp, AlertTriangle, 
  ChevronDown, ChevronUp, Filter
} from 'lucide-react'
import { timetableAPI, teachersAPI, subjectsAPI, subjectTeacherAPI } from '../services/api'

export default function TeacherWorkload() {
  const [loading, setLoading] = useState(true)
  const [workload, setWorkload] = useState([])
  const [teachers, setTeachers] = useState([])
  const [sortBy, setSortBy] = useState('utilization')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterOverloaded, setFilterOverloaded] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [workloadRes, teachersRes] = await Promise.all([
        timetableAPI.getTeacherWorkload(),
        teachersAPI.getAll()
      ])
      setWorkload(workloadRes.data || [])
      setTeachers(teachersRes.data || [])
    } catch (error) {
      console.error('Error fetching workload:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const sortedWorkload = [...workload]
    .filter(w => !filterOverloaded || w.utilization > 100)
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1
      if (sortBy === 'utilization') return (a.utilization - b.utilization) * multiplier
      if (sortBy === 'hours') return (a.assigned_hours - b.assigned_hours) * multiplier
      if (sortBy === 'name') return a.teacher_name.localeCompare(b.teacher_name) * multiplier
      return 0
    })

  const stats = {
    total: workload.length,
    overloaded: workload.filter(w => w.utilization > 100).length,
    underutilized: workload.filter(w => w.utilization < 50).length,
    avgUtilization: workload.length > 0 
      ? Math.round(workload.reduce((sum, w) => sum + w.utilization, 0) / workload.length)
      : 0
  }

  const getUtilizationColor = (util) => {
    if (util > 100) return 'text-red-400'
    if (util > 80) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getUtilizationBg = (util) => {
    if (util > 100) return 'bg-red-500'
    if (util > 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading workload data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Teacher Workload</h1>
          <p className="text-gray-400">Monitor and balance teaching assignments</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Teachers', value: stats.total, icon: Users, color: 'from-blue-500' },
            { label: 'Overloaded', value: stats.overloaded, icon: AlertTriangle, color: 'from-red-500' },
            { label: 'Underutilized', value: stats.underutilized, icon: TrendingUp, color: 'from-yellow-500' },
            { label: 'Avg Utilization', value: `${stats.avgUtilization}%`, icon: Clock, color: 'from-green-500' }
          ].map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-r ${card.color} to-transparent rounded-xl p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{card.label}</p>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                </div>
                <card.icon className="w-10 h-10 text-white/60" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setFilterOverloaded(!filterOverloaded)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              filterOverloaded
                ? 'bg-red-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Filter className="w-4 h-4" />
            {filterOverloaded ? 'Show All' : 'Show Overloaded Only'}
          </button>
        </div>

        {/* Workload Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 text-white font-medium">
            <div 
              className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-blue-400"
              onClick={() => handleSort('name')}
            >
              Teacher Name
              {sortBy === 'name' && (
                sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
              )}
            </div>
            <div 
              className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-blue-400"
              onClick={() => handleSort('hours')}
            >
              Assigned Hours
              {sortBy === 'hours' && (
                sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
              )}
            </div>
            <div className="col-span-2">Max Hours</div>
            <div 
              className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-blue-400"
              onClick={() => handleSort('utilization')}
            >
              Utilization
              {sortBy === 'utilization' && (
                sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
              )}
            </div>
            <div className="col-span-2">Subjects</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/10">
            {sortedWorkload.map((w, idx) => (
              <motion.div
                key={w.teacher_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-12 gap-4 p-4 text-white hover:bg-white/5 transition-colors"
              >
                <div className="col-span-4 font-medium">{w.teacher_name}</div>
                <div className="col-span-2">{w.assigned_hours}h</div>
                <div className="col-span-2 text-gray-400">{w.max_hours}h</div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getUtilizationBg(w.utilization)}`}
                        style={{ width: `${Math.min(w.utilization, 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getUtilizationColor(w.utilization)}`}>
                      {w.utilization}%
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {w.subjects.slice(0, 2).map((s, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs"
                      >
                        {s.name}
                      </span>
                    ))}
                    {w.subjects.length > 2 && (
                      <span className="px-2 py-0.5 bg-white/10 text-gray-400 rounded text-xs">
                        +{w.subjects.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {sortedWorkload.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              No teachers found. Add teachers and assign them to subjects.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

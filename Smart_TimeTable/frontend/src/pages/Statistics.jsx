import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import { 
  Users, BookOpen, Clock, AlertTriangle, TrendingUp, 
  Calendar, Building, Award, Activity
} from 'lucide-react'
import { 
  divisionsAPI, teachersAPI, subjectsAPI, timetableAPI,
  exportAPI, downloadFile
} from '../services/api'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function Statistics() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    divisions: [],
    teachers: [],
    subjects: [],
    workload: [],
    versions: [],
    conflicts: []
  })
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const [divisionsRes, teachersRes, subjectsRes, workloadRes, versionsRes] = await Promise.all([
        divisionsAPI.getAll(),
        teachersAPI.getAll(),
        subjectsAPI.getAll(),
        timetableAPI.getTeacherWorkload().catch(() => ({ data: [] })),
        timetableAPI.getVersions().catch(() => ({ data: [] }))
      ])

      setStats({
        divisions: divisionsRes.data || [],
        teachers: teachersRes.data || [],
        subjects: subjectsRes.data || [],
        workload: workloadRes.data || [],
        versions: versionsRes.data || []
      })
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryData = () => {
    const categoryCount = {}
    stats.subjects.forEach(s => {
      categoryCount[s.category] = (categoryCount[s.category] || 0) + 1
    })
    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }))
  }

  const getWorkloadChartData = () => {
    return stats.workload
      .sort((a, b) => b.assigned_hours - a.assigned_hours)
      .slice(0, 10)
      .map(w => ({
        name: w.teacher_name,
        hours: w.assigned_hours,
        max: w.max_hours,
        utilization: w.utilization
      }))
  }

  const getSubjectHoursData = () => {
    return stats.subjects
      .sort((a, b) => b.weekly_hours - a.weekly_hours)
      .slice(0, 10)
      .map(s => ({
        name: s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name,
        hours: s.weekly_hours
      }))
  }

  const handleExportExcel = async () => {
    try {
      const response = await exportAPI.allExcel()
      downloadFile(response.data, `timetable_stats_${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading statistics...</div>
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
          <h1 className="text-4xl font-bold text-white mb-2">Statistics Dashboard</h1>
          <p className="text-gray-400">Comprehensive overview of your timetable system</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Divisions', value: stats.divisions.length, icon: Building, color: 'from-blue-500 to-blue-600' },
            { label: 'Teachers', value: stats.teachers.length, icon: Users, color: 'from-green-500 to-green-600' },
            { label: 'Subjects', value: stats.subjects.length, icon: BookOpen, color: 'from-purple-500 to-purple-600' },
            { label: 'Versions', value: stats.versions.length, icon: Calendar, color: 'from-orange-500 to-orange-600' }
          ].map((card, idx) => (
            <motion.div
              key={card.label}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-r ${card.color} rounded-xl p-6 shadow-lg`}
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

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {['overview', 'workload', 'subjects', 'export'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {activeTab === 'overview' && (
            <>
              {/* Subject Categories Pie Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Subject Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Subject Hours Bar Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Top Subjects by Weekly Hours</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getSubjectHoursData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#fff" fontSize={12} />
                    <YAxis stroke="#fff" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    />
                    <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === 'workload' && (
            <>
              {/* Teacher Workload Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 lg:col-span-2">
                <h3 className="text-xl font-semibold text-white mb-4">Teacher Workload Distribution</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getWorkloadChartData()} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis type="number" stroke="#fff" />
                    <YAxis dataKey="name" type="category" stroke="#fff" width={100} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="hours" name="Assigned Hours" fill="#10B981" />
                    <Bar dataKey="max" name="Max Hours" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Utilization Cards */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 lg:col-span-2">
                <h3 className="text-xl font-semibold text-white mb-4">Teacher Utilization</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.workload.slice(0, 8).map((w, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-4">
                      <p className="text-white font-medium truncate">{w.teacher_name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              w.utilization > 100 ? 'bg-red-500' : 
                              w.utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(w.utilization, 100)}%` }}
                          />
                        </div>
                        <span className="text-white text-sm">{w.utilization}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'subjects' && (
            <>
              {/* Lab vs Theory */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Lab vs Theory Subjects</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Theory', value: stats.subjects.filter(s => !s.is_lab).length },
                        { name: 'Lab', value: stats.subjects.filter(s => s.is_lab).length }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      <Cell fill="#3B82F6" />
                      <Cell fill="#10B981" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Subject List */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">All Subjects</h3>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {stats.subjects.map((subject, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{subject.name}</p>
                        <p className="text-gray-400 text-sm">{subject.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          subject.is_lab ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {subject.is_lab ? 'Lab' : 'Theory'}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">
                          {subject.weekly_hours}h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'export' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 lg:col-span-2">
              <h3 className="text-xl font-semibold text-white mb-4">Export Data</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'All Data (Excel)', action: handleExportExcel, icon: Activity },
                  { label: 'Subjects CSV', action: async () => {
                    const res = await exportAPI.subjectsCSV()
                    downloadFile(res.data, 'subjects.csv')
                  }, icon: BookOpen },
                  { label: 'Teachers CSV', action: async () => {
                    const res = await exportAPI.teachersCSV()
                    downloadFile(res.data, 'teachers.csv')
                  }, icon: Users },
                  { label: 'Divisions CSV', action: async () => {
                    const res = await exportAPI.divisionsCSV()
                    downloadFile(res.data, 'divisions.csv')
                  }, icon: Building }
                ].map((item, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.action}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white flex flex-col items-center gap-2 hover:shadow-lg transition-shadow"
                  >
                    <item.icon className="w-8 h-8" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'

export default function AlgorithmVisualization({ algorithmData }) {
  const { isDarkMode } = useTheme()

  if (!algorithmData) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No algorithm data available
        </p>
      </div>
    )
  }

  const chartData = algorithmData.fitnessHistory?.map((fitness, idx) => ({
    generation: idx,
    fitness: fitness,
    conflicts: algorithmData.conflictHistory?.[idx] || 0,
  })) || []

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

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

  const statColorClasses = {
    blue: {
      card: 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700',
      text: 'text-blue-600 dark:text-blue-400',
    },
    green: {
      card: 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700',
      text: 'text-green-600 dark:text-green-400',
    },
    red: {
      card: 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700',
      text: 'text-red-600 dark:text-red-400',
    },
    purple: {
      card: 'bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700',
      text: 'text-purple-600 dark:text-purple-400',
    },
  }

  const stats = [
    {
      label: 'Total Generations',
      value: algorithmData.generations || 0,
      color: 'blue',
    },
    {
      label: 'Best Fitness',
      value: algorithmData.bestFitness?.toFixed(2) || 0,
      color: 'green',
    },
    {
      label: 'Total Conflicts',
      value: algorithmData.totalConflicts || 0,
      color: 'red',
    },
    {
      label: 'Execution Time',
      value: `${algorithmData.executionTime?.toFixed(2) || 0}s`,
      color: 'purple',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Algorithm Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="">
            <div
              className={`${statColorClasses[stat.color].card} rounded-lg p-4`}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p
                className={`text-2xl font-bold ${statColorClasses[stat.color].text}`}
              >
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fitness Progress Chart */}
      {chartData.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Algorithm Fitness Progress
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartTheme.colors.grid}
              />
              <XAxis
                dataKey="generation"
                stroke={chartTheme.colors.axis}
                label={{ value: 'Generation', position: 'insideBottomRight', offset: -5 }}
              />
              <YAxis
                stroke={chartTheme.colors.axis}
                label={{ value: 'Fitness Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: chartTheme.colors.text,
                }}
              />
              <Line
                type="monotone"
                dataKey="fitness"
                stroke="#10b981"
                dot={false}
                strokeWidth={2}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Parameters Info */}
      {algorithmData.parameters && (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Algorithm Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(algorithmData.parameters).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {typeof value === 'number' ? value.toFixed(4) : value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

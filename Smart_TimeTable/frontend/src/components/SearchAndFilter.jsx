import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function SearchAndFilter({
  data,
  onFilterChange,
  searchFields = ['name', 'subject', 'teacher'],
  filter = {},
}) {
  const { isDarkMode } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState(filter)
  const [showFilters, setShowFilters] = useState(false)

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = searchFields.some((field) => {
          const value = item[field]
          return value && value.toString().toLowerCase().includes(query)
        })
        if (!matchesSearch) return false
      }

      // Additional filters
      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && item[key] !== value) return false
      }

      return true
    })
  }, [searchQuery, activeFilters, data, searchFields])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters }
    if (value === null || value === undefined || value === '') {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters, filteredData)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setActiveFilters({})
    onFilterChange?.({}, data)
  }

  const hasActiveFilters = searchQuery || Object.keys(activeFilters).length > 0

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div
          className={`relative flex items-center rounded-lg border-2 transition-all focus-within:border-blue-500`}
          style={{
            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          }}
        >
          <Search className="absolute left-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search timetable..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              onFilterChange?.(activeFilters, filteredData)
            }}
            className={`flex-1 pl-10 pr-4 py-3 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                onFilterChange?.(activeFilters, data)
              }}
              className="pr-3 hover:opacity-70 transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Filter Toggle and Active Filters */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Clear all
          </button>
        )}

        <span className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
          {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`rounded-lg border p-4 space-y-4`}
          style={{
            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
            backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
          }}
        >
          {/* Add filter options based on your data structure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <select
              value={activeFilters.subject || ''}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border outline-none transition`}
              style={{
                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f3f4f6' : '#1f2937',
              }}
            >
              <option value="">All Subjects</option>
              <option value="Math">Math</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="PE">PE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teacher
            </label>
            <input
              type="text"
              placeholder="Search by teacher name..."
              value={activeFilters.teacher || ''}
              onChange={(e) => handleFilterChange('teacher', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border outline-none transition`}
              style={{
                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f3f4f6' : '#1f2937',
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}

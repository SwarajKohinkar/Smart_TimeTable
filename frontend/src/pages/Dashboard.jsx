import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles, BarChart3, ChevronRight, Zap, Clock, Users } from 'lucide-react'

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0 relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-violet-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 relative z-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap className="w-8 h-8 text-violet-600" />
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-800 bg-clip-text text-transparent">
            Dashboard
          </h2>
        </div>
        <p className="mt-2 text-lg text-gray-600">
          Manage your timetable generation workflow with ease
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10"
      >
        {/* Input Data Card */}
        <motion.div variants={itemVariants}>
          <Link to="/input" className="block group">
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-300"
              />
              
              {/* Glowing effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.1), transparent 60%)"
                }}
              />

              <div className="px-6 py-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-3 shadow-lg group-hover:shadow-indigo-500/50"
                  >
                    <BookOpen className="h-7 w-7 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                </div>

                <div className="mb-3">
                  <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
                    Input Data
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-gray-900">
                    Manage Resources
                  </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Add divisions, teachers, subjects, and configure timetable settings
                </p>

                <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
                  <span>Get Started</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-tl-full" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Generate Timetable Card */}
        <motion.div variants={itemVariants}>
          <Link to="/generate" className="block group">
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden border border-green-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300"
              />
              
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.1), transparent 60%)"
                }}
              />

              <div className="px-6 py-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="relative flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 shadow-lg group-hover:shadow-green-500/50"
                  >
                    <Sparkles className="h-7 w-7 text-white" />
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                      className="absolute inset-0 bg-green-400 rounded-xl"
                    />
                  </motion.div>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600 uppercase tracking-wide">
                      Generate Timetable
                    </span>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      AI
                    </motion.span>
                  </div>
                  <h3 className="mt-1 text-2xl font-bold text-gray-900">
                    AI-Powered
                  </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Generate optimized timetables using genetic algorithms
                </p>

                <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                  <span>Start Generation</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-green-500/10 to-transparent rounded-tl-full" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Statistics Card */}
        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl overflow-hidden border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/10 group-hover:to-violet-500/10 transition-all duration-300"
            />
            
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1), transparent 60%)"
              }}
            />

            <div className="px-6 py-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl p-3 shadow-lg group-hover:shadow-blue-500/50"
                >
                  <BarChart3 className="h-7 w-7 text-white" />
                </motion.div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                  Coming Soon
                </span>
              </div>

              <div className="mb-3">
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                  Statistics
                </span>
                <h3 className="mt-1 text-2xl font-bold text-gray-900">
                  View Analytics
                </h3>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Track timetable generation metrics and resource utilization
              </p>

              <div className="flex items-center gap-2 text-blue-600 font-medium text-sm opacity-50">
                <span>Coming Soon</span>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-violet-500/10 to-transparent rounded-tl-full" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-10 relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                Getting Started
              </h3>
            </div>
          </div>
          
          <div className="px-6 py-6">
            <ol className="space-y-4">
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-start group hover:bg-indigo-50/50 rounded-xl p-3 -ml-3 transition-all duration-300"
              >
                <motion.span 
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-xl text-sm font-bold mr-4 shadow-md group-hover:shadow-lg group-hover:shadow-indigo-500/50"
                >
                  1
                </motion.span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-gray-900">Add divisions, teachers, and subjects</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Navigate to the Input Data section to begin</p>
                </div>
                <ChevronRight className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.li>

              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-start group hover:bg-blue-50/50 rounded-xl p-3 -ml-3 transition-all duration-300"
              >
                <motion.span 
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-bold mr-4 shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/50"
                >
                  2
                </motion.span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">Configure timetable settings</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Set working days and time slots for optimal scheduling</p>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.li>

              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-start group hover:bg-green-50/50 rounded-xl p-3 -ml-3 transition-all duration-300"
              >
                <motion.span 
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl text-sm font-bold mr-4 shadow-md group-hover:shadow-lg group-hover:shadow-green-500/50"
                >
                  3
                </motion.span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900">Generate your AI-powered timetable</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Let our algorithm optimize your schedule automatically</p>
                </div>
                <ChevronRight className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.li>
            </ol>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl border border-blue-100"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Quick Tip</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Make sure to add all resources before generating a timetable for the best optimization results.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

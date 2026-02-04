import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Database, Sparkles, Zap } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/input', label: 'Input Data', icon: Database },
    { path: '/generate', label: 'Generate Timetable', icon: Sparkles },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-violet-50/30">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg mr-3 group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-shadow"
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-800 bg-clip-text text-transparent">
                    Smart Timetable
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">AI-Powered Generator</p>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="hidden sm:flex sm:space-x-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="relative group"
                    >
                      <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          relative px-4 py-2 rounded-xl font-medium text-sm
                          transition-all duration-300 flex items-center gap-2
                          ${active 
                            ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/30' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
                        <span>{item.label}</span>
                        
                        {/* Active indicator */}
                        {active && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.div>

                      {/* Hover glow effect */}
                      {!active && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/10 group-hover:to-violet-500/10 rounded-xl transition-all duration-300"
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right side - Optional actions */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-green-700">Active</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <motion.div
          className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

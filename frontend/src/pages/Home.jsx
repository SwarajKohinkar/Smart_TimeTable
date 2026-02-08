import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Brain, BarChart3, Users, Calendar, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const [ripples, setRipples] = useState([])

  const handleGetStarted = (e) => {
    // Create ripple effect
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = { x, y, id: Date.now() }
    setRipples([...ripples, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
    
    navigate('/dashboard')
  }

  const handleViewDemo = () => {
    // Scroll to how it works section
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: prefersReducedMotion ? 0 : [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  const featureCards = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Manage Input Data",
      color: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Timetable Generation",
      color: "from-violet-500 to-purple-500",
      delay: 0.2
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics & Statistics",
      color: "from-pink-500 to-rose-500",
      delay: 0.4
    }
  ]

  const steps = [
    {
      number: "01",
      icon: <Users className="w-8 h-8" />,
      title: "Add Resources",
      description: "Add teachers, subjects, divisions, and classrooms to your system"
    },
    {
      number: "02",
      icon: <Calendar className="w-8 h-8" />,
      title: "Configure Rules",
      description: "Set constraints, working hours, and preferences for optimization"
    },
    {
      number: "03",
      icon: <Sparkles className="w-8 h-8" />,
      title: "Generate Timetable",
      description: "Let AI create an optimized, conflict-free timetable in seconds"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 overflow-hidden relative">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
          className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4
          }}
          className="absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="inline-block"
                >
                  <motion.span 
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 30px rgba(139, 92, 246, 0.4)",
                        "0 0 20px rgba(59, 130, 246, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-medium"
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    AI-Powered Solution
                  </motion.span>
                </motion.div>
                
                <div className="relative">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                    Smart Timetable
                    <motion.span 
                      className="block bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{
                        backgroundSize: '200% 200%'
                      }}
                    >
                      Generator
                    </motion.span>
                  </h1>
                  {/* AI Pulse Shimmer */}
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [0.95, 1.05, 0.95]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 rounded-full blur-sm"
                  />
                </div>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-xl sm:text-2xl text-gray-600 font-medium"
              >
                Generate optimized academic timetables using AI — faster, smarter, stress-free.
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-500 leading-relaxed"
              >
                Add teachers, subjects, and divisions. Let AI handle conflicts, workload balance, and optimization.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/50 transition-all duration-300 group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  {/* Ripple effects */}
                  {ripples.map(ripple => (
                    <motion.span
                      key={ripple.id}
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 4, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        position: 'absolute',
                        left: ripple.x,
                        top: ripple.y,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </motion.button>

                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 10px 30px rgba(139, 92, 246, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewDemo}
                  className="relative px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold text-lg border-2 border-gray-300 hover:border-violet-500 hover:text-violet-600 transition-all duration-300 shadow-md group overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-50 to-violet-50"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">View Demo</span>
                </motion.button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-6 pt-4"
              >
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(34, 197, 94, 0.3)",
                        "0 0 0 10px rgba(34, 197, 94, 0)",
                        "0 0 0 0 rgba(34, 197, 94, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  <span className="text-gray-700 font-medium">No conflicts</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0.3)",
                        "0 0 0 10px rgba(59, 130, 246, 0)",
                        "0 0 0 0 rgba(59, 130, 246, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  <span className="text-gray-700 font-medium">Real-time optimization</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Side - Animated Feature Cards */}
            <div className="relative hidden lg:block">
              <div className="relative h-[600px]">
                {featureCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                    style={{
                      position: 'absolute',
                      top: `${index * 180}px`,
                      left: index % 2 === 0 ? '0' : '80px',
                    }}
                    className="w-80"
                  >
                    <motion.div
                      animate={prefersReducedMotion ? {} : {
                        y: [-8, 8, -8],
                        rotate: [index % 2 === 0 ? -2 : 2, index % 2 === 0 ? 2 : -2, index % 2 === 0 ? -2 : 2]
                      }}
                      transition={{
                        duration: 4 + index * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3
                      }}
                      whileHover={{ 
                        scale: 1.08, 
                        rotate: 0,
                        y: -5,
                        transition: { 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20 
                        }
                      }}
                      className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 relative group cursor-pointer`}
                    >
                      {/* Breathing shadow effect */}
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 10px 40px rgba(0,0,0,0.15)",
                            "0 20px 60px rgba(0,0,0,0.25)",
                            "0 10px 40px rgba(0,0,0,0.15)"
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-2xl"
                      />
                      
                      {/* Card glow on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0))`,
                          boxShadow: "0 0 40px rgba(255,255,255,0.5)"
                        }}
                      />
                      
                      <div className="relative z-10">
                        <motion.div 
                          className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 w-fit"
                          animate={{
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.5
                          }}
                        >
                          <motion.div 
                            className="text-white"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            {card.icon}
                          </motion.div>
                        </motion.div>
                        <h3 className="text-white text-xl font-bold drop-shadow-lg">
                          {card.title}
                        </h3>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
                
                {/* Enhanced Decorative Elements */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.15, 0.3, 0.15],
                    rotate: [360, 180, 0]
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to generate your perfect timetable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="relative group"
              >
                <motion.div 
                  className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden"
                  whileHover={{
                    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Hover gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  {/* Step Number */}
                  <motion.div 
                    className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </motion.div>

                  {/* Icon */}
                  <div className="mb-6 mt-4 relative z-10">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center text-white"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(59, 130, 246, 0.3)",
                          "0 0 30px rgba(139, 92, 246, 0.5)",
                          "0 0 20px rgba(59, 130, 246, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -10, 10, 0]
                      }}
                    >
                      {step.icon}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed relative z-10">
                    {step.description}
                  </p>
                </motion.div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-violet-300"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="relative overflow-hidden px-12 py-5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold text-xl shadow-lg shadow-blue-500/50 transition-all duration-300 group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Creating Your Timetable
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  backgroundSize: '200% 100%'
                }}
              />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2026 Smart Timetable Generator. Built with AI for academic excellence.
          </p>
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { 
  BarChart3, 
  TrendingUp,
  Database,
  Zap,
  FileText,
  Share2,
  Mail,
  Calendar,
  MessageSquare,
  Instagram,
  Link2,
  Layout,
  Lightbulb,
  Users,
  DollarSign,
  PieChart,
  LineChart,
  Table,
  Gauge,
  MousePointerClick,
  ArrowRight,
  CheckCircle2,
  Plus,
  Eye,
  ShoppingCart,
  Move,
  Bot,
  User,
  Sparkles,
  Puzzle,
  FileCode,
  RefreshCw,
  Code
} from 'lucide-react'

export function SolutionPreview() {
  const { t } = useLanguage()
  const [selectedConnector, setSelectedConnector] = useState(0)
  const [selectedComponent, setSelectedComponent] = useState(0)
  const [dashboardComponents, setDashboardComponents] = useState<number[]>([])
  const [draggingComponent, setDraggingComponent] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)
  const [chatMessages, setChatMessages] = useState<number>(0)
  const chatStartedRef = useRef(false)

  const steps = useMemo(() => [
    {
      number: 1,
      icon: Link2,
      title: t.solutionPreview.step1.title,
      shortDesc: t.solutionPreview.step1.shortDesc,
      description: t.solutionPreview.step1.description,
      dataSources: [
        { icon: BarChart3, name: 'GA4', color: '#3b82f6' },
        { icon: TrendingUp, name: 'Facebook', color: '#2563eb' },
        { icon: Instagram, name: 'Instagram', color: '#e1306c' },
        { icon: Database, name: 'Google Ads', color: '#ef4444' },
        { icon: Zap, name: 'Shopify', color: '#22c55e' },
        { icon: Mail, name: 'Email', color: '#eab308' },
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: 2,
      icon: Layout,
      title: t.solutionPreview.step2.title,
      shortDesc: t.solutionPreview.step2.shortDesc,
      description: t.solutionPreview.step2.description,
      components: [
        { icon: BarChart3, name: 'Charts', color: '#3b82f6' },
        { icon: PieChart, name: 'Pie', color: '#8b5cf6' },
        { icon: LineChart, name: 'Lines', color: '#ec4899' },
        { icon: Table, name: 'Tables', color: '#22c55e' },
        { icon: Gauge, name: 'KPIs', color: '#eab308' },
        { icon: MousePointerClick, name: 'Custom', color: '#ef4444' },
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: 3,
      icon: Lightbulb,
      title: t.solutionPreview.step3.title,
      shortDesc: t.solutionPreview.step3.shortDesc,
      description: t.solutionPreview.step3.description,
      color: 'from-yellow-500 to-orange-500',
    },
  ], [t])

  const demoStats = [
    { icon: Users, label: 'Active Users', value: '12.5K', change: '+23%' },
    { icon: TrendingUp, label: 'Sessions', value: '45.2K', change: '+18%' },
    { icon: DollarSign, label: 'Revenue', value: '$89.4K', change: '+31%' },
    { icon: BarChart3, label: 'Conversion', value: '3.2%', change: '+5%' },
  ]

  // Animate connector selection - optimized with requestAnimationFrame
  useEffect(() => {
    if (!steps[0].dataSources || steps[0].dataSources.length === 0) return
    
    let rafId: number | null = null
    let lastUpdate = Date.now()
    const interval = 3000 // Change every 3 seconds
    let isActive = true

    const animate = () => {
      if (!isActive) return
      
      const now = Date.now()
      if (now - lastUpdate >= interval) {
        setSelectedConnector((prev) => (prev + 1) % steps[0].dataSources!.length)
        lastUpdate = now
      }
      
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      isActive = false
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [steps[0].dataSources?.length]) // Only depend on length, not the whole array

  // Animate component selection and dashboard building - optimized
  const componentIndexRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])
  const hasStartedRef = useRef(false)
  const isActiveRef = useRef(false)
  const chatIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startAnimation = useCallback(() => {
    if (!steps[1].components || steps[1].components.length === 0) return
    
    // Clear any existing intervals/timeouts
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    timeoutRefs.current.forEach(clearTimeout)
    timeoutRefs.current = []
    
    // Reset state
    setDashboardComponents([])
    componentIndexRef.current = 0
    setSelectedComponent(0)
    hasStartedRef.current = true
    isActiveRef.current = true
    
    const validIndices = [0, 2, 3, 4] // Skip index 1 (Top Pages)
    
    const addComponent = () => {
      if (!isActiveRef.current) return
      
      const currentIndex = componentIndexRef.current
      
      // Select the component
      setSelectedComponent(currentIndex)
      
      // Start drag animation
      setDraggingComponent(currentIndex)
      setDragPosition({ x: 0, y: 0 })
      
      // Animate drag to dashboard (move from component grid to dashboard area - left to right)
      const timeout1 = setTimeout(() => {
        if (isActiveRef.current) {
          setDragPosition({ x: 120, y: 80 }) // Move towards dashboard (left to right) - constrained within card
        }
      }, 300)
      timeoutRefs.current.push(timeout1)
      
      // Add component to dashboard after drag completes
      const timeout2 = setTimeout(() => {
        if (!isActiveRef.current) return
        
        setDraggingComponent(null)
        setDragPosition(null)
        setDashboardComponents((prev) => {
          // Map indices: skip index 1 (Top Pages), so 0->0, 2->1, 3->2, 4->3
          const mappedIndex = currentIndex === 0 ? 0 : currentIndex === 2 ? 1 : currentIndex === 3 ? 2 : currentIndex === 4 ? 3 : -1
          if (mappedIndex !== -1 && !prev.includes(mappedIndex)) {
            const newComponents = [...prev, mappedIndex]
            
            // If all components are added, reset after a delay to loop
            if (newComponents.length >= validIndices.length) {
              const timeout3 = setTimeout(() => {
                if (isActiveRef.current) {
                  setDashboardComponents([])
                  componentIndexRef.current = 0
                  setSelectedComponent(0)
                  // Restart the animation loop
                  addComponent()
                }
              }, 2000) // Wait 2 seconds before resetting
              timeoutRefs.current.push(timeout3)
              return newComponents
            }
            
            return newComponents
          }
          return prev
        })
      }, 1200)
      timeoutRefs.current.push(timeout2)
      
      // Move to next component (cycle through: 0, 2, 3, 4 - skip index 1 which is Top Pages)
      const currentPos = validIndices.indexOf(currentIndex)
      const nextPos = (currentPos + 1) % validIndices.length
      componentIndexRef.current = validIndices[nextPos]
    }
    
    // Start immediately
    addComponent()
    
    // Then continue with interval
    intervalRef.current = setInterval(() => {
      if (!isActiveRef.current) return
      
      setDashboardComponents((prev) => {
        // If all components are added, don't add more (will be reset by timeout)
        if (prev.length >= validIndices.length) {
          return prev
        }
        return prev // Don't modify state here, addComponent will handle it
      })
      // Call addComponent outside of setState
      addComponent()
    }, 3500) // Change every 3.5 seconds
  }, [steps])

  useEffect(() => {
    return () => {
      isActiveRef.current = false
      chatStartedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (chatIntervalRef.current) {
        if (Array.isArray(chatIntervalRef.current)) {
          chatIntervalRef.current.forEach(clearTimeout)
        } else {
          clearTimeout(chatIntervalRef.current)
        }
        chatIntervalRef.current = null
      }
      timeoutRefs.current.forEach(clearTimeout)
      timeoutRefs.current = []
      hasStartedRef.current = false
    }
  }, [])

  return (
    <section id="how-it-works" className="relative py-16 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Background decorative elements - optimized with will-change */}
      <div className="absolute inset-0 opacity-20" style={{ willChange: 'opacity' }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ willChange: 'opacity', transform: 'translateZ(0)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', willChange: 'opacity', transform: 'translateZ(0)' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', willChange: 'opacity', transform: 'translateZ(0)' }} />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Infographic Flow */}
        <div className="space-y-8">
          {/* Step 1: Connect */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="flex flex-col lg:flex-row items-center gap-4 md:gap-6 lg:gap-8">
              {/* Dashboard Preview - Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                className="w-full sm:w-11/12 md:w-10/12 lg:flex-1 lg:max-w-sm"
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition duration-1000" />
                  <div className="relative bg-gradient-to-br from-gray-900/95 via-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/30 shadow-lg backdrop-blur-xl min-h-[400px]">
                    {/* Step 1 Badge */}
                    <div className="absolute -top-2.5 -left-2.5">
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-md"
                      >
                        <span className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {t.solutionPreview.step} 1
                        </span>
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3 mt-1">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg blur-sm opacity-50" />
                          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-sm">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {t.solutionPreview.step1.connectDataSource}
                          </h4>
                          <p className="text-xs text-gray-400 flex items-center gap-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            {t.solutionPreview.step1.selectConnector}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dropdown Selector */}
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {t.solutionPreview.step1.chooseDataSource}
                      </label>
                      <div className="relative">
                        <motion.select 
                          className="w-full p-3 bg-gray-900/60 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all appearance-none cursor-not-allowed pointer-events-none"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                          value={steps[0].dataSources?.[selectedConnector]?.name || ''}
                          onChange={() => {}} // Controlled by animation, prevent user changes
                          initial={{ borderColor: 'rgba(107, 114, 128, 0.5)' }}
                          animate={{ 
                            borderColor: steps[0].dataSources?.[selectedConnector]?.color ? `${steps[0].dataSources[selectedConnector].color}50` : 'rgba(107, 114, 128, 0.5)'
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {steps[0].dataSources?.map((source, idx) => {
                            return (
                              <option key={idx} value={source.name} className="bg-gray-900">
                                {source.name}
                              </option>
                            )
                          })}
                        </motion.select>
                        <motion.div 
                          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                          animate={{ rotate: [0, 180, 0] }}
                          transition={{ duration: 0.5, delay: 0.2, repeat: Infinity, repeatDelay: 2.5 }}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                      
                      {/* Selected connector preview */}
                      <AnimatePresence mode="wait">
                        {steps[0].dataSources && steps[0].dataSources[selectedConnector] && (() => {
                          const currentSource = steps[0].dataSources[selectedConnector]
                          const SourceIcon = currentSource.icon
                          return (
                            <motion.div
                              key={selectedConnector}
                              initial={{ opacity: 0, y: 10, scale: 0.95, borderColor: 'rgba(107, 114, 128, 0.3)' }}
                              animate={{ opacity: 1, y: 0, scale: 1, borderColor: `${currentSource.color}30` }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.3 }}
                              className="mt-2 p-2 rounded-lg border flex items-center gap-2"
                              style={{ 
                                backgroundColor: `${currentSource.color}15`
                              }}
                            >
                              <motion.div 
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${currentSource.color}20` }}
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, -5, 0]
                                }}
                                transition={{ 
                                  duration: 0.5,
                                  delay: 0.1
                                }}
                              >
                                <SourceIcon className="w-5 h-5" style={{ color: currentSource.color }} />
                              </motion.div>
                              <div className="flex-1">
                                <motion.p 
                                  className="text-sm font-semibold text-white" 
                                  style={{ fontFamily: "'Inter', sans-serif" }}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  {currentSource.name === 'GA4' ? 'Google Analytics 4' : 
                                   currentSource.name === 'Facebook' ? 'Facebook Ads' :
                                   currentSource.name === 'Instagram' ? 'Instagram Insights' :
                                   currentSource.name === 'Google Ads' ? 'Google Ads' :
                                   currentSource.name === 'Shopify' ? 'Shopify Store' :
                                   currentSource.name === 'Email' ? t.solutionPreview.step1.emailMarketing :
                                   currentSource.name}
                                </motion.p>
                                <motion.p 
                                  className="text-xs text-gray-400" 
                                  style={{ fontFamily: "'Inter', sans-serif" }}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  {t.solutionPreview.step1.readyToConnect}
                                </motion.p>
                              </div>
                              <motion.div 
                                className="w-2 h-2 bg-green-500 rounded-full"
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  opacity: [1, 0.7, 1]
                                }}
                                transition={{ 
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </motion.div>
                          )
                        })()}
                      </AnimatePresence>
                    </div>
                    
                  </div>
                </div>
              </motion.div>

              {/* Text Content - Right */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex-1 w-full sm:w-11/12 md:w-10/12 lg:max-w-md flex flex-col"
              >
                <h3 className="font-bold text-white mb-3" style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                  fontWeight: 700
                }}>
                  {t.solutionPreview.step1.dataSourceConnections}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t.solutionPreview.step1.dataSourceDescription}
                </p>
                
                <div>
                  <h3 className="font-bold text-white mb-1" style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                    fontWeight: 700
                  }}>
                    {t.solutionPreview.step1.realTimeUpdates}
                  </h3>
                  <p className="text-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t.solutionPreview.step1.realTimeDescription}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Step 2: Build */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative optimize-animations"
            onViewportEnter={() => {
              // Reset and start animation when section comes into view
              hasStartedRef.current = false
              if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
              }
              // Use setTimeout to ensure state is reset before starting
              setTimeout(() => {
                startAnimation()
              }, 100)
            }}
          >
            <div className="flex flex-col lg:flex-row justify-end items-center gap-4 md:gap-6 lg:gap-8">
              {/* Text Content - Left */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex-1 w-full sm:w-11/12 md:w-10/12 lg:max-w-md flex flex-col order-2 lg:order-1"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-white mb-1" style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                      fontWeight: 700
                    }}>
                      {t.solutionPreview.step2.preBuiltComponents}
                    </h3>
                    <p className="text-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {t.solutionPreview.step2.preBuiltDescription}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-1" style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                      fontWeight: 700
                    }}>
                      {t.solutionPreview.step2.dragDropBuilder}
                    </h3>
                    <p className="text-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {t.solutionPreview.step2.dragDropDescription}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-1" style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                      fontWeight: 700
                    }}>
                      {t.solutionPreview.step2.smartTemplates}
                    </h3>
                    <p className="text-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {t.solutionPreview.step2.smartTemplatesDescription}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Building Dashboard Card - Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                className="w-full sm:w-11/12 md:w-10/12 lg:w-5/12 order-1 lg:order-2"
              >
                <div className="relative group overflow-visible">
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition duration-1000" />
                  
                  <div className="relative bg-gradient-to-br from-gray-900/95 via-purple-900/20 to-pink-900/20 rounded-xl p-5 sm:p-6 border border-purple-500/30 shadow-lg backdrop-blur-xl overflow-visible min-h-[500px]">
                    {/* Step 2 Badge */}
                    <div className="absolute -top-2.5 -left-2.5 z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-md"
                      >
                        <span className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {t.solutionPreview.step} 2
                        </span>
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3 mt-1">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg blur-sm opacity-50" />
                          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                            <Layout className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {t.solutionPreview.step2.buildDashboard}
                          </h4>
                          <p className="text-xs text-gray-400 flex items-center gap-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                            {t.solutionPreview.step2.dragDropComponents}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Two Column Layout: Components Grid + Dashboard */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3 relative overflow-hidden">
                      {/* Left: Components Grid */}
                      <div className="relative">
                        <h5 className="text-sm text-gray-400 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {t.solutionPreview.step2.availableComponents}
                        </h5>
                        <div className="grid grid-cols-3 gap-1 sm:gap-1 relative mb-2">
                        {steps[1].components?.map((component, idx) => {
                          const ComponentIcon = component.icon
                          const isSelected = selectedComponent === idx
                          const isDragging = draggingComponent === idx
                          
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8, y: 20, borderColor: 'rgba(55, 65, 81, 0.5)' }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 + idx * 0.1, type: 'spring', stiffness: 200 }}
                              animate={{
                                scale: isSelected && !isDragging ? 1.15 : isDragging ? 1.2 : 1,
                                y: isSelected && !isDragging ? -5 : isDragging ? -10 : 0,
                                borderColor: isSelected && !isDragging ? `${component.color}80` : 'rgba(55, 65, 81, 0.5)',
                                opacity: isDragging ? 0.3 : 1,
                                zIndex: isDragging ? 50 : 1,
                              }}
                              whileHover={{ scale: 1.1, y: -3, rotate: -5 }}
                              className="group relative p-4 bg-gray-900/60 rounded-lg border transition-all backdrop-blur-sm cursor-pointer"
                              style={{ backgroundColor: `${component.color}15` }}
                              title={component.name}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                              <ComponentIcon className="w-5 h-5 relative z-10" style={{ color: component.color }} />
                              {isSelected && !isDragging && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"
                                />
                              )}
                              {isDragging && (
                                <motion.div
                                  initial={{ scale: 0, rotate: 0 }}
                                  animate={{ scale: 1, rotate: 15 }}
                                  className="absolute -top-1 -right-1"
                                >
                                  <Move className="w-4 h-4 text-purple-400" />
                                </motion.div>
                              )}
                            </motion.div>
                          )
                        })}
                        
                        {/* Dragging Component Overlay */}
                        {draggingComponent !== null && dragPosition && steps[1].components?.[draggingComponent] && (() => {
                          const draggedComponent = steps[1].components![draggingComponent]
                          const DraggedIcon = draggedComponent.icon
                          return (
                            <motion.div
                              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                              animate={{
                                x: dragPosition.x,
                                y: dragPosition.y,
                                scale: 1.2,
                                opacity: 0.9,
                              }}
                              transition={{ duration: 0.9, ease: 'easeInOut' }}
                              className="absolute pointer-events-none z-50"
                              style={{
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <div className="relative p-4 bg-gradient-to-br from-purple-500/90 to-pink-500/90 rounded-xl border-2 border-purple-400 shadow-2xl backdrop-blur-md">
                                <DraggedIcon className="w-6 h-6 text-white" style={{ color: draggedComponent.color }} />
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-50 animate-pulse" />
                              </div>
                            </motion.div>
                          )
                        })()}
                      </div>
                      
                        {/* Prebuilt Reports Section */}
                        <div className="mt-3">
                          <h6 className="text-xs text-gray-500 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {t.solutionPreview.step2.prebuiltReports}
                          </h6>
                          <div className="space-y-1">
                            {[
                              { name: t.solutionPreview.step2.ecommerce, icon: ShoppingCart },
                              { name: t.solutionPreview.step2.marketing, icon: TrendingUp },
                              { name: t.solutionPreview.step2.engagement, icon: Users },
                            ].map((report, idx) => {
                              const ReportIcon = report.icon
                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: 0.3 + idx * 0.1 }}
                                  className="flex items-center gap-2 p-2 bg-gray-900/40 rounded border border-gray-800/50 hover:border-purple-500/50 transition-colors cursor-pointer group"
                                >
                                  <ReportIcon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors flex-shrink-0" />
                                  <span className="text-xs text-gray-300 group-hover:text-white transition-colors truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {report.name}
                                  </span>
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                    {/* Right: Building Dashboard */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {t.solutionPreview.step2.buildingDashboard}
                        </h4>
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>

                    {/* Dashboard Grid - Components Appearing */}
                    <div className="space-y-3 min-h-[300px]">
                      {/* Sessions Over Time Chart */}
                      <AnimatePresence>
                        {dashboardComponents.includes(0) && (
                          <motion.div
                            key="sessions"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, type: 'spring' }}
                            className="bg-white/5 rounded-lg border border-white/10 p-3 backdrop-blur-sm"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-blue-400" />
                              <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {t.solutionPreview.step2.sessionsOverTime}
                              </span>
                            </div>
                            <div className="h-16 flex items-end justify-between gap-1">
                              {[45, 60, 55, 75, 65, 85, 70, 60, 80, 90].map((height, i) => (
                                <motion.div
                                  key={i}
                                  className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t min-w-[4px]"
                                  initial={{ height: 0 }}
                                  animate={{ height: `${height}%` }}
                                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Conversion Rate KPI */}
                      <AnimatePresence>
                        {dashboardComponents.includes(1) && (
                          <motion.div
                            key="conversion"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, type: 'spring', delay: 0.2 }}
                            className="bg-white/5 rounded border border-white/10 p-2 backdrop-blur-sm"
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <ShoppingCart className="w-4 h-4 text-green-400" />
                              <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {t.solutionPreview.step2.conversionRate}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                              <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring' }}
                                className="text-base font-bold text-white"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                3.42%
                              </motion.span>
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xs text-green-400 font-semibold"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                +5.1%
                              </motion.span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Pie Chart */}
                      <AnimatePresence>
                        {dashboardComponents.includes(2) && (
                          <motion.div
                            key="pie"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, type: 'spring', delay: 0.1 }}
                            className="bg-white/5 rounded border border-white/10 p-2 backdrop-blur-sm"
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <PieChart className="w-4 h-4 text-pink-400" />
                              <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {t.solutionPreview.step2.trafficSources}
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 h-12">
                              {[
                                { color: '#3b82f6', percent: 40, label: 'Organic' },
                                { color: '#8b5cf6', percent: 30, label: 'Direct' },
                                { color: '#ec4899', percent: 20, label: 'Social' },
                                { color: '#22c55e', percent: 10, label: 'Email' },
                              ].map((segment, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                                  className="flex flex-col items-center gap-1"
                                >
                                  <div
                                    className="w-6 h-6 rounded-full border-2 border-gray-800"
                                    style={{
                                      background: `conic-gradient(${segment.color} 0% ${segment.percent}%, transparent ${segment.percent}% 100%)`,
                                    }}
                                  />
                                  <span className="text-[9px] text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {segment.percent}%
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Tabular Data */}
                      <AnimatePresence>
                        {dashboardComponents.includes(3) && (
                          <motion.div
                            key="table"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, type: 'spring', delay: 0.2 }}
                            className="bg-white/5 rounded border border-white/10 p-2 backdrop-blur-sm"
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Table className="w-4 h-4 text-green-400" />
                              <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {t.solutionPreview.step2.campaignPerformance}
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {[
                                { campaign: t.solutionPreview.step2.summerSale, clicks: '12.5K', conversions: '1.2K', revenue: '$45K' },
                                { campaign: t.solutionPreview.step2.productLaunch, clicks: '8.3K', conversions: '890', revenue: '$32K' },
                                { campaign: t.solutionPreview.step2.newsletter, clicks: '5.1K', conversions: '420', revenue: '$18K' },
                              ].map((row, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + i * 0.1 }}
                                  className="grid grid-cols-4 gap-2 text-xs border-b border-white/5 pb-1.5 last:border-0"
                                >
                                  <span className="text-gray-300 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {row.campaign}
                                  </span>
                                  <span className="text-white font-semibold text-right" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {row.clicks}
                                  </span>
                                  <span className="text-white font-semibold text-right" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {row.conversions}
                                  </span>
                                  <span className="text-green-400 font-semibold text-right" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {row.revenue}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                        {/* Add Component Indicator */}
                        {dashboardComponents.length < 5 && (
                          <motion.div
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="bg-white/5 rounded border border-dashed border-white/20 p-2 backdrop-blur-sm flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {draggingComponent !== null ? t.solutionPreview.step2.dropping : t.solutionPreview.step2.adding}
                            </span>
                          </motion.div>
                        )}
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Step 3: Understand */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative optimize-animations"
            onViewportEnter={() => {
              // Start chat animation when section comes into view
              if (!chatStartedRef.current) {
                chatStartedRef.current = true
                setChatMessages(0)
                // Start showing messages one by one
                const messages = [
                  { delay: 500, type: 'user' },
                  { delay: 2500, type: 'ai' },
                  { delay: 5000, type: 'user' },
                  { delay: 7000, type: 'ai' },
                  { delay: 10000, type: 'user' },
                  { delay: 12500, type: 'ai' },
                ]
                const timeouts: NodeJS.Timeout[] = []
                messages.forEach((msg, idx) => {
                  const timeout = setTimeout(() => {
                    setChatMessages(idx + 1)
                  }, msg.delay)
                  timeouts.push(timeout)
                })
                // Loop animation
                const loopTimeout = setTimeout(() => {
                  setChatMessages(0)
                  chatStartedRef.current = false
                }, 15000)
                timeouts.push(loopTimeout)
                
                // Store timeouts for cleanup
                chatIntervalRef.current = timeouts as any
              }
            }}
          >
            <div className="flex flex-col lg:flex-row justify-start items-center gap-4 md:gap-6 lg:gap-8">
              {/* Step 3 Card - Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                className="w-full sm:w-11/12 md:w-10/12 lg:w-5/12"
              >
                <div className="relative group">
                  {/* Step 3 Badge - Outside the card to avoid clipping */}
                  <div className="absolute -top-2.5 -left-2.5 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-md"
                    >
                      <span className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {t.solutionPreview.step} 3
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition duration-1000" />
                  
                  <div className="relative bg-gradient-to-br from-gray-900/95 via-yellow-900/20 to-orange-900/20 rounded-xl p-5 sm:p-6 border border-yellow-500/30 shadow-lg backdrop-blur-xl overflow-hidden min-h-[500px]">
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg blur-sm opacity-50" />
                          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm">
                            <Lightbulb className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {t.solutionPreview.step3.understandInsights}
                          </h4>
                          <p className="text-xs text-gray-400 flex items-center gap-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                            {t.solutionPreview.step3.askAI}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="space-y-3 h-72 overflow-y-auto hide-scrollbar">
                      {/* User Message 1 */}
                      <AnimatePresence>
                        {chatMessages >= 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2 justify-end"
                          >
                            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 max-w-[80%]">
                              <p className="text-sm text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {t.solutionPreview.step3.chatMessages.user1}
                              </p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-blue-400" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* AI Response 1 */}
                      <AnimatePresence>
                        {chatMessages >= 2 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-800/60 border border-yellow-500/30 rounded-lg p-3 max-w-[80%]">
                              <p className="text-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {t.solutionPreview.step3.chatMessages.ai1}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* User Message 2 */}
                      <AnimatePresence>
                        {chatMessages >= 3 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2 justify-end"
                          >
                            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 max-w-[80%]">
                              <p className="text-sm text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {t.solutionPreview.step3.chatMessages.user2}
                              </p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-blue-400" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* AI Response 2 */}
                      <AnimatePresence>
                        {chatMessages >= 4 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-800/60 border border-yellow-500/30 rounded-lg p-3 max-w-[80%]">
                              <p className="text-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {t.solutionPreview.step3.chatMessages.ai2}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* User Message 3 */}
                      <AnimatePresence>
                        {chatMessages >= 5 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2 justify-end"
                          >
                            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 max-w-[80%]">
                              <p className="text-sm text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {t.solutionPreview.step3.chatMessages.user3}
                              </p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-blue-400" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* AI Response 3 */}
                      <AnimatePresence>
                        {chatMessages >= 6 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-800/60 border border-yellow-500/30 rounded-lg p-3 max-w-[80%]">
                              <p className="text-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {t.solutionPreview.step3.chatMessages.ai3}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Typing indicator */}
                      {chatMessages > 0 && chatMessages < 6 && chatMessages % 2 === 1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-start gap-2"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-800/60 border border-yellow-500/30 rounded-lg p-3">
                            <div className="flex gap-1">
                              <motion.div
                                className="w-1.5 h-1.5 bg-yellow-400 rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                              />
                              <motion.div
                                className="w-1.5 h-1.5 bg-yellow-400 rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.div
                                className="w-1.5 h-1.5 bg-yellow-400 rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Text Content - Right */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex-1 w-full sm:w-11/12 md:w-10/12 lg:max-w-md flex flex-col"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-white mb-1" style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                      fontWeight: 700
                    }}>
                      {t.solutionPreview.step3.noCodeRequired}
                    </h3>
                    <p className="text-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {t.solutionPreview.step3.noCodeDescription}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-1" style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                      fontWeight: 700
                    }}>
                      {t.solutionPreview.step3.aiPoweredInsights}
                    </h3>
                    <p className="text-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {t.solutionPreview.step3.aiPoweredDescription}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

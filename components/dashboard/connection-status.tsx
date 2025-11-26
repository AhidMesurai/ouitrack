'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle, BarChart3, TrendingUp, Database, Zap, Mail, Instagram, Link2 } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface GA4Connection {
  id: string
  property_id: string
  property_name: string
  is_active: boolean
  last_synced_at: string | null
}

export function ConnectionStatus() {
  const [connections, setConnections] = useState<GA4Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConnector, setSelectedConnector] = useState(0)
  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    // During SSR, use default theme
    theme = 'dark'
  }

  const dataSources = [
    { icon: BarChart3, name: 'GA4', color: '#3b82f6', enabled: true },
    { icon: TrendingUp, name: 'Facebook', color: '#2563eb', enabled: false },
    { icon: Instagram, name: 'Instagram', color: '#e1306c', enabled: false },
    { icon: Database, name: 'Google Ads', color: '#ef4444', enabled: false },
    { icon: Zap, name: 'Shopify', color: '#22c55e', enabled: false },
    { icon: Mail, name: 'Email', color: '#eab308', enabled: false },
  ]

  // Auto-cycle through connectors for animation (only GA4 enabled)
  useEffect(() => {
    if (loading) return
    const interval = setInterval(() => {
      setSelectedConnector((prev) => (prev + 1) % dataSources.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [loading])

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch('/api/ga4/properties')
        if (response.ok) {
          const data = await response.json()
          // Handle both old format (array) and new format ({ properties: [...] })
          if (Array.isArray(data)) {
            setConnections(data)
          } else if (data.properties && Array.isArray(data.properties)) {
            // Convert properties format to connections format
            const formattedConnections = data.properties.map((prop: any) => ({
              id: prop.id,
              property_id: prop.id,
              property_name: prop.name,
              is_active: true,
              last_synced_at: prop.connectedAt || null,
            }))
            setConnections(formattedConnections)
          } else {
            setConnections([])
          }
        }
      } catch (error) {
        console.error('Error fetching connections:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className={cn(
          "relative group overflow-hidden",
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 border-gray-800/50 backdrop-blur-xl shadow-2xl' 
            : 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg'
        )}>
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10' 
              : 'bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50'
          )} />
          <CardHeader className="relative z-10">
            <CardTitle className={cn(theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              GA4 Connections
            </CardTitle>
            <CardDescription className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              Loading...
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    )
  }

  if (connections.length === 0) {
    const currentSource = dataSources[selectedConnector]
    const SourceIcon = currentSource.icon

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full"
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition duration-1000" />
          <div className={cn(
            "relative rounded-xl p-6 border shadow-lg backdrop-blur-xl min-h-[400px]",
            theme === 'dark'
              ? 'bg-gradient-to-br from-gray-900/95 via-purple-900/20 to-blue-900/20 border-purple-500/30'
              : 'bg-white border-gray-200'
          )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className={cn(
                    "absolute inset-0 rounded-lg blur-sm opacity-50",
                    theme === 'dark' ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gradient-to-br from-blue-400 to-purple-400'
                  )} />
                  <div className={cn(
                    "relative w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
                    theme === 'dark' ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'
                  )}>
                    <Link2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className={cn(
                    "text-base font-bold",
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )} style={{ fontFamily: "'Inter', sans-serif" }}>
                    Connect Data Source
                  </h4>
                  <p className={cn(
                    "text-xs flex items-center gap-1",
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )} style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full animate-pulse",
                      theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                    )} />
                    Select a connector
                  </p>
                </div>
              </div>
            </div>
            
            {/* Dropdown Selector */}
            <div className="mb-4">
              <label className={cn(
                "text-sm mb-2 block",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                Choose Data Source
              </label>
              <div className="relative">
                <motion.select 
                  className={cn(
                    "w-full p-3 rounded-lg text-sm focus:outline-none focus:ring-1 transition-all appearance-none",
                    theme === 'dark'
                      ? 'bg-gray-900/60 border border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                  )}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  value={currentSource.name}
                  onChange={(e) => {
                    const index = dataSources.findIndex(ds => ds.name === e.target.value)
                    if (index !== -1 && dataSources[index].enabled) {
                      setSelectedConnector(index)
                    }
                  }}
                  initial={{ borderColor: 'rgba(107, 114, 128, 0.5)' }}
                  animate={{ 
                    borderColor: currentSource.color ? `${currentSource.color}50` : 'rgba(107, 114, 128, 0.5)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {dataSources.map((source, idx) => (
                    <option 
                      key={idx} 
                      value={source.name} 
                      disabled={!source.enabled}
                      className={cn(
                        source.enabled ? '' : 'opacity-50 cursor-not-allowed',
                        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                      )}
                    >
                      {source.name} {!source.enabled && '(Coming Soon)'}
                    </option>
                  ))}
                </motion.select>
                <motion.div 
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                  animate={{ rotate: [0, 180, 0] }}
                  transition={{ duration: 0.5, delay: 0.2, repeat: Infinity, repeatDelay: 2.5 }}
                >
                  <svg className={cn("w-4 h-4", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
              
              {/* Selected connector preview */}
              <AnimatePresence mode="wait">
                {currentSource && (
                  <motion.div
                    key={selectedConnector}
                    initial={{ opacity: 0, y: 10, scale: 0.95, borderColor: 'rgba(107, 114, 128, 0.3)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, borderColor: `${currentSource.color}30` }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "mt-2 p-3 rounded-lg border flex items-center gap-2",
                      theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'
                    )}
                    style={{ 
                      backgroundColor: theme === 'dark' ? `${currentSource.color}15` : `${currentSource.color}08`
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
                        className={cn(
                          "text-sm font-semibold",
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )} 
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
                         currentSource.name === 'Email' ? 'Email Marketing' :
                         currentSource.name}
                      </motion.p>
                      <motion.p 
                        className={cn(
                          "text-xs",
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        )} 
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {currentSource.enabled ? 'Ready to connect' : 'Coming soon'}
                      </motion.p>
                    </div>
                    {currentSource.enabled ? (
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
                    ) : (
                      <motion.div 
                        className="w-2 h-2 bg-gray-500 rounded-full"
                        animate={{ 
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Connect Button */}
            <div className="mt-6">
              <Link href="/dashboard/connect-ga4">
                <Button 
                  className={cn(
                    "w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300",
                    !currentSource.enabled && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={!currentSource.enabled}
                >
                  {currentSource.enabled ? 'Connect ' + currentSource.name : currentSource.name + ' (Coming Soon)'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn(
        "relative group overflow-hidden",
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 border-gray-800/50 backdrop-blur-xl shadow-2xl' 
          : 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg'
      )}>
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10' 
            : 'bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50'
        )} />
        <CardHeader className="relative z-10">
          <CardTitle className={cn(theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            GA4 Connections
          </CardTitle>
          <CardDescription className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            Your connected Google Analytics properties
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            {connections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg transition-all duration-300 cursor-pointer",
                  theme === 'dark'
                    ? 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                )}
              >
              <div className="flex items-center space-x-3">
                {connection.is_active ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className={cn(
                    "font-medium",
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {connection.property_name}
                  </p>
                  <p className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {connection.property_id}
                  </p>
                  {connection.last_synced_at && (
                    <p className={cn(
                      "text-xs",
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      Last synced: {new Date(connection.last_synced_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                    : ''
                )}
              >
                Manage
              </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


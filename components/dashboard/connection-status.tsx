'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle, BarChart3, TrendingUp, Database, Zap, Mail, Instagram, Link2, Trash2, Power, PowerOff, Loader2 } from 'lucide-react'
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
  google_account_email?: string | null
}

export function ConnectionStatus() {
  const [connections, setConnections] = useState<GA4Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConnector, setSelectedConnector] = useState(0) // Default to GA4 (index 0)
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

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/ga4/properties')
      if (response.ok) {
        const data = await response.json()
        // Use full connections data if available, otherwise fall back to properties
        if (data.connections && Array.isArray(data.connections)) {
          setConnections(data.connections)
        } else if (Array.isArray(data)) {
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

  useEffect(() => {
    fetchConnections()
  }, [])

  const handleDelete = async (connectionId: string) => {
    if (!confirm('Are you sure you want to delete this connection? This action cannot be undone.')) {
      return
    }

    setDeletingId(connectionId)
    try {
      const response = await fetch(`/api/ga4/connections/${connectionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh connections
        await fetchConnections()
      } else {
        const error = await response.json()
        alert(`Failed to delete connection: ${error.error}`)
      }
    } catch (error: any) {
      console.error('Error deleting connection:', error)
      alert(`Failed to delete connection: ${error.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (connectionId: string, currentStatus: boolean) => {
    setTogglingId(connectionId)
    try {
      const response = await fetch(`/api/ga4/connections/${connectionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (response.ok) {
        // Refresh connections
        await fetchConnections()
      } else {
        const error = await response.json()
        alert(`Failed to update connection: ${error.error}`)
      }
    } catch (error: any) {
      console.error('Error updating connection:', error)
      alert(`Failed to update connection: ${error.message}`)
    } finally {
      setTogglingId(null)
    }
  }

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
                <select 
                  className={cn(
                    "w-full p-3 rounded-lg text-sm focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer",
                    theme === 'dark'
                      ? 'bg-gray-900/60 border border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20 hover:border-blue-500/30'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 hover:border-blue-400'
                  )}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  value={currentSource.name}
                  onChange={(e) => {
                    const index = dataSources.findIndex(ds => ds.name === e.target.value)
                    if (index !== -1) {
                      setSelectedConnector(index)
                    }
                  }}
                >
                  {dataSources.map((source, idx) => (
                    <option 
                      key={idx} 
                      value={source.name} 
                      disabled={!source.enabled}
                      className={cn(
                        source.enabled ? '' : 'opacity-50',
                        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                      )}
                    >
                      {source.name} {!source.enabled && '(Coming Soon)'}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className={cn("w-4 h-4", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Selected connector preview */}
              <AnimatePresence mode="wait">
                {currentSource && (
                  <motion.div
                    key={selectedConnector}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "mt-2 p-3 rounded-lg border flex items-center gap-2",
                      theme === 'dark' ? 'bg-gray-800/30 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                    )}
                    style={{ 
                      backgroundColor: theme === 'dark' ? `${currentSource.color}15` : `${currentSource.color}08`,
                      borderColor: `${currentSource.color}30`
                    }}
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${currentSource.color}20` }}
                    >
                      <SourceIcon className="w-5 h-5" style={{ color: currentSource.color }} />
                    </div>
                    <div className="flex-1">
                      <p 
                        className={cn(
                          "text-sm font-semibold",
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )} 
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {currentSource.name === 'GA4' ? 'Google Analytics 4' : 
                         currentSource.name === 'Facebook' ? 'Facebook Ads' :
                         currentSource.name === 'Instagram' ? 'Instagram Insights' :
                         currentSource.name === 'Google Ads' ? 'Google Ads' :
                         currentSource.name === 'Shopify' ? 'Shopify Store' :
                         currentSource.name === 'Email' ? 'Email Marketing' :
                         currentSource.name}
                      </p>
                      <p 
                        className={cn(
                          "text-xs",
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        )} 
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {currentSource.enabled ? 'Ready to connect' : 'Coming soon'}
                      </p>
                    </div>
                    {currentSource.enabled ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-500 rounded-full opacity-50" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Connect Button */}
            <div className="mt-6">
              {currentSource.enabled && currentSource.name === 'GA4' ? (
                <Link href="/dashboard/connect-ga4" className="block">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Connect Google Analytics 4
                  </Button>
                </Link>
              ) : (
                <Button 
                  className="w-full bg-gray-500/50 text-gray-400 cursor-not-allowed shadow-lg"
                  disabled
                >
                  {currentSource.name} (Coming Soon)
                </Button>
              )}
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
      transition={{ duration: 0.6, type: 'spring' }}
      className="w-full"
    >
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition duration-1000" />
        <div className={cn(
          "relative rounded-xl p-6 border shadow-lg backdrop-blur-xl",
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
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h4 className={cn(
                  "text-base font-bold",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )} style={{ fontFamily: "'Inter', sans-serif" }}>
                  GA4 Connections
                </h4>
                <p className={cn(
                  "text-xs flex items-center gap-1",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )} style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    theme === 'dark' ? 'bg-green-500' : 'bg-green-600'
                  )} />
                  Your connected Google Analytics properties
                </p>
              </div>
            </div>
          </div>

          {/* Connect New Button */}
          <div className="mb-4">
            <Link href="/dashboard/connect-ga4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Connect New GA4 Account
              </Button>
            </Link>
          </div>

          {/* Connected Properties List - Grouped by Google Account */}
          <div className="space-y-4">
            {(() => {
              // Group connections by Google account email
              const grouped = connections.reduce((acc, conn) => {
                const email = conn.google_account_email || 'Unknown Account'
                if (!acc[email]) {
                  acc[email] = []
                }
                acc[email].push(conn)
                return acc
              }, {} as Record<string, typeof connections>)

              return Object.entries(grouped).map(([email, conns], groupIndex) => (
                <div key={email} className="space-y-2">
                  {Object.keys(grouped).length > 1 && (
                    <p className={cn(
                      "text-xs font-medium mb-2",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {email}
                    </p>
                  )}
                  {conns.map((connection, index) => (
                    <motion.div
                      key={connection.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (groupIndex * 0.1) + (index * 0.05) }}
                      whileHover={{ scale: 1.01, y: -1 }}
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-300",
                        theme === 'dark'
                          ? connection.is_active
                            ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 hover:border-blue-500/30'
                            : 'bg-gray-800/20 border-gray-700/30 opacity-60'
                          : connection.is_active
                            ? 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-blue-300'
                            : 'bg-gray-50/50 border-gray-200 opacity-60'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={cn(
                            "p-2 rounded-lg",
                            theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                          )}>
                            <BarChart3 className={cn(
                              "w-5 h-5",
                              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={cn(
                                "font-semibold text-sm truncate",
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                                {connection.property_name}
                              </p>
                              {connection.is_active ? (
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                              )}
                            </div>
                            <p className={cn(
                              "text-xs mb-1",
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            )} style={{ fontFamily: "'Inter', sans-serif" }}>
                              {connection.property_id}
                            </p>
                            {connection.last_synced_at && (
                              <p className={cn(
                                "text-xs",
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                                Last synced: {new Date(connection.last_synced_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(connection.id, connection.is_active)}
                            disabled={togglingId === connection.id}
                            className={cn(
                              "h-8 w-8 p-0",
                              theme === 'dark'
                                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            )}
                            title={connection.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {togglingId === connection.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : connection.is_active ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(connection.id)}
                            disabled={deletingId === connection.id}
                            className={cn(
                              "h-8 w-8 p-0 text-red-500 hover:text-red-600",
                              theme === 'dark' ? 'hover:bg-red-500/20' : 'hover:bg-red-50'
                            )}
                            title="Delete"
                          >
                            {deletingId === connection.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}


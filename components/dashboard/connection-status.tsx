'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    // During SSR, use default theme
    theme = 'dark'
  }

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
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
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
              Connect your Google Analytics account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Link href="/dashboard/connect-ga4">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300">
                Connect GA4 Account
              </Button>
            </Link>
          </CardContent>
        </Card>
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


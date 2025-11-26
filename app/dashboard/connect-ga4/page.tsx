'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, BarChart3 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function ConnectGA4Page() {
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [properties, setProperties] = useState<Array<{ id: string; name: string }>>([])
  const router = useRouter()
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
    // Check if user already has a GA4 connection
    checkConnection()
    
    // Check for success/error in URL params
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      setConnected(true)
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/connect-ga4')
      checkConnection() // Refresh the list
    }
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/ga4/properties')
      if (response.ok) {
        const data = await response.json()
        if (data.properties && data.properties.length > 0) {
          setConnected(true)
          setProperties(data.properties)
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error)
    }
  }

  const handleConnect = () => {
    setLoading(true)
    
    // Build OAuth URL
    const clientId = process.env.NEXT_PUBLIC_GA4_CLIENT_ID
    // Use NEXTAUTH_URL if available (production), otherwise use current origin
    const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || window.location.origin
    const redirectUri = process.env.NEXT_PUBLIC_GA4_REDIRECT_URI || `${baseUrl}/api/ga4/callback`
    const scopes = [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/analytics.manage.users.readonly', // For Admin API
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ')
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `access_type=offline&` +
      `prompt=consent`

    // Redirect to Google OAuth
    window.location.href = authUrl
  }

  if (connected) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "p-2 rounded-lg",
                  theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
                )}>
                  <CheckCircle2 className={cn(
                    "w-6 h-6",
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  )} />
                </div>
                <h1 className={cn(
                  "text-3xl font-bold",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )} style={{ fontFamily: "'Inter', sans-serif" }}>
                  GA4 Connected
                </h1>
              </div>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                Your Google Analytics account is connected
              </p>
            </div>
            
            {/* Success Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative group overflow-hidden">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition duration-1000" />
                <div className={cn(
                  "relative rounded-xl p-6 border shadow-lg backdrop-blur-xl",
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-900/95 via-green-900/20 to-blue-900/20 border-green-500/30'
                    : 'bg-white border-gray-200'
                )}>
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle2 className={cn(
                      "w-6 h-6 mt-0.5",
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    )} />
                    <div>
                      <p className={cn(
                        "font-semibold mb-1",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )} style={{ fontFamily: "'Inter', sans-serif" }}>
                        Successfully Connected!
                      </p>
                      <p className={cn(
                        "text-sm",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {properties.length > 0 
                          ? `You have ${properties.length} GA4 ${properties.length === 1 ? 'property' : 'properties'} connected.`
                          : 'You can now generate reports with your GA4 data.'
                        }
                      </p>
                    </div>
                  </div>

                  {properties.length > 0 && (
                    <div className={cn(
                      "rounded-lg p-4 mb-4",
                      theme === 'dark' ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-50 border border-gray-200'
                    )}>
                      <h3 className={cn(
                        "font-medium mb-3 text-sm",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        Connected Properties:
                      </h3>
                      <ul className="space-y-2">
                        {properties.map((prop) => (
                          <li key={prop.id} className={cn(
                            "flex items-center text-sm",
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          )}>
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            {prop.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={cn(
                    "rounded-lg p-4 mb-4",
                    theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                  )}>
                    <p className={cn(
                      "text-sm mb-3",
                      theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                    )}>
                      <strong>Want to add more properties?</strong> Reconnect to refresh your property list and add any new properties you have access to.
                    </p>
                    <Button 
                      onClick={handleConnect}
                      disabled={loading || !process.env.NEXT_PUBLIC_GA4_CLIENT_ID}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      {loading ? 'Reconnecting...' : 'Reconnect & Refresh Properties'}
                    </Button>
                  </div>

                  <div className="pt-4 space-y-2 border-t border-gray-700/50">
                    <Button 
                      onClick={() => router.push('/dashboard/reports')}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      View Reports
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/dashboard')}
                      className={cn(
                        "w-full",
                        theme === 'dark'
                          ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                          : ''
                      )}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl space-y-6">
          {/* Header */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "p-2 rounded-lg",
                theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
              )}>
                <BarChart3 className={cn(
                  "w-6 h-6",
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                )} />
              </div>
              <h1 className={cn(
                "text-3xl font-bold",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                Connect Google Analytics
              </h1>
            </div>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Connect your Google Analytics 4 account to start generating reports
            </p>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative group overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition duration-1000" />
              <div className={cn(
                "relative rounded-xl p-6 border shadow-lg backdrop-blur-xl",
                theme === 'dark'
                  ? 'bg-gradient-to-br from-gray-900/95 via-purple-900/20 to-blue-900/20 border-purple-500/30'
                  : 'bg-white border-gray-200'
              )}>
                <div className={cn(
                  "rounded-lg p-4 mb-4 flex items-start gap-3",
                  theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                )}>
                  <AlertCircle className={cn(
                    "w-5 h-5 mt-0.5",
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  )} />
                  <div className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                  )}>
                    <p className="font-medium mb-1">What you&apos;ll need:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Access to a Google Analytics 4 property</li>
                      <li>Viewer or Editor permissions on the property</li>
                    </ul>
                  </div>
                </div>

                {!process.env.NEXT_PUBLIC_GA4_CLIENT_ID && (
                  <div className={cn(
                    "rounded-lg p-4 mb-4",
                    theme === 'dark' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'
                  )}>
                    <p className={cn(
                      "text-sm",
                      theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
                    )}>
                      <strong>Configuration Required:</strong> Please add GA4 OAuth credentials to your environment variables.
                      See <code className={cn(
                        "px-1 rounded",
                        theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100'
                      )}>docs/ga4-connection-setup.md</code> for instructions.
                    </p>
                  </div>
                )}

                {/* Error messages */}
                {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('error') && (
                  <div className={cn(
                    "rounded-lg p-4 mb-4",
                    theme === 'dark' ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'
                  )}>
                    <p className={cn(
                      "text-sm font-medium mb-2",
                      theme === 'dark' ? 'text-red-300' : 'text-red-800'
                    )}>
                      Connection Error
                    </p>
                    <p className={cn(
                      "text-sm",
                      theme === 'dark' ? 'text-red-400' : 'text-red-700'
                    )}>
                      {(() => {
                        const error = new URLSearchParams(window.location.search).get('error')
                        if (error === 'fetch_properties_failed') {
                          return 'Failed to fetch your GA4 properties. Please make sure you have access to at least one GA4 property and that the Analytics Admin API is enabled.'
                        } else if (error === 'fetch_properties_failed_permission') {
                          return 'Permission denied. Please make sure you have the necessary permissions to access Google Analytics Admin API.'
                        } else if (error === 'fetch_properties_failed_auth') {
                          return 'Authentication failed. Please try connecting again.'
                        } else if (error === 'no_properties_found') {
                          return 'No GA4 properties found. Please make sure you have at least one GA4 property in your Google Analytics account.'
                        } else {
                          return `Error: ${error}. Please try again or contact support.`
                        }
                      })()}
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleConnect}
                    disabled={loading || !process.env.NEXT_PUBLIC_GA4_CLIENT_ID}
                  >
                    {loading ? 'Connecting...' : 'Connect with Google Analytics'}
                  </Button>
                </div>

                <p className={cn(
                  "text-xs text-center mt-4",
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  By connecting, you authorize us to access your Google Analytics data.
                  Your credentials are encrypted and stored securely.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


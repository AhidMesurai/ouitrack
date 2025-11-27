'use client'

import { useState, useEffect, Suspense } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { BarChart3, CheckCircle2, Loader2, X, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Property {
  property: string
  displayName: string
}

interface GA4ConnectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function ConnectionModalContent({ open, onOpenChange, onSuccess }: GA4ConnectionModalProps) {
  const [step, setStep] = useState<'connect' | 'select' | 'manage'>('connect')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set())
  const [sessionData, setSessionData] = useState<any>(null)
  const [connectedProperties, setConnectedProperties] = useState<any[]>([])
  const [fetchingConnections, setFetchingConnections] = useState(false)

  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    theme = 'dark'
  }

  useEffect(() => {
    if (open) {
      fetchConnections()
    }
  }, [open])

  const fetchConnections = async () => {
    setFetchingConnections(true)
    try {
      const response = await fetch('/api/ga4/properties')
      if (response.ok) {
        const data = await response.json()
        const conns = data.connections || []
        setConnectedProperties(conns.filter((c: any) => c.is_active))
        
        // If no connections, show connect step
        if (conns.length === 0) {
          setStep('connect')
        } else {
          setStep('manage')
        }
      }
    } catch (error) {
      console.error('Error fetching connections:', error)
    } finally {
      setFetchingConnections(false)
    }
  }

  const handleConnect = () => {
    setLoading(true)
    
    const clientId = process.env.NEXT_PUBLIC_GA4_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_GA4_REDIRECT_URI || `${window.location.origin}/api/ga4/callback`
    const scopes = [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/analytics.manage.users.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ')
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `access_type=offline&` +
      `prompt=consent`

    // Store modal state in sessionStorage
    sessionStorage.setItem('ga4_modal_open', 'true')
    window.location.href = authUrl
  }

  const handleUpdateConnection = async () => {
    if (selectedProperties.size === 0) {
      alert('Please select at least one property to connect')
      return
    }

    if (!sessionData) {
      alert('Session expired. Please try connecting again.')
      return
    }

    setSubmitting(true)

    try {
      const selectedProps = properties.filter(p => selectedProperties.has(p.property))
      
      // First, delete all existing connections
      for (const conn of connectedProperties) {
        await fetch(`/api/ga4/connections/${conn.id}`, {
          method: 'DELETE',
        })
      }
      
      // Then add selected properties
      const response = await fetch('/api/ga4/select-properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedProperties: selectedProps,
          googleAccountEmail: sessionData.googleAccountEmail,
          accessToken: sessionData.accessToken,
          refreshToken: sessionData.refreshToken,
          expiresIn: sessionData.expiresIn,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update connection')
      }

      // Success!
      await fetchConnections()
      setStep('manage')
      onSuccess?.()
    } catch (error: any) {
      console.error('Error updating connection:', error)
      alert(`Failed to update connection: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveConnection = async () => {
    if (!confirm('Are you sure you want to remove all GA4 connections? This will disconnect all properties.')) {
      return
    }

    setSubmitting(true)
    try {
      for (const conn of connectedProperties) {
        await fetch(`/api/ga4/connections/${conn.id}`, {
          method: 'DELETE',
        })
      }
      await fetchConnections()
      setStep('connect')
      onSuccess?.()
    } catch (error: any) {
      console.error('Error removing connection:', error)
      alert(`Failed to remove connection: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleProperty = (propertyId: string) => {
    const newSelected = new Set(selectedProperties)
    if (newSelected.has(propertyId)) {
      newSelected.delete(propertyId)
    } else {
      newSelected.add(propertyId)
    }
    setSelectedProperties(newSelected)
  }

  const selectAll = () => {
    const allSelected = new Set<string>(properties.map(p => p.property))
    setSelectedProperties(allSelected)
  }

  const deselectAll = () => {
    setSelectedProperties(new Set())
  }

  // Check if we're returning from OAuth
  useEffect(() => {
    const checkOAuthReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const sessionKey = urlParams.get('session')
      const googleEmail = urlParams.get('email')
      
      if (sessionKey && open) {
        // Fetch session data
        try {
          const response = await fetch(`/api/ga4/temp-session?sessionKey=${sessionKey}`)
          const data = await response.json()
          
          if (data.error) {
            alert(`Error: ${data.error}`)
            return
          }
          
          setSessionData(data.data)
          setProperties(data.data.properties || [])
          // Select all by default
          const allSelected = new Set<string>(data.data.properties.map((p: Property) => p.property))
          setSelectedProperties(allSelected)
          setStep('select')
          
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname)
        } catch (error) {
          console.error('Error fetching session:', error)
          alert('Session expired. Please try connecting again.')
        }
      }
    }
    
    checkOAuthReturn()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-2xl max-h-[90vh] overflow-y-auto",
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white'
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "flex items-center gap-2",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            <BarChart3 className="w-5 h-5" />
            GA4 Connection
          </DialogTitle>
          <DialogDescription className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {step === 'connect' && 'Connect your Google Analytics 4 account'}
            {step === 'select' && 'Select which properties to connect'}
            {step === 'manage' && 'Manage your connected properties'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {fetchingConnections && step === 'manage' ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : step === 'connect' ? (
            <div className="space-y-4">
              <div className={cn(
                "rounded-lg p-4",
                theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
              )}>
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                )}>
                  Connect your Google Analytics 4 account to start generating reports. You'll be able to select which properties to connect.
                </p>
              </div>
              <Button
                onClick={handleConnect}
                disabled={loading || !process.env.NEXT_PUBLIC_GA4_CLIENT_ID}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                {loading ? 'Connecting...' : 'Connect Google Analytics 4'}
              </Button>
            </div>
          ) : step === 'select' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAll}>
                    Deselect All
                  </Button>
                </div>
                <p className={cn("text-sm", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  {selectedProperties.size} of {properties.length} selected
                </p>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {properties.map((property) => {
                  const isSelected = selectedProperties.has(property.property)
                  return (
                    <div
                      key={property.property}
                      onClick={() => toggleProperty(property.property)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        isSelected
                          ? theme === 'dark'
                            ? 'bg-blue-500/20 border-blue-500/50'
                            : 'bg-blue-50 border-blue-300'
                          : theme === 'dark'
                            ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center",
                            isSelected
                              ? 'bg-blue-500 border-blue-500'
                              : theme === 'dark'
                                ? 'border-gray-600'
                                : 'border-gray-300'
                          )}>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          <div>
                            <p className={cn("font-semibold text-sm", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                              {property.displayName}
                            </p>
                            <p className={cn("text-xs", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                              {property.property}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('manage')
                    setSessionData(null)
                    setProperties([])
                    setSelectedProperties(new Set())
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateConnection}
                  disabled={submitting || selectedProperties.size === 0}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    `Connect ${selectedProperties.size} ${selectedProperties.size === 1 ? 'Property' : 'Properties'}`
                  )}
                </Button>
              </div>
            </div>
          ) : step === 'manage' ? (
            <div className="space-y-4">
              {connectedProperties.length > 0 ? (
                <>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {connectedProperties.map((conn) => (
                      <div
                        key={conn.id}
                        className={cn(
                          "p-3 rounded-lg border",
                          theme === 'dark'
                            ? 'bg-gray-800/30 border-gray-700/50'
                            : 'bg-gray-50 border-gray-200'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={cn("font-semibold text-sm", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                              {conn.property_name}
                            </p>
                            <p className={cn("text-xs", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                              {conn.property_id}
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Start update flow - reconnect to get new properties
                        handleConnect()
                      }}
                      className="flex-1"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Update Properties
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleRemoveConnection}
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Connection
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className={cn("text-sm mb-4", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                    No connections found
                  </p>
                  <Button
                    onClick={() => setStep('connect')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Connect GA4 Account
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function GA4ConnectionModal(props: GA4ConnectionModalProps) {
  return (
    <Suspense fallback={null}>
      <ConnectionModalContent {...props} />
    </Suspense>
  )
}


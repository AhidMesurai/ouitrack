'use client'

import { useState, useEffect, Suspense } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { BarChart3, Loader2, Plus, Trash2 } from 'lucide-react'

interface GA4ConnectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function ConnectionModalContent({ open, onOpenChange, onSuccess }: GA4ConnectionModalProps) {
  const [step, setStep] = useState<'connect' | 'manage'>('connect')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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
      // Check if we just connected
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('ga4_connected') === 'true') {
        setStep('manage')
        // Clean URL
        window.history.replaceState({}, '', '/dashboard')
      }
    }
  }, [open])

  const fetchConnections = async () => {
    setFetchingConnections(true)
    try {
      const response = await fetch('/api/ga4/properties')
      if (response.ok) {
        const data = await response.json()
        const conns = data.connections || data.properties || []
        // Convert properties format to connections format if needed
        if (data.properties && !data.connections) {
          setConnectedProperties(data.properties.map((p: any) => ({
            id: p.id,
            property_id: p.id,
            property_name: p.name,
            is_active: true,
          })))
        } else {
          setConnectedProperties(conns.filter((c: any) => c.is_active))
        }
        
        // If no connections, show connect step
        if (connectedProperties.length === 0 && conns.length === 0) {
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

    window.location.href = authUrl
  }

  const handleUpdateConnection = async () => {
    // Reconnect to update properties - this will auto-connect all properties
    handleConnect()
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
                  Connect your Google Analytics 4 account to start generating reports. All available properties will be connected automatically.
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
                      onClick={handleUpdateConnection}
                      disabled={submitting}
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


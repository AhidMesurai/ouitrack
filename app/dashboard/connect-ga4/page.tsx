'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function ConnectGA4Page() {
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [properties, setProperties] = useState<Array<{ id: string; name: string }>>([])
  const router = useRouter()

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
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Connect Google Analytics</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>GA4 Connection</CardTitle>
                <CardDescription>
                  Your Google Analytics account is connected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium">Successfully Connected!</p>
                    <p className="mt-1">
                      {properties.length > 0 
                        ? `You have ${properties.length} GA4 ${properties.length === 1 ? 'property' : 'properties'} connected.`
                        : 'You can now generate reports with your GA4 data.'
                      }
                    </p>
                  </div>
                </div>

                {properties.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Connected Properties:</h3>
                    <ul className="space-y-2">
                      {properties.map((prop) => (
                        <li key={prop.id} className="flex items-center text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          {prop.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-3">
                    <strong>Want to add more properties?</strong> Reconnect to refresh your property list and add any new properties you have access to.
                  </p>
                  <Button 
                    onClick={handleConnect}
                    disabled={loading || !process.env.NEXT_PUBLIC_GA4_CLIENT_ID}
                    variant="outline"
                    className="w-full"
                  >
                    {loading ? 'Reconnecting...' : 'Reconnect & Refresh Properties'}
                  </Button>
                </div>

                <div className="pt-4 space-y-2">
                  <Button 
                    onClick={() => router.push('/dashboard/reports')}
                    className="w-full"
                  >
                    View Reports
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Connect Google Analytics</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>GA4 Connection</CardTitle>
              <CardDescription>
                Connect your Google Analytics 4 account to start generating reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What you&apos;ll need:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Access to a Google Analytics 4 property</li>
                    <li>Viewer or Editor permissions on the property</li>
                  </ul>
                </div>
              </div>

              {!process.env.NEXT_PUBLIC_GA4_CLIENT_ID && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Configuration Required:</strong> Please add GA4 OAuth credentials to your environment variables.
                    See <code className="bg-yellow-100 px-1 rounded">docs/ga4-connection-setup.md</code> for instructions.
                  </p>
                </div>
              )}

              {/* Error messages */}
              {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('error') && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium mb-2">Connection Error</p>
                  <p className="text-sm text-red-700">
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
                  className="w-full"
                  onClick={handleConnect}
                  disabled={loading || !process.env.NEXT_PUBLIC_GA4_CLIENT_ID}
                >
                  {loading ? 'Connecting...' : 'Connect with Google Analytics'}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By connecting, you authorize us to access your Google Analytics data.
                Your credentials are encrypted and stored securely.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


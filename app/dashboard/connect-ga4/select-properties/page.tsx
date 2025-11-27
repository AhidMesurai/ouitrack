'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { BarChart3, CheckCircle2, Loader2 } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Property {
  property: string
  displayName: string
}

function SelectPropertiesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionKey = searchParams.get('session')
  const googleEmail = searchParams.get('email')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set())
  const [sessionData, setSessionData] = useState<any>(null)

  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    theme = 'dark'
  }

  useEffect(() => {
    if (!sessionKey) {
      router.push('/dashboard/connect-ga4?error=no_session')
      return
    }

    // Fetch session data
    fetch(`/api/ga4/temp-session?sessionKey=${sessionKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          router.push(`/dashboard/connect-ga4?error=${data.error}`)
          return
        }
        setSessionData(data.data)
        setProperties(data.data.properties || [])
        // Select all by default
        const allSelected = new Set<string>(data.data.properties.map((p: Property) => p.property))
        setSelectedProperties(allSelected)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching session:', error)
        router.push('/dashboard/connect-ga4?error=session_error')
      })
  }, [sessionKey, router])

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
    const allSelected = new Set(properties.map(p => p.property))
    setSelectedProperties(allSelected)
  }

  const deselectAll = () => {
    setSelectedProperties(new Set())
  }

  const handleSubmit = async () => {
    if (selectedProperties.size === 0) {
      alert('Please select at least one property to connect')
      return
    }

    if (!sessionData) {
      alert('Session expired. Please try connecting again.')
      router.push('/dashboard/connect-ga4')
      return
    }

    setSubmitting(true)

    try {
      const selectedProps = properties.filter(p => selectedProperties.has(p.property))
      
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
        throw new Error(result.error || 'Failed to connect properties')
      }

      // Success! Redirect to dashboard
      router.push('/dashboard/connect-ga4?success=true')
    } catch (error: any) {
      console.error('Error connecting properties:', error)
      alert(`Failed to connect properties: ${error.message}`)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl space-y-6">
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
                Select Properties to Connect
              </h1>
            </div>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Choose which GA4 properties to connect from <strong>{googleEmail}</strong>
            </p>
          </div>

          {/* Selection Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                className={cn(
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                    : ''
                )}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deselectAll}
                className={cn(
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                    : ''
                )}
              >
                Deselect All
              </Button>
            </div>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {selectedProperties.size} of {properties.length} selected
            </p>
          </div>

          {/* Properties List */}
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
                <div className="space-y-3">
                  {properties.map((property, index) => {
                    const isSelected = selectedProperties.has(property.property)
                    return (
                      <motion.div
                        key={property.property}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => toggleProperty(property.property)}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all duration-200",
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
                              "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                              isSelected
                                ? 'bg-blue-500 border-blue-500'
                                : theme === 'dark'
                                  ? 'border-gray-600'
                                  : 'border-gray-300'
                            )}>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div>
                              <p className={cn(
                                "font-semibold text-sm",
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              )}>
                                {property.displayName}
                              </p>
                              <p className={cn(
                                "text-xs",
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              )}>
                                {property.property}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/connect-ga4')}
              className={cn(
                "flex-1",
                theme === 'dark'
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                  : ''
              )}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
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
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default function SelectPropertiesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        }>
          <SelectPropertiesContent />
        </Suspense>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


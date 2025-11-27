'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ConnectionStatus } from '@/components/dashboard/connection-status'
import { ReportGrid } from '@/components/reports/report-grid'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { GA4ConnectionModal } from '@/components/dashboard/ga4-connection-modal'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function DashboardContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)
  
  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    // During SSR, use default theme
    theme = 'dark'
  }

  // Check if we're returning from OAuth
  useEffect(() => {
    const sessionKey = searchParams.get('ga4_session')
    if (sessionKey) {
      setModalOpen(true)
      // Clean URL
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [searchParams])

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="relative">
            <h1 className={cn(
              "text-3xl font-bold mb-2",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Dashboard
            </h1>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Welcome back, <span className="font-semibold">{user?.email}</span>
            </p>
          </div>

          {/* Connection Status */}
          <ConnectionStatus />

          {/* Reports Section */}
          <div>
            <h2 className={cn(
              "text-xl font-semibold mb-4",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Available Reports
            </h2>
            <ReportGrid />
          </div>
        </div>
        
        {/* GA4 Connection Modal */}
        <GA4ConnectionModal 
          open={modalOpen} 
          onOpenChange={setModalOpen}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  )
}


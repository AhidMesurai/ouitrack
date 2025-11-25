'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ConnectionStatus } from '@/components/dashboard/connection-status'
import { ReportGrid } from '@/components/reports/report-grid'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { user } = useAuth()
  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    // During SSR, use default theme
    theme = 'dark'
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header Section with Animation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              <h1 className={cn(
                "text-4xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent",
                theme === 'dark' 
                  ? 'from-white via-gray-200 to-gray-400' 
                  : 'from-gray-900 via-gray-700 to-gray-500'
              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                Dashboard
              </h1>
              <p className={cn(
                "text-lg",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                Welcome back, <span className="font-semibold text-white">{user?.email}</span>
              </p>
            </div>
          </motion.div>

          {/* Connection Status with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ConnectionStatus />
          </motion.div>

          {/* Reports Section with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn(
                "text-2xl font-semibold",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                Available Reports
              </h2>
            </div>
            <ReportGrid />
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


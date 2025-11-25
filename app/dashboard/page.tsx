'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ConnectionStatus } from '@/components/dashboard/connection-status'
import { ReportGrid } from '@/components/reports/report-grid'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { user } = useAuth()
  const { theme } = useTheme()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className={cn(
              "text-3xl font-bold mb-2",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Dashboard
            </h1>
            <p className={cn(
              "mt-2",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Welcome back, {user?.email}
            </p>
          </div>

          <ConnectionStatus />

          <div>
            <h2 className={cn(
              "text-2xl font-semibold mb-4",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Available Reports
            </h2>
            <ReportGrid />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


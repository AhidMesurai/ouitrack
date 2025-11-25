'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ConnectionStatus } from '@/components/dashboard/connection-status'
import { ReportGrid } from '@/components/reports/report-grid'
import { useAuth } from '@/hooks/use-auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.email}
            </p>
          </div>

          <ConnectionStatus />

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Reports</h2>
            <ReportGrid />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


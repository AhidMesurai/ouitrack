'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ReportGrid } from '@/components/reports/report-grid'

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
          <ReportGrid />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


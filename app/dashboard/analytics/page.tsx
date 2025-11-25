'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
          <p className="text-gray-600">Analytics overview coming soon...</p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


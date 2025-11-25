'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requireAdmin>
      <DashboardLayout>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage all platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">User list coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


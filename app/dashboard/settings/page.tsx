'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function SettingsPage() {
  const { user, signOut } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div className="pt-4 border-t">
                <Button variant="destructive" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


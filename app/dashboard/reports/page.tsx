'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ReportGrid } from '@/components/reports/report-grid'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { FileText } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function ReportsPage() {
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
        <div className="space-y-6">
          {/* Header */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "p-2 rounded-lg",
                theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
              )}>
                <FileText className={cn(
                  "w-6 h-6",
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                )} />
              </div>
              <h1 className={cn(
                "text-3xl font-bold",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                Reports
              </h1>
            </div>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              View and manage your analytics reports
            </p>
          </div>

          {/* Reports Grid */}
          <ReportGrid />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { Users } from 'lucide-react'
import { motion } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AdminUsersPage() {
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
    <ProtectedRoute requireAdmin>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "p-2 rounded-lg",
                theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
              )}>
                <Users className={cn(
                  "w-6 h-6",
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                )} />
              </div>
              <h1 className={cn(
                "text-3xl font-bold",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                User Management
              </h1>
            </div>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Manage all platform users
            </p>
          </div>

          {/* Content Card */}
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
                <h3 className={cn(
                  "text-lg font-semibold mb-2",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  All Users
                </h3>
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  User list coming soon...
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { User, Mail, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
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
        <div className="max-w-2xl space-y-6">
          {/* Header */}
          <div className="relative">
            <h1 className={cn(
              "text-3xl font-bold mb-2",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Settings
            </h1>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Manage your account settings and preferences
            </p>
          </div>

          {/* Account Card */}
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
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn(
                    "p-3 rounded-lg",
                    theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                  )}>
                    <User className={cn(
                      "w-6 h-6",
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    )} />
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-lg font-semibold",
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )} style={{ fontFamily: "'Inter', sans-serif" }}>
                      Account
                    </h3>
                    <p className={cn(
                      "text-xs",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      Manage your account settings
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={cn(
                      "block text-sm font-medium mb-2 flex items-center gap-2",
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      className={cn(
                        "w-full px-4 py-3 rounded-lg border transition-all",
                        theme === 'dark'
                          ? 'bg-gray-900/60 border-gray-700/50 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      )}
                      value={user?.email || ''}
                      disabled
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-700/50">
                    <Button 
                      variant="destructive" 
                      onClick={signOut}
                      className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


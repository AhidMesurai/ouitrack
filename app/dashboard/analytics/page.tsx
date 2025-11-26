'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    // During SSR, use default theme
    theme = 'dark'
  }

  const stats = [
    { icon: Users, label: 'Total Users', value: '0', change: '+0%' },
    { icon: TrendingUp, label: 'Sessions', value: '0', change: '+0%' },
    { icon: DollarSign, label: 'Revenue', value: '$0', change: '+0%' },
    { icon: BarChart3, label: 'Conversion', value: '0%', change: '+0%' },
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="relative">
            <h1 className={cn(
              "text-3xl font-bold mb-2",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Analytics
            </h1>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )} style={{ fontFamily: "'Inter', sans-serif" }}>
              Overview of your analytics data
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={cn(
                    "relative group overflow-hidden rounded-xl p-5 border",
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 border-gray-800/50 backdrop-blur-xl shadow-2xl'
                      : 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg'
                  )}
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10' 
                      : 'bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50'
                  )} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        )} />
                      </div>
                    </div>
                    <p className={cn(
                      "text-2xl font-bold mb-1",
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {stat.value}
                    </p>
                    <p className={cn(
                      "text-sm mb-1",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {stat.label}
                    </p>
                    <p className="text-xs text-green-500">
                      {stat.change}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Coming Soon Message */}
          <div className={cn(
            "relative group overflow-hidden rounded-xl p-6 border",
            theme === 'dark'
              ? 'bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 border-gray-800/50 backdrop-blur-xl shadow-2xl'
              : 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg'
          )}>
            <p className={cn(
              "text-center",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              Analytics overview coming soon...
            </p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Settings, BarChart3, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { useTheme } from '@/contexts/theme-context'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const adminNavigation = [
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Templates', href: '/admin/templates', icon: FileText },
]

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const { signOut, user } = useAuth()
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
    <div className={cn(
      "flex flex-col w-64 border-r min-h-screen transition-colors duration-200 relative z-20",
      theme === 'dark' 
        ? 'bg-gray-900/80 backdrop-blur-xl border-gray-800/50 shadow-2xl' 
        : 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg'
    )}>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center justify-between flex-shrink-0 px-4 mb-4">
          <span 
            className="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            style={{ 
              fontFamily: "'Rubik Glitch', sans-serif",
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              letterSpacing: '0.05em',
              fontWeight: 400,
              textShadow: theme === 'dark' 
                ? '0 2px 20px rgba(255, 255, 255, 0.1), 0 4px 40px rgba(255, 255, 255, 0.05)' 
                : 'none'
            }}
          >
            Oui Track
          </span>
          <ThemeToggle />
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                    isActive 
                      ? 'text-white' 
                      : theme === 'dark'
                        ? 'text-gray-400 group-hover:text-white'
                        : 'text-gray-400 group-hover:text-gray-600'
                  )}
                />
                {item.name}
              </Link>
            )
          })}
          {isAdmin && (
            <>
              <div className={cn(
                "pt-4 mt-4 border-t",
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              )}>
                <div className={cn(
                  "px-2 text-xs font-semibold uppercase tracking-wider",
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  Admin
                </div>
              </div>
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                        isActive 
                          ? 'text-white' 
                          : theme === 'dark'
                            ? 'text-gray-400 group-hover:text-white'
                            : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </>
          )}
        </nav>
        
        {/* User info and sign out at bottom */}
        <div className={cn(
          "px-4 py-4 border-t",
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium truncate",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className={cn(
              "w-full mt-2 justify-start transition-colors",
              theme === 'dark'
                ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}


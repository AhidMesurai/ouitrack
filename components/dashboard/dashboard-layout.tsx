'use client'

import { Sidebar } from './sidebar'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/theme-context'
import Orb from '@/components/landing/Orb'
import { motion } from 'framer-motion'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    // During SSR, use default theme
    theme = 'dark'
  }

  useEffect(() => {
    const checkAdmin = async () => {
      const response = await fetch('/api/auth/check-admin')
      if (response.ok) {
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      }
    }
    if (user) {
      checkAdmin()
    }
  }, [user])

  return (
    <div className={`flex h-screen transition-colors duration-200 relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-black' 
        : 'bg-gray-50'
    }`}>
      {/* Animated Background - Only in dark mode */}
      {theme === 'dark' && (
        <div className="absolute inset-0 z-0 opacity-30">
          <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <Orb
              hoverIntensity={0.3}
              rotateOnHover={false}
              hue={220}
              forceHoverState={true}
            />
          </div>
        </div>
      )}
      
      <Sidebar isAdmin={isAdmin} />
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}


'use client'

import { Sidebar } from './sidebar'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

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
    <div className="flex h-screen bg-gray-50">
      <Sidebar isAdmin={isAdmin} />
      <main className="flex-1 overflow-y-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}


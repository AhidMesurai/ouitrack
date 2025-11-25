'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode
  requireAdmin?: boolean 
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (requireAdmin && user) {
      setCheckingAdmin(true)
      fetch('/api/auth/check-admin')
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data.isAdmin)
          if (!data.isAdmin) {
            router.push('/dashboard')
          }
        })
        .catch(() => {
          router.push('/dashboard')
        })
        .finally(() => {
          setCheckingAdmin(false)
        })
    }
  }, [requireAdmin, user, router])

  if (loading || (requireAdmin && checkingAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireAdmin && !isAdmin) {
    return null
  }

  return <>{children}</>
}


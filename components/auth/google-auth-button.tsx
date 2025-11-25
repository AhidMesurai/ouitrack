'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function GoogleAuthButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Error initiating OAuth:', error)
        throw error
      }

      // Log the redirect URL for debugging
      if (data?.url) {
        console.log('OAuth redirect URL:', data.url)
        // Check if it's going to Supabase or directly to Google
        if (data.url.includes('supabase.co')) {
          console.log('✅ Redirecting through Supabase (correct)')
        } else if (data.url.includes('accounts.google.com')) {
          console.log('⚠️ Redirecting directly to Google (might be an issue)')
        }
      }
    } catch (error: any) {
      console.error('Error signing in:', error.message)
      alert(`Error signing in: ${error.message}`)
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={loading}
      className="w-full px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      size="lg"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </Button>
  )
}


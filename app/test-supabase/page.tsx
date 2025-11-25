'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TestSupabasePage() {
  const [info, setInfo] = useState<any>({ loading: true })

  useEffect(() => {
    const check = async () => {
      try {
        const supabase = createClient()
        
        // Check environment variables (these are available at build time)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
        
        // Test OAuth URL generation
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            skipBrowserRedirect: true, // Don't redirect, just get the URL
          },
        })

        setInfo({
          loading: false,
          supabaseUrl,
          hasKey: supabaseKey,
          oauthUrl: data?.url,
          error: error?.message,
          goesThroughSupabase: data?.url?.includes('supabase.co'),
          goesDirectlyToGoogle: data?.url?.includes('accounts.google.com'),
          errorDetails: error,
        })
      } catch (err: any) {
        setInfo({
          loading: false,
          error: err.message,
          errorDetails: err,
        })
      }
    }

    check()
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase OAuth Debug Info</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Configuration:</h2>
          <pre className="text-sm">
            {JSON.stringify(info, null, 2)}
          </pre>
        </div>

        {info.oauthUrl && (
          <div className="bg-blue-50 p-4 rounded">
            <h2 className="font-semibold mb-2">OAuth URL:</h2>
            <p className="text-sm break-all">{info.oauthUrl}</p>
          </div>
        )}

        {info.goesThroughSupabase && (
          <div className="bg-green-50 p-4 rounded">
            <p className="text-green-800">✅ OAuth flow goes through Supabase (correct!)</p>
          </div>
        )}

        {info.goesDirectlyToGoogle && (
          <div className="bg-red-50 p-4 rounded">
            <p className="text-red-800">❌ OAuth flow goes directly to Google (wrong!)</p>
            <p className="text-sm mt-2">This means Supabase OAuth is not configured correctly.</p>
          </div>
        )}

        {info.error && (
          <div className="bg-red-50 p-4 rounded">
            <p className="text-red-800">Error: {info.error}</p>
          </div>
        )}

        {!info.supabaseUrl && (
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-yellow-800">⚠️ NEXT_PUBLIC_SUPABASE_URL is not set!</p>
            <p className="text-sm mt-2">Check your .env.local file</p>
          </div>
        )}
      </div>
    </div>
  )
}


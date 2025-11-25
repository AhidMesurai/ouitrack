'use client'

import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const details = searchParams.get('details')
  const description = searchParams.get('description')

  const getErrorMessage = () => {
    if (!error) return null
    
    switch (error) {
      case 'auth_failed':
        return 'Authentication failed. Please try again.'
      case 'session_failed':
        return 'Session creation failed. Please try again.'
      case 'no_code':
        return 'No authorization code received. Please try again.'
      case 'access_denied':
        return 'Access denied. Please authorize the application.'
      default:
        return `Error: ${error}${details ? ` - ${details}` : ''}${description ? ` - ${description}` : ''}`
    }
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">
            Sign in with your Google account to continue
          </p>
        </div>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              {details && (
                <p className="text-xs text-red-600 mt-1">{details}</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8">
          <GoogleAuthButton />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}


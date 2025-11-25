'use client'

import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { Suspense } from 'react'
import Orb from '@/components/landing/Orb'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const details = searchParams.get('details')
  const description = searchParams.get('description')
  const { t } = useLanguage()

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
      case 'pkce_error':
        return 'Authentication error. Please clear cookies and try again.'
      default:
        return `Error: ${error}${details ? ` - ${details}` : ''}${description ? ` - ${description}` : ''}`
    }
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Orb Background */}
      <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

      {/* Login Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-md w-full space-y-8 p-8"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="text-center mb-8"
          >
            <motion.span
              className="block mb-4"
              style={{
                fontFamily: "'Rubik Glitch', sans-serif",
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                letterSpacing: '0.05em',
                fontWeight: 400,
                color: 'white',
                textShadow: '0 2px 20px rgba(255, 255, 255, 0.1), 0 4px 40px rgba(255, 255, 255, 0.05)'
              }}
            >
              Oui Track
            </motion.span>
            <h1
              style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                letterSpacing: '-0.01em',
                color: 'white',
                textShadow: '0 2px 20px rgba(255, 255, 255, 0.1), 0 4px 40px rgba(255, 255, 255, 0.05)'
              }}
            >
              Welcome Back
            </h1>
            <p
              className="mt-3"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem'
              }}
            >
              Sign in with your Google account to continue
            </p>
          </motion.div>
          
          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3 backdrop-blur-sm"
            >
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-200">{errorMessage}</p>
                {details && (
                  <p className="text-xs text-red-300/80 mt-1">{details}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mt-8"
          >
            <GoogleAuthButton />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white" style={{ fontFamily: "'Inter', sans-serif" }}>Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}


import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error_description = requestUrl.searchParams.get('error_description')
  const error = requestUrl.searchParams.get('error')
  const origin = requestUrl.origin
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  // Check for OAuth errors from Google
  if (error) {
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(`${origin}/login?error=${error}&description=${error_description || ''}`)
  }

  if (!code) {
    console.error('No code parameter in callback')
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    // Use the same pattern as middleware - use request.cookies directly
    // This is the recommended approach for route handlers in Next.js 14+
    let response = NextResponse.next({
      request,
    })

    // Explicitly read cookies from request to ensure they're available
    const allCookies = request.cookies.getAll()
    console.log('Reading cookies from request...')
    console.log('Available cookies:', allCookies.map(c => c.name))

    // Create Supabase client using request.cookies (same as middleware)
    // Note: Let Supabase handle cookie options, but ensure domain is set for production
    const isProduction = process.env.NODE_ENV === 'production'

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
            })
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) => {
              // Preserve Supabase's cookie options, but ensure domain is set for production
              const finalOptions = { ...options }
              if (isProduction && !finalOptions.domain) {
                // Only set domain if not already set by Supabase
                finalOptions.domain = '.mesurai.com'
              }
              response.cookies.set(name, value, finalOptions)
            })
          },
        },
      }
    )
    
    // Debug: Check code verifier cookie
    const codeVerifierCookie = allCookies.find(c => 
      c.name.includes('code-verifier') || 
      c.name.includes('pkce') || 
      (c.name.includes('sb-') && c.name.includes('code'))
    )
    console.log('Code verifier cookie found:', !!codeVerifierCookie)
    if (codeVerifierCookie) {
      console.log('Code verifier cookie name:', codeVerifierCookie.name)
      console.log('Code verifier cookie value length:', codeVerifierCookie.value?.length || 0)
      // Check if value is JSON-encoded (starts with quote)
      const rawValue = codeVerifierCookie.value
      let actualValue = rawValue
      if (rawValue?.startsWith('"') && rawValue?.endsWith('"')) {
        try {
          actualValue = JSON.parse(rawValue)
          console.log('Cookie value was JSON-encoded, parsed value length:', actualValue?.length || 0)
        } catch {
          console.log('Cookie value looks JSON-encoded but failed to parse')
        }
      }
      console.log('Code verifier cookie value (first 20 chars):', actualValue?.substring(0, 20) || 'EMPTY')
    }
    console.log('Code parameter:', code)
    
    // Exchange the code for a session
    // The code verifier should be in cookies from the initial OAuth request
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      console.error('Error details:', {
        message: exchangeError.message,
        status: exchangeError.status,
        code: exchangeError.status,
        name: exchangeError.name
      })
      
      // Check if it's a PKCE error
      if (exchangeError.message.includes('code verifier') || exchangeError.message.includes('non-empty')) {
        console.error('PKCE error - code verifier not found in cookies')
        console.error('This usually means the cookie was lost during redirect')
        console.error('Solution: Clear cookies and try again, or check cookie settings')
        
        return NextResponse.redirect(`${origin}/login?error=pkce_error&details=${encodeURIComponent('Code verifier cookie not found. Please clear cookies and try signing in again.')}`)
      }
      
      return NextResponse.redirect(`${origin}/login?error=auth_failed&details=${encodeURIComponent(exchangeError.message)}`)
    }

    // Verify session was created
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Error getting session:', sessionError)
      return NextResponse.redirect(`${origin}/login?error=session_error&details=${encodeURIComponent(sessionError.message)}`)
    }

    if (!session) {
      console.error('Session not created after code exchange')
      return NextResponse.redirect(`${origin}/login?error=session_failed`)
    }

    console.log('Successfully authenticated user:', session.user.email)

    // Create redirect response with cookies from the response object
    // The response object has session cookies set by Supabase via setAll
    const redirectResponse = NextResponse.redirect(`${origin}${next}`)
    
    // Copy all cookies from the response object (which contains session cookies)
    const cookiesToCopy = response.cookies.getAll()
    console.log('Cookies to copy to redirect:', cookiesToCopy.map(c => c.name))
    
    cookiesToCopy.forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    
    // Also ensure request cookies are included (in case they weren't in response)
    const requestCookies = request.cookies.getAll()
    const authCookies = requestCookies.filter(c => 
      (c.name.includes('auth-token') || c.name.includes('sb-')) && 
      !c.name.includes('code-verifier')
    )
    authCookies.forEach((cookie) => {
      if (!redirectResponse.cookies.has(cookie.name)) {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      }
    })
    
    console.log('Final cookies in redirect response:', redirectResponse.cookies.getAll().map(c => c.name))
    
    return redirectResponse
  } catch (err: any) {
    console.error('Unexpected error in callback:', err)
    return NextResponse.redirect(`${origin}/login?error=unexpected&details=${encodeURIComponent(err.message || 'Unknown error')}`)
  }
}

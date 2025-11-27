import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  // Use NEXTAUTH_URL for production domain, fallback to request origin
  const origin = process.env.NEXTAUTH_URL || requestUrl.origin

  // Check for OAuth errors
  if (error) {
    console.error('GA4 OAuth error:', error)
    return NextResponse.redirect(`${origin}/dashboard/connect-ga4?error=${error}`)
  }

  if (!code) {
    console.error('No code parameter in GA4 callback')
    return NextResponse.redirect(`${origin}/dashboard/connect-ga4?error=no_code`)
  }

  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.redirect(`${origin}/login?error=unauthorized`)
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GA4_CLIENT_ID!,
        client_secret: process.env.GA4_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_GA4_REDIRECT_URI || `${process.env.NEXTAUTH_URL || origin}/api/ga4/callback`,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Token exchange error:', errorData)
      return NextResponse.redirect(`${origin}/dashboard/connect-ga4?error=token_exchange_failed`)
    }

    const tokens = await tokenResponse.json()
    const { access_token, refresh_token, expires_in } = tokens

    // Get Google user email
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    })

    let googleAccountEmail = 'unknown'
    if (userInfoResponse.ok) {
      const userInfo = await userInfoResponse.json()
      googleAccountEmail = userInfo.email || 'unknown'
    }

    // Get user's GA4 properties
    const propertiesResponse = await fetch(
      'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    )

    if (!propertiesResponse.ok) {
      const errorData = await propertiesResponse.json().catch(() => ({}))
      console.error('Failed to fetch properties:', {
        status: propertiesResponse.status,
        statusText: propertiesResponse.statusText,
        error: errorData,
      })
      
      // More detailed error message
      let errorMessage = 'fetch_properties_failed'
      if (propertiesResponse.status === 403) {
        errorMessage = 'fetch_properties_failed_permission'
      } else if (propertiesResponse.status === 401) {
        errorMessage = 'fetch_properties_failed_auth'
      }
      
      return NextResponse.redirect(`${origin}/dashboard/connect-ga4?error=${errorMessage}`)
    }

    const propertiesData = await propertiesResponse.json()
    console.log('Properties data:', JSON.stringify(propertiesData, null, 2))
    
    // Collect all GA4 properties
    const allProperties: Array<{ property: string; displayName: string }> = []

    if (propertiesData.accountSummaries && propertiesData.accountSummaries.length > 0) {
      for (const account of propertiesData.accountSummaries) {
        if (account.propertySummaries && account.propertySummaries.length > 0) {
          for (const property of account.propertySummaries) {
            allProperties.push({
              property: property.property,
              displayName: property.displayName,
            })
          }
        }
      }
    }

    if (allProperties.length === 0) {
      console.error('No GA4 properties found in account')
      return NextResponse.redirect(`${origin}/dashboard/connect-ga4?error=no_properties_found`)
    }
    
    console.log(`Found ${allProperties.length} properties for selection`)

    // Store tokens temporarily in session/cookies for property selection
    // In production, use encrypted session storage or a temporary table
    // For now, we'll pass data via URL params (not ideal for tokens, but works for demo)
    // Better approach: Store in encrypted session or temporary table with expiry
    
    // Redirect to property selection page with encrypted data
    // For security, we should encrypt the tokens or use a session
    // For now, using a temporary approach with base64 encoding (not secure for production!)
    const tempData = {
      properties: allProperties,
      googleAccountEmail,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
    }
    
    // Store in session storage via API route that sets secure httpOnly cookies
    // For now, redirect to selection page which will fetch from a temporary endpoint
    // We'll create a secure session-based approach
    
    // Create a temporary session to store tokens securely
    const sessionKey = `ga4_connect_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // Store session data in cookie via internal API call
    const sessionData = {
      properties: allProperties,
      googleAccountEmail,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
    }

    // Set cookie directly
    const response = NextResponse.redirect(
      `${origin}/dashboard/connect-ga4/select-properties?session=${sessionKey}&email=${encodeURIComponent(googleAccountEmail)}&count=${allProperties.length}`
    )
    
    // Store session data in httpOnly cookie
    response.cookies.set(`ga4_session_${sessionKey}`, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    return response
  } catch (err: any) {
    console.error('Unexpected error in GA4 callback:', err)
    return NextResponse.redirect(`${origin}/dashboard/connect-ga4?error=unexpected`)
  }
}


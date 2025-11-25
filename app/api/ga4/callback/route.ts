import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const origin = requestUrl.origin

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
        redirect_uri: process.env.NEXT_PUBLIC_GA4_REDIRECT_URI || `${origin}/api/ga4/callback`,
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
    
    console.log(`Found ${allProperties.length} properties to connect`)

    // Store all properties in database
    const expiresAt = new Date(Date.now() + (expires_in * 1000)).toISOString()
    let connectedCount = 0
    let errors: string[] = []

    for (const prop of allProperties) {
      // Check if connection already exists
      const { data: existingConnection } = await supabase
        .from('ga4_connections')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', prop.property)
        .single()

      if (existingConnection) {
        // Update existing connection
        const { error } = await supabase
          .from('ga4_connections')
          .update({
            property_name: prop.displayName,
            access_token: access_token, // In production, encrypt this!
            refresh_token: refresh_token, // In production, encrypt this!
            token_expires_at: expiresAt,
            is_active: true,
            last_synced_at: new Date().toISOString(),
          })
          .eq('id', existingConnection.id)
        
        if (error) {
          console.error(`Error updating property ${prop.displayName}:`, error)
          errors.push(`${prop.displayName}: ${error.message}`)
        } else {
          connectedCount++
        }
      } else {
        // Insert new connection
        const { error } = await supabase
          .from('ga4_connections')
          .insert({
            user_id: user.id,
            property_id: prop.property,
            property_name: prop.displayName,
            access_token: access_token, // In production, encrypt this!
            refresh_token: refresh_token, // In production, encrypt this!
            token_expires_at: expiresAt,
            is_active: true,
          })
        
        if (error) {
          console.error(`Error inserting property ${prop.displayName}:`, error)
          errors.push(`${prop.displayName}: ${error.message}`)
        } else {
          connectedCount++
        }
      }
    }

    if (connectedCount === 0) {
      console.error('Failed to connect any properties:', errors)
      return NextResponse.redirect(`${origin}/dashboard/connect-ga4?error=database_error`)
    }

    console.log(`Successfully connected ${connectedCount} out of ${allProperties.length} properties`)

    // Success! Redirect to dashboard
    return NextResponse.redirect(`${origin}/dashboard/connect-ga4?success=true`)
  } catch (err: any) {
    console.error('Unexpected error in GA4 callback:', err)
    return NextResponse.redirect(`${origin}/dashboard/connect-ga4?error=unexpected`)
  }
}


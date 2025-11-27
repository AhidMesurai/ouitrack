import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { selectedProperties, googleAccountEmail, accessToken, refreshToken, expiresIn } = body

    if (!selectedProperties || !Array.isArray(selectedProperties) || selectedProperties.length === 0) {
      return NextResponse.json({ error: 'No properties selected' }, { status: 400 })
    }

    if (!googleAccountEmail || !accessToken || !refreshToken) {
      return NextResponse.json({ error: 'Missing required connection data' }, { status: 400 })
    }

    const expiresAt = new Date(Date.now() + (expiresIn * 1000)).toISOString()
    let connectedCount = 0
    let errors: string[] = []

    for (const prop of selectedProperties) {
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
            google_account_email: googleAccountEmail,
            access_token: accessToken,
            refresh_token: refreshToken,
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
            google_account_email: googleAccountEmail,
            access_token: accessToken,
            refresh_token: refreshToken,
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
      return NextResponse.json({ 
        error: 'Failed to connect any properties', 
        details: errors 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      connectedCount,
      totalSelected: selectedProperties.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error: any) {
    console.error('Error in select-properties:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}


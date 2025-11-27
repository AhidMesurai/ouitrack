import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error in properties API:', authError)
      return NextResponse.json({ error: 'Authentication error', details: authError.message }, { status: 401 })
    }
    
    if (!user) {
      console.error('No user found in properties API')
      return NextResponse.json({ error: 'Unauthorized - No user found' }, { status: 401 })
    }

    console.log(`Fetching GA4 connections for user: ${user.id}`)

    // Get user's GA4 connections - explicitly select columns to avoid issues
    const { data: connections, error } = await supabase
      .from('ga4_connections')
      .select('id, property_id, property_name, is_active, created_at, connected_at, user_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching GA4 connections:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: 'Database error', 
        details: error.message,
        code: error.code,
        hint: error.hint 
      }, { status: 500 })
    }

    console.log(`Found ${connections?.length || 0} GA4 connections for user ${user.id}`)

    // Format properties for response
    const properties = (connections || []).map(conn => ({
      id: conn.property_id,
      name: conn.property_name,
      connectedAt: conn.created_at || conn.connected_at,
    }))

    console.log(`Returning ${properties.length} properties:`, properties.map(p => p.name))

    return NextResponse.json({ properties })
  } catch (err: any) {
    console.error('Unexpected error in properties API:', err)
    console.error('Error stack:', err.stack)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 })
  }
}


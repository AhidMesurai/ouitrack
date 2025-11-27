import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's GA4 connections
  const { data: connections, error } = await supabase
    .from('ga4_connections')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Format properties for response
  const properties = (connections || []).map(conn => ({
    id: conn.property_id,
    name: conn.property_name,
    connectedAt: conn.created_at || conn.connected_at,
  }))

  // Also return full connections for management UI
  return NextResponse.json({ 
    properties,
    connections: connections || []
  })
}


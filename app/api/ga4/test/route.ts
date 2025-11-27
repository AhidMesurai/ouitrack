import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      return NextResponse.json({ 
        step: 'auth',
        error: authError.message,
        details: authError 
      }, { status: 401 })
    }
    
    if (!user) {
      return NextResponse.json({ 
        step: 'auth',
        error: 'No user found'
      }, { status: 401 })
    }

    // Test table exists and can query
    const { data: connections, error: queryError, count } = await supabase
      .from('ga4_connections')
      .select('id, property_id, property_name', { count: 'exact' })
      .eq('user_id', user.id)
      .limit(1)

    if (queryError) {
      return NextResponse.json({ 
        step: 'query',
        error: queryError.message,
        code: queryError.code,
        hint: queryError.hint,
        details: queryError
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      user_id: user.id,
      connections_found: count || 0,
      sample_connection: connections?.[0] || null
    })
  } catch (err: any) {
    return NextResponse.json({ 
      step: 'exception',
      error: err.message,
      stack: err.stack
    }, { status: 500 })
  }
}


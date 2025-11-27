import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// Store temporary session data
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { sessionKey, data } = body

    if (!sessionKey || !data) {
      return NextResponse.json({ error: 'Missing session key or data' }, { status: 400 })
    }

    // Store in cookie (httpOnly, secure, short expiry)
    const cookieStore = await cookies()
    cookieStore.set(`ga4_session_${sessionKey}`, JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error storing session:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

// Get temporary session data
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const requestUrl = new URL(request.url)
    const sessionKey = requestUrl.searchParams.get('sessionKey')

    if (!sessionKey) {
      return NextResponse.json({ error: 'Missing session key' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const sessionData = cookieStore.get(`ga4_session_${sessionKey}`)

    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 })
    }

    const data = JSON.parse(sessionData.value)
    
    // Delete the cookie after reading
    cookieStore.delete(`ga4_session_${sessionKey}`)

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error retrieving session:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}


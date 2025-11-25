import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ isAdmin: false }, { status: 401 })
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return NextResponse.json({ isAdmin: false })
  }

  return NextResponse.json({ isAdmin: profile.role === 'admin' })
}


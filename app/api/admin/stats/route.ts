import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    // Get total connections
    const { count: totalConnections } = await supabase
      .from('ga4_connections')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get total templates
    const { count: totalTemplates } = await supabase
      .from('report_templates')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get total reports generated
    const { count: totalReports } = await supabase
      .from('generated_reports')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalConnections: totalConnections || 0,
      totalTemplates: totalTemplates || 0,
      totalReports: totalReports || 0,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


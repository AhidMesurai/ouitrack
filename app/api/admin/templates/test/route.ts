import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { fetchGA4Report, refreshAccessToken } from '@/lib/ga4/client'

export async function POST(request: Request) {
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

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { templateId, propertyId, startDate, endDate } = body

  if (!templateId || !propertyId || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: templateId, propertyId, startDate, endDate' },
      { status: 400 }
    )
  }

  try {
    // Get template
    const { data: template, error: templateError } = await supabase
      .from('report_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (templateError || !template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Get GA4 connection
    const { data: connection, error: connectionError } = await supabase
      .from('ga4_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .eq('is_active', true)
      .single()

    if (connectionError || !connection) {
      return NextResponse.json({ error: 'GA4 connection not found' }, { status: 404 })
    }

    // Check if token needs refresh
    let accessToken = connection.access_token
    const tokenExpiresAt = connection.token_expires_at ? new Date(connection.token_expires_at) : null
    const shouldRefresh = !tokenExpiresAt || tokenExpiresAt < new Date()
    
    if (shouldRefresh) {
      try {
        accessToken = await refreshAccessToken(connection.refresh_token)
        
        const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString()
        await supabase
          .from('ga4_connections')
          .update({
            access_token: accessToken,
            token_expires_at: expiresAt,
          })
          .eq('id', connection.id)
      } catch (error: any) {
        return NextResponse.json(
          { error: `Failed to refresh access token: ${error.message}` },
          { status: 401 }
        )
      }
    }

    // Generate report data based on template
    const reportData: any = {
      metrics: {},
      charts: [],
    }

    // Fetch metrics
    if (template.template_config.metrics) {
      for (const metric of template.template_config.metrics) {
        try {
          const response = await fetchGA4Report(
            connection.property_id,
            accessToken,
            {
              dateRanges: [{ startDate, endDate }],
              metrics: [{ name: metric.name }],
            }
          )
          
          if (response.rows && response.rows.length > 0) {
            reportData.metrics[metric.name] = parseFloat(response.rows[0].metricValues[0].value)
          } else {
            reportData.metrics[metric.name] = 0
          }
        } catch (error: any) {
          console.error(`Error fetching metric ${metric.name}:`, error)
          reportData.metrics[metric.name] = 0
        }
      }
    }

    // Fetch chart data
    if (template.template_config.charts) {
      for (const chart of template.template_config.charts) {
        try {
          const response = await fetchGA4Report(
            connection.property_id,
            accessToken,
            {
              dateRanges: [{ startDate, endDate }],
              metrics: chart.metrics.map((m: string) => ({ name: m })),
              dimensions: chart.dimensions.map((d: string) => ({ name: d })),
            }
          )

          const chartData = response.rows?.map(row => {
            const dataPoint: any = {}
            row.dimensionValues.forEach((dim, i) => {
              if (chart.dimensions[i]) {
                dataPoint[chart.dimensions[i]] = dim.value
              }
            })
            row.metricValues.forEach((metric, i) => {
              if (chart.metrics[i]) {
                dataPoint[chart.metrics[i]] = parseFloat(metric.value)
              }
            })
            return dataPoint
          }) || []

          reportData.charts.push(chartData)
        } catch (error: any) {
          console.error(`Error fetching chart ${chart.title}:`, error)
          reportData.charts.push([])
        }
      }
    }

    return NextResponse.json(reportData)
  } catch (error: any) {
    console.error('Error testing template:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to test template' },
      { status: 500 }
    )
  }
}


import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { fetchGA4Report, refreshAccessToken } from '@/lib/ga4/client'

export async function GET(
  request: Request,
  { params }: { params: { templateId: string } }
) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const propertyId = searchParams.get('propertyId')

  if (!startDate || !endDate || !propertyId) {
    return NextResponse.json(
      { error: 'Missing required parameters: startDate, endDate, propertyId' },
      { status: 400 }
    )
  }

  try {
    // Get template
    const { data: template, error: templateError } = await supabase
      .from('report_templates')
      .select('*')
      .eq('id', params.templateId)
      .eq('is_active', true)
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
        console.log('Refreshing access token...')
        accessToken = await refreshAccessToken(connection.refresh_token)
        
        // Update token in database
        const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString() // 1 hour
        await supabase
          .from('ga4_connections')
          .update({
            access_token: accessToken,
            token_expires_at: expiresAt,
          })
          .eq('id', connection.id)
        
        console.log('Access token refreshed successfully')
      } catch (error: any) {
        console.error('Error refreshing token:', error)
        return NextResponse.json(
          { error: `Failed to refresh access token: ${error.message || 'Unknown error'}. Please reconnect your GA4 account.` },
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
          console.log(`Fetching metric: ${metric.name} for property: ${connection.property_id}`)
          const response = await fetchGA4Report(
            connection.property_id,
            accessToken,
            {
              dateRanges: [{ startDate, endDate }],
              metrics: [{ name: metric.name }],
            }
          )
          
          console.log(`Metric ${metric.name} response:`, JSON.stringify(response, null, 2))
          
          if (response.rows && response.rows.length > 0) {
            const value = response.rows[0].metricValues[0]?.value
            if (value) {
              reportData.metrics[metric.name] = parseFloat(value)
            }
          } else {
            console.warn(`No rows returned for metric ${metric.name}`)
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
          console.log(`Fetching chart: ${chart.title} for property: ${connection.property_id}`)
          const response = await fetchGA4Report(
            connection.property_id,
            accessToken,
            {
              dateRanges: [{ startDate, endDate }],
              metrics: chart.metrics.map((m: string) => ({ name: m })),
              dimensions: chart.dimensions.map((d: string) => ({ name: d })),
            }
          )

          console.log(`Chart ${chart.title} response rows:`, response.rows?.length || 0)

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
          console.log(`Chart ${chart.title} data points:`, chartData.length)
        } catch (error: any) {
          console.error(`Error fetching chart ${chart.title}:`, error.message || error)
          reportData.charts.push([])
        }
      }
    }
    
    console.log('Final report data:', JSON.stringify(reportData, null, 2))

    // Cache the report
    await supabase
      .from('generated_reports')
      .insert({
        user_id: user.id,
        template_id: params.templateId,
        property_id: propertyId,
        report_data: reportData,
        date_range_start: startDate,
        date_range_end: endDate,
      })

    // Update last synced time
    await supabase
      .from('ga4_connections')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', connection.id)

    return NextResponse.json(reportData)
  } catch (error: any) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    )
  }
}


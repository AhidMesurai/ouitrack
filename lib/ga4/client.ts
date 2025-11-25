// Google Analytics Data API v1 client
// This will be used to fetch analytics data

export interface GA4Metric {
  name: string
  value: string
}

export interface GA4Dimension {
  name: string
  value: string
}

export interface GA4Row {
  dimensionValues: GA4Dimension[]
  metricValues: GA4Metric[]
}

export interface GA4ReportResponse {
  rows?: GA4Row[]
  rowCount?: number
  metadata?: {
    currencyCode?: string
    timeZone?: string
  }
}

export async function fetchGA4Report(
  propertyId: string,
  accessToken: string,
  request: {
    dateRanges: [{ startDate: string; endDate: string }]
    metrics: [{ name: string }]
    dimensions?: [{ name: string }]
  }
): Promise<GA4ReportResponse> {
  // Extract just the property ID number if it's in format "properties/123456"
  const cleanPropertyId = propertyId.replace('properties/', '')
  
  const requestBody = {
    dateRanges: request.dateRanges,
    metrics: request.metrics,
    dimensions: request.dimensions || [],
  }
  
  console.log(`GA4 API Request to properties/${cleanPropertyId}:runReport`, JSON.stringify(requestBody, null, 2))
  
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${cleanPropertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error('GA4 API Error:', {
      status: response.status,
      statusText: response.statusText,
      error,
    })
    throw new Error(error.error?.message || `Failed to fetch GA4 data: ${response.statusText}`)
  }

  const data = await response.json()
  console.log(`GA4 API Response: ${data.rows?.length || 0} rows returned`)
  return data
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GA4_CLIENT_ID!,
      client_secret: process.env.GA4_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Token refresh error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    })
    throw new Error(`Failed to refresh access token: ${errorData.error || response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}


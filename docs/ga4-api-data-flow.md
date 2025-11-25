# How We Get Analytics Data from Google Analytics API

This document explains the complete flow of how OuiTrack fetches analytics data (sessions, users, etc.) from Google Analytics 4 (GA4) API.

## Overview

The process involves:
1. **OAuth Authentication** - User connects their Google Analytics account
2. **Token Storage** - We store access/refresh tokens securely
3. **API Calls** - We make requests to Google Analytics Data API
4. **Data Processing** - We format and return the data to the frontend

---

## Step-by-Step Flow

### Step 1: User Connects GA4 Account (OAuth Flow)

**File:** `app/api/ga4/callback/route.ts`

When a user clicks "Connect GA4 Account":

1. **User is redirected to Google OAuth**
   - URL: `https://accounts.google.com/o/oauth2/v2/auth`
   - Scopes requested:
     - `https://www.googleapis.com/auth/analytics.readonly` - Read analytics data
     - `https://www.googleapis.com/auth/analytics.manage.users.readonly` - List properties

2. **Google returns authorization code**
   - User grants permission
   - Google redirects back with a `code` parameter

3. **We exchange code for tokens**
   ```typescript
   // Exchange authorization code for access token and refresh token
   const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
     method: 'POST',
     body: new URLSearchParams({
       code,                    // Authorization code from Google
       client_id: '...',        // Our OAuth client ID
       client_secret: '...',    // Our OAuth client secret
       redirect_uri: '...',     // Our callback URL
       grant_type: 'authorization_code',
     }),
   })
   
   const { access_token, refresh_token, expires_in } = await tokenResponse.json()
   ```

4. **We fetch user's GA4 properties**
   ```typescript
   // Get list of all GA4 properties the user has access to
   const propertiesResponse = await fetch(
     'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
     {
       headers: {
         'Authorization': `Bearer ${access_token}`,
       },
     }
   )
   ```

5. **We store tokens and properties in database**
   - Access token (expires in 1 hour)
   - Refresh token (long-lived, used to get new access tokens)
   - Property IDs and names
   - Stored in `ga4_connections` table

---

### Step 2: Fetching Analytics Data

**File:** `lib/ga4/client.ts` - `fetchGA4Report()`

When a user views a report, we make API calls to get the actual analytics data:

#### The API Endpoint

Google Analytics Data API v1 endpoint:
```
POST https://analyticsdata.googleapis.com/v1beta/properties/{PROPERTY_ID}:runReport
```

#### Request Structure

```typescript
{
  dateRanges: [
    {
      startDate: "2024-01-01",  // YYYY-MM-DD format
      endDate: "2024-01-31"
    }
  ],
  metrics: [
    { name: "sessions" },      // What to measure
    { name: "users" },
    { name: "pageviews" }
  ],
  dimensions: [                 // Optional: How to group the data
    { name: "date" },          // Group by date
    { name: "country" }        // Group by country
  ]
}
```

#### Example: Getting Total Sessions

```typescript
// In lib/ga4/client.ts
export async function fetchGA4Report(
  propertyId: string,      // e.g., "123456789"
  accessToken: string,     // OAuth access token
  request: {
    dateRanges: [{ startDate: string; endDate: string }],
    metrics: [{ name: string }],
    dimensions?: [{ name: string }]
  }
) {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,  // Authenticate request
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: request.dateRanges,
        metrics: request.metrics,
        dimensions: request.dimensions || [],
      }),
    }
  )
  
  return await response.json()
}
```

#### Response Structure

```json
{
  "rows": [
    {
      "dimensionValues": [
        { "value": "2024-01-01" }  // If dimension was "date"
      ],
      "metricValues": [
        { "value": "1250" }        // Sessions count
      ]
    },
    {
      "dimensionValues": [{ "value": "2024-01-02" }],
      "metricValues": [{ "value": "1380" }]
    }
  ],
  "rowCount": 31,
  "metadata": {
    "currencyCode": "USD",
    "timeZone": "America/New_York"
  }
}
```

---

### Step 3: Report Generation Flow

**File:** `app/api/reports/generate/[templateId]/route.ts`

When a user views a report:

1. **Get the template** from database
   - Template defines which metrics and charts to show
   - Example: "Website Performance Overview" template might request:
     - Metrics: `sessions`, `users`, `bounceRate`
     - Charts: Sessions over time (line chart with `date` dimension)

2. **Get user's GA4 connection**
   - Retrieve stored access token and refresh token
   - Check if access token is expired

3. **Refresh token if needed**
   ```typescript
   if (tokenExpiresAt < new Date()) {
     // Access token expired, get a new one using refresh token
     accessToken = await refreshAccessToken(refreshToken)
   }
   ```

4. **Fetch metrics** (one API call per metric)
   ```typescript
   for (const metric of template.metrics) {
     const response = await fetchGA4Report(propertyId, accessToken, {
       dateRanges: [{ startDate, endDate }],
       metrics: [{ name: metric.name }],  // e.g., "sessions"
     })
     
     // Extract the value
     const value = response.rows[0].metricValues[0].value
     reportData.metrics[metric.name] = parseFloat(value)
   }
   ```

5. **Fetch chart data** (one API call per chart)
   ```typescript
   for (const chart of template.charts) {
     const response = await fetchGA4Report(propertyId, accessToken, {
       dateRanges: [{ startDate, endDate }],
       metrics: chart.metrics.map(m => ({ name: m })),      // ["sessions", "users"]
       dimensions: chart.dimensions.map(d => ({ name: d })), // ["date"]
     })
     
     // Transform rows into chart data
     const chartData = response.rows.map(row => ({
       date: row.dimensionValues[0].value,      // "2024-01-01"
       sessions: parseFloat(row.metricValues[0].value),  // 1250
       users: parseFloat(row.metricValues[1].value)      // 980
     }))
     
     reportData.charts.push(chartData)
   }
   ```

6. **Return formatted data to frontend**
   ```json
   {
     "metrics": {
       "sessions": 38500,
       "users": 12500,
       "bounceRate": 45.2
     },
     "charts": [
       [
         { "date": "2024-01-01", "sessions": 1250, "users": 980 },
         { "date": "2024-01-02", "sessions": 1380, "users": 1050 }
       ]
     ]
   }
   ```

---

## Available Metrics

**File:** `lib/ga4/metrics.ts`

Common metrics we can fetch:

- **Traffic Metrics:**
  - `sessions` - Number of sessions
  - `users` - Number of distinct users
  - `newUsers` - Number of new users
  - `activeUsers` - Active users

- **Engagement Metrics:**
  - `screenPageViews` / `pageviews` - Page views
  - `averageSessionDuration` - Average session length
  - `bounceRate` - Bounce rate percentage
  - `engagementRate` - Engagement rate percentage

- **Conversion Metrics:**
  - `conversions` - Number of conversions
  - `eventCount` - Total events

- **Revenue Metrics:**
  - `totalRevenue` - Total revenue
  - `purchaseRevenue` - Purchase revenue

---

## Available Dimensions

**File:** `lib/ga4/dimensions.ts`

Common dimensions for grouping data:

- **Time:**
  - `date` - Date (YYYYMMDD)
  - `year`, `month`, `week`, `day`, `hour`

- **Traffic Source:**
  - `sessionSource` - Traffic source (google, direct, etc.)
  - `sessionMedium` - Medium (organic, cpc, etc.)
  - `sessionCampaign` - Campaign name

- **Geography:**
  - `country` - Country
  - `region` - Region/state
  - `city` - City

- **Technology:**
  - `deviceCategory` - Desktop, mobile, tablet
  - `operatingSystem` - OS name
  - `browser` - Browser name

- **Content:**
  - `pagePath` - Page URL path
  - `pageTitle` - Page title
  - `landingPage` - Landing page

---

## Token Refresh Mechanism

**File:** `lib/ga4/client.ts` - `refreshAccessToken()`

Access tokens expire after 1 hour. We automatically refresh them:

```typescript
export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GA4_CLIENT_ID!,
      client_secret: process.env.GA4_CLIENT_SECRET!,
      refresh_token: refreshToken,  // Long-lived token
      grant_type: 'refresh_token',
    }),
  })
  
  const data = await response.json()
  return data.access_token  // New access token (valid for 1 hour)
}
```

---

## Security Considerations

1. **Tokens are stored server-side only**
   - Access tokens and refresh tokens never exposed to frontend
   - Stored in Supabase database with RLS policies

2. **Token refresh happens automatically**
   - We check token expiration before each API call
   - Refresh happens server-side only

3. **User-specific data**
   - Each user can only access their own GA4 properties
   - Database queries filtered by `user_id`

---

## Example: Complete Flow

**User wants to see "Sessions Over Time" chart:**

1. Frontend calls: `GET /api/reports/generate/template-123?startDate=2024-01-01&endDate=2024-01-31&propertyId=123456789`

2. Backend:
   - Gets template from database
   - Gets user's GA4 connection (with tokens)
   - Refreshes token if expired
   - Calls GA4 API:
     ```json
     POST https://analyticsdata.googleapis.com/v1beta/properties/123456789:runReport
     {
       "dateRanges": [{"startDate": "2024-01-01", "endDate": "2024-01-31"}],
       "metrics": [{"name": "sessions"}],
       "dimensions": [{"name": "date"}]
     }
     ```

3. Google returns:
   ```json
   {
     "rows": [
       {"dimensionValues": [{"value": "20240101"}], "metricValues": [{"value": "1250"}]},
       {"dimensionValues": [{"value": "20240102"}], "metricValues": [{"value": "1380"}]}
     ]
   }
   ```

4. Backend transforms to:
   ```json
   {
     "charts": [[
       {"date": "20240101", "sessions": 1250},
       {"date": "20240102", "sessions": 1380}
     ]]
   }
   ```

5. Frontend displays the chart using Recharts library

---

## Key Files

- **OAuth Connection:** `app/api/ga4/callback/route.ts`
- **API Client:** `lib/ga4/client.ts`
- **Report Generation:** `app/api/reports/generate/[templateId]/route.ts`
- **Metric Definitions:** `lib/ga4/metrics.ts`
- **Dimension Definitions:** `lib/ga4/dimensions.ts`

---

## Google Analytics API Documentation

- **Data API v1:** https://developers.google.com/analytics/devguides/reporting/data/v1
- **Admin API v1:** https://developers.google.com/analytics/devguides/config/admin/v1
- **Available Metrics:** https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics
- **Available Dimensions:** https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions


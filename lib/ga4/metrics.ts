// Comprehensive GA4 Metrics List
// Source: https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema

export interface GA4Metric {
  name: string
  label: string
  description: string
  category: string
  format: 'number' | 'percentage' | 'currency' | 'duration' | 'decimal'
}

export const GA4_METRICS: GA4Metric[] = [
  // Traffic Metrics
  {
    name: 'sessions',
    label: 'Sessions',
    description: 'The number of sessions that began on your site or app',
    category: 'Traffic',
    format: 'number',
  },
  {
    name: 'users',
    label: 'Users',
    description: 'The number of distinct users who visited your site or app',
    category: 'Traffic',
    format: 'number',
  },
  {
    name: 'newUsers',
    label: 'New Users',
    description: 'The number of users who interacted with your site or launched your app for the first time',
    category: 'Traffic',
    format: 'number',
  },
  {
    name: 'activeUsers',
    label: 'Active Users',
    description: 'The number of distinct users who visited your site or app',
    category: 'Traffic',
    format: 'number',
  },
  {
    name: 'totalUsers',
    label: 'Total Users',
    description: 'The total number of users',
    category: 'Traffic',
    format: 'number',
  },

  // Engagement Metrics
  {
    name: 'screenPageViews',
    label: 'Page Views',
    description: 'The number of app screens or web pages your users viewed',
    category: 'Engagement',
    format: 'number',
  },
  {
    name: 'pageviews',
    label: 'Pageviews',
    description: 'The number of pages viewed',
    category: 'Engagement',
    format: 'number',
  },
  {
    name: 'screenPageViewsPerSession',
    label: 'Pages per Session',
    description: 'The average number of pages or screens per session',
    category: 'Engagement',
    format: 'decimal',
  },
  {
    name: 'averageSessionDuration',
    label: 'Avg Session Duration',
    description: 'The average length of a session',
    category: 'Engagement',
    format: 'duration',
  },
  {
    name: 'bounceRate',
    label: 'Bounce Rate',
    description: 'The percentage of sessions that were not engaged sessions',
    category: 'Engagement',
    format: 'percentage',
  },
  {
    name: 'engagementRate',
    label: 'Engagement Rate',
    description: 'The percentage of engaged sessions',
    category: 'Engagement',
    format: 'percentage',
  },
  {
    name: 'engagedSessions',
    label: 'Engaged Sessions',
    description: 'The number of sessions that lasted 10 seconds or longer, had 1 or more conversion events, or 2 or more page or screen views',
    category: 'Engagement',
    format: 'number',
  },
  {
    name: 'eventCount',
    label: 'Event Count',
    description: 'The number of events',
    category: 'Engagement',
    format: 'number',
  },
  {
    name: 'conversions',
    label: 'Conversions',
    description: 'The number of conversion events',
    category: 'Conversions',
    format: 'number',
  },
  {
    name: 'totalRevenue',
    label: 'Total Revenue',
    description: 'Sum of revenue from purchases, subscriptions, and advertising',
    category: 'Revenue',
    format: 'currency',
  },
  {
    name: 'purchaseRevenue',
    label: 'Purchase Revenue',
    description: 'Revenue from purchases',
    category: 'Revenue',
    format: 'currency',
  },
  {
    name: 'advertisingRevenue',
    label: 'Advertising Revenue',
    description: 'Revenue from advertising',
    category: 'Revenue',
    format: 'currency',
  },
  {
    name: 'adUnitExposure',
    label: 'Ad Unit Exposure',
    description: 'The number of times your ads were shown to users',
    category: 'Advertising',
    format: 'number',
  },
]

export const GA4_METRICS_BY_CATEGORY = GA4_METRICS.reduce((acc, metric) => {
  if (!acc[metric.category]) {
    acc[metric.category] = []
  }
  acc[metric.category].push(metric)
  return acc
}, {} as Record<string, GA4Metric[]>)

export function getMetricByName(name: string): GA4Metric | undefined {
  return GA4_METRICS.find(m => m.name === name)
}

export function searchMetrics(query: string): GA4Metric[] {
  const lowerQuery = query.toLowerCase()
  return GA4_METRICS.filter(
    metric =>
      metric.name.toLowerCase().includes(lowerQuery) ||
      metric.label.toLowerCase().includes(lowerQuery) ||
      metric.description.toLowerCase().includes(lowerQuery)
  )
}


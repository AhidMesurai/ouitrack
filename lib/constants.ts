// Google OAuth Scopes
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
]

// Standard GA4 Metrics (legacy - use lib/ga4/metrics.ts for comprehensive list)
export const STANDARD_METRICS = [
  'sessions',
  'users',
  'newUsers',
  'bounceRate',
  'sessionDuration',
  'conversions',
  'pageviews',
]

// Standard GA4 Dimensions (legacy - use lib/ga4/dimensions.ts for comprehensive list)
export const STANDARD_DIMENSIONS = [
  'date',
  'source',
  'medium',
  'pagePath',
  'deviceCategory',
  'country',
]

// Re-export from comprehensive lists
export { GA4_METRICS, GA4_METRICS_BY_CATEGORY, getMetricByName, searchMetrics } from './ga4/metrics'
export { GA4_DIMENSIONS, GA4_DIMENSIONS_BY_CATEGORY, getDimensionByName, searchDimensions } from './ga4/dimensions'
export { validateChartConfig, isCompatible, getRecommendedDimensions, CHART_TYPE_REQUIREMENTS } from './ga4/compatibility'


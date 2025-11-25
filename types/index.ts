export interface UserProfile {
  id: string
  role: 'admin' | 'client'
  company_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface GA4Connection {
  id: string
  user_id: string
  property_id: string
  property_name: string
  access_token: string
  refresh_token: string
  token_expires_at: string | null
  connected_at: string
  last_synced_at: string | null
  is_active: boolean
}

export interface ReportTemplate {
  id: string
  name: string
  description: string | null
  template_config: {
    charts: ChartConfig[]
    metrics: MetricConfig[]
    timeframe: 'last_7_days' | 'last_30_days' | 'last_90_days'
  }
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'table'
  title: string
  metrics: string[]
  dimensions: string[]
  filters?: FilterConfig[]
}

export interface MetricConfig {
  name: string
  label: string
  format?: 'number' | 'percentage' | 'currency' | 'duration'
}

export interface FilterConfig {
  dimension: string
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith'
  value: string
}

export interface GeneratedReport {
  id: string
  user_id: string
  template_id: string
  property_id: string
  report_data: {
    metrics: Record<string, any>
    charts: Record<string, any>
    generated_at: string
  }
  date_range_start: string
  date_range_end: string
  generated_at: string
  expires_at: string
}

export interface GA4ReportRequest {
  property: string
  dateRanges: [{ startDate: string; endDate: string }]
  metrics: [{ name: string }]
  dimensions?: [{ name: string }]
}


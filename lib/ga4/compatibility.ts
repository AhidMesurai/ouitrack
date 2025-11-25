// GA4 Metric and Dimension Compatibility
// Some metrics and dimensions cannot be used together in the same query

export interface CompatibilityRule {
  metric?: string
  dimension?: string
  incompatibleWith?: string[]
  reason?: string
}

// Known incompatibilities
const INCOMPATIBILITIES: CompatibilityRule[] = [
  // Some dimensions require specific metrics
  {
    dimension: 'userId',
    incompatibleWith: ['newUsers'], // userId dimension can't be used with newUsers metric
    reason: 'User ID dimension is not compatible with new users metric',
  },
]

// Chart type requirements
export const CHART_TYPE_REQUIREMENTS = {
  line: {
    minDimensions: 1,
    maxDimensions: 2,
    minMetrics: 1,
    maxMetrics: 5,
    recommendedDimensions: ['date'],
  },
  bar: {
    minDimensions: 1,
    maxDimensions: 2,
    minMetrics: 1,
    maxMetrics: 5,
    recommendedDimensions: ['source', 'medium', 'pagePath', 'deviceCategory'],
  },
  pie: {
    minDimensions: 1,
    maxDimensions: 1,
    minMetrics: 1,
    maxMetrics: 1,
    recommendedDimensions: ['deviceCategory', 'medium', 'country'],
  },
  table: {
    minDimensions: 1,
    maxDimensions: 5,
    minMetrics: 1,
    maxMetrics: 10,
    recommendedDimensions: ['pagePath', 'source', 'medium'],
  },
}

export function isCompatible(metric: string, dimension: string): boolean {
  const rule = INCOMPATIBILITIES.find(
    r => (r.metric === metric && r.dimension === dimension) || (r.dimension === dimension && r.incompatibleWith?.includes(metric))
  )
  return !rule
}

export function validateChartConfig(
  type: 'line' | 'bar' | 'pie' | 'table',
  metrics: string[],
  dimensions: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const requirements = CHART_TYPE_REQUIREMENTS[type]

  // Check dimension count
  if (dimensions.length < requirements.minDimensions) {
    errors.push(`${type} charts require at least ${requirements.minDimensions} dimension(s)`)
  }
  if (dimensions.length > requirements.maxDimensions) {
    errors.push(`${type} charts support at most ${requirements.maxDimensions} dimension(s)`)
  }

  // Check metric count
  if (metrics.length < requirements.minMetrics) {
    errors.push(`${type} charts require at least ${requirements.minMetrics} metric(s)`)
  }
  if (metrics.length > requirements.maxMetrics) {
    errors.push(`${type} charts support at most ${requirements.maxMetrics} metric(s)`)
  }

  // Check compatibility
  for (const metric of metrics) {
    for (const dimension of dimensions) {
      if (!isCompatible(metric, dimension)) {
        errors.push(`Metric "${metric}" is not compatible with dimension "${dimension}"`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function getRecommendedDimensions(chartType: 'line' | 'bar' | 'pie' | 'table'): string[] {
  return CHART_TYPE_REQUIREMENTS[chartType].recommendedDimensions || []
}


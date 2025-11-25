// Template Validation Utilities
import { ReportTemplate, ChartConfig, MetricConfig } from '@/types'
import { validateChartConfig as validateChart, CHART_TYPE_REQUIREMENTS } from './ga4/compatibility'
import { getMetricByName } from './ga4/metrics'
import { getDimensionByName } from './ga4/dimensions'

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

export function validateTemplate(template: Partial<ReportTemplate>): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Validate basic info
  if (!template.name || template.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Template name is required',
      severity: 'error',
    })
  }

  if (template.name && template.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Template name must be 100 characters or less',
      severity: 'error',
    })
  }

  // Validate template config
  if (!template.template_config) {
    errors.push({
      field: 'template_config',
      message: 'Template configuration is required',
      severity: 'error',
    })
    return { valid: false, errors, warnings }
  }

  const config = template.template_config

  // Validate metrics
  if (!config.metrics || config.metrics.length === 0) {
    errors.push({
      field: 'metrics',
      message: 'At least one metric is required',
      severity: 'error',
    })
  } else {
    config.metrics.forEach((metric, index) => {
      if (!metric.name || metric.name.trim().length === 0) {
        errors.push({
          field: `metrics[${index}].name`,
          message: 'Metric name is required',
          severity: 'error',
        })
      } else {
        const metricDef = getMetricByName(metric.name)
        if (!metricDef) {
          warnings.push({
            field: `metrics[${index}].name`,
            message: `Unknown metric: ${metric.name}`,
            severity: 'warning',
          })
        }
      }

      if (!metric.label || metric.label.trim().length === 0) {
        errors.push({
          field: `metrics[${index}].label`,
          message: 'Metric label is required',
          severity: 'error',
        })
      }
    })
  }

  // Validate charts
  if (!config.charts || config.charts.length === 0) {
    warnings.push({
      field: 'charts',
      message: 'No charts defined. The report will only show metrics.',
      severity: 'warning',
    })
  } else {
    config.charts.forEach((chart, index) => {
      const chartErrors = validateChartConfig(chart, index)
      errors.push(...chartErrors.filter(e => e.severity === 'error'))
      warnings.push(...chartErrors.filter(e => e.severity === 'warning'))
    })
  }

  // Validate timeframe
  if (config.timeframe && !['last_7_days', 'last_30_days', 'last_90_days'].includes(config.timeframe)) {
    errors.push({
      field: 'timeframe',
      message: 'Invalid timeframe. Must be last_7_days, last_30_days, or last_90_days',
      severity: 'error',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

function validateChartConfig(chart: ChartConfig, index: number): ValidationError[] {
  const errors: ValidationError[] = []

  // Validate chart type
  if (!chart.type || !['line', 'bar', 'pie', 'table'].includes(chart.type)) {
    errors.push({
      field: `charts[${index}].type`,
      message: 'Invalid chart type. Must be line, bar, pie, or table',
      severity: 'error',
    })
    return errors
  }

  // Validate title
  if (!chart.title || chart.title.trim().length === 0) {
    errors.push({
      field: `charts[${index}].title`,
      message: 'Chart title is required',
      severity: 'error',
    })
  }

  // Validate metrics
  if (!chart.metrics || chart.metrics.length === 0) {
    errors.push({
      field: `charts[${index}].metrics`,
      message: 'At least one metric is required for charts',
      severity: 'error',
    })
  } else {
    chart.metrics.forEach((metric, mIndex) => {
      const metricDef = getMetricByName(metric)
      if (!metricDef) {
        errors.push({
          field: `charts[${index}].metrics[${mIndex}]`,
          message: `Unknown metric: ${metric}`,
          severity: 'error',
        })
      }
    })
  }

  // Validate dimensions
  if (!chart.dimensions || chart.dimensions.length === 0) {
    errors.push({
      field: `charts[${index}].dimensions`,
      message: 'At least one dimension is required for charts',
      severity: 'error',
    })
  } else {
    chart.dimensions.forEach((dimension, dIndex) => {
      const dimensionDef = getDimensionByName(dimension)
      if (!dimensionDef) {
        errors.push({
          field: `charts[${index}].dimensions[${dIndex}]`,
          message: `Unknown dimension: ${dimension}`,
          severity: 'error',
        })
      }
    })
  }

  // Validate chart type requirements
  if (chart.type && chart.metrics && chart.dimensions) {
    const validation = validateChart(chart.type, chart.metrics, chart.dimensions)
    if (!validation.valid) {
      validation.errors.forEach(error => {
        errors.push({
          field: `charts[${index}]`,
          message: error,
          severity: 'error',
        })
      })
    }
  }

  // Validate filters
  if (chart.filters) {
    chart.filters.forEach((filter, fIndex) => {
      if (!filter.dimension || filter.dimension.trim().length === 0) {
        errors.push({
          field: `charts[${index}].filters[${fIndex}].dimension`,
          message: 'Filter dimension is required',
          severity: 'error',
        })
      }

      if (!filter.operator || !['equals', 'contains', 'startsWith', 'endsWith'].includes(filter.operator)) {
        errors.push({
          field: `charts[${index}].filters[${fIndex}].operator`,
          message: 'Invalid filter operator',
          severity: 'error',
        })
      }

      if (filter.value === undefined || filter.value === null) {
        errors.push({
          field: `charts[${index}].filters[${fIndex}].value`,
          message: 'Filter value is required',
          severity: 'error',
        })
      }
    })
  }

  return errors
}

export function getValidationSummary(result: ValidationResult): string {
  if (result.valid && result.warnings.length === 0) {
    return 'Template is valid'
  }

  const errorCount = result.errors.length
  const warningCount = result.warnings.length

  if (errorCount > 0 && warningCount > 0) {
    return `${errorCount} error(s) and ${warningCount} warning(s) found`
  } else if (errorCount > 0) {
    return `${errorCount} error(s) found`
  } else {
    return `${warningCount} warning(s) found`
  }
}


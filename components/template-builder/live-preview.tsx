'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/reports/metric-card'
import { ChartContainer } from '@/components/reports/chart-container'
import { ReportTemplate, MetricConfig } from '@/types'
import { getMetricByName } from '@/lib/ga4/metrics'

interface LivePreviewProps {
  template: Partial<ReportTemplate>
}

// Generate mock data for preview
function generateMockData(chart: any) {
  const data: any[] = []
  const dimensionValues = ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5']

  dimensionValues.forEach((dimValue, index) => {
    const dataPoint: any = {}
    
    // Add dimension values
    chart.dimensions.forEach((dim: string, dimIndex: number) => {
      if (dim === 'date') {
        const date = new Date()
        date.setDate(date.getDate() - (dimensionValues.length - index))
        // Format as YYYYMMDD to match GA4 API format
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        dataPoint[dim] = `${year}${month}${day}`
      } else {
        dataPoint[dim] = `${dimValue} ${dimIndex > 0 ? dimIndex + 1 : ''}`.trim()
      }
    })

    // Add metric values with some variation
    chart.metrics.forEach((metric: string) => {
      const baseValue = 100 + Math.random() * 200
      dataPoint[metric] = Math.round(baseValue * (1 + index * 0.2))
    })

    data.push(dataPoint)
  })

  return data
}

export function LivePreview({ template }: LivePreviewProps) {
  const mockMetrics = useMemo(() => {
    if (!template.template_config?.metrics) return {}
    
    const metrics: Record<string, number> = {}
    template.template_config.metrics.forEach((metric: MetricConfig) => {
      const baseValue = 1000 + Math.random() * 5000
      metrics[metric.name] = Math.round(baseValue)
    })
    return metrics
  }, [template.template_config?.metrics])

  const mockCharts = useMemo(() => {
    if (!template.template_config?.charts) return []
    
    return template.template_config.charts.map((chart) => generateMockData(chart))
  }, [template.template_config?.charts])

  if (!template.template_config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Start building your template to see a preview</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preview: {template.name || 'Untitled Template'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metrics Preview */}
          {template.template_config.metrics && template.template_config.metrics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {template.template_config.metrics.map((metric: MetricConfig, index: number) => {
                  const metricDef = getMetricByName(metric.name)
                  return (
                    <MetricCard
                      key={`metric-${metric.name}-${index}`}
                      title={metric.label}
                      value={mockMetrics[metric.name] || 0}
                      format={(() => {
                        const format = metric.format || metricDef?.format || 'number'
                        return format === 'decimal' ? 'number' : format as 'number' | 'percentage' | 'currency' | 'duration'
                      })()}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Charts Preview */}
          {template.template_config.charts && template.template_config.charts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Charts</h3>
              <div className="space-y-6">
                {template.template_config.charts.map((chart, index) => (
                  <ChartContainer
                    key={index}
                    config={chart}
                    data={mockCharts[index] || []}
                  />
                ))}
              </div>
            </div>
          )}

          {(!template.template_config.metrics || template.template_config.metrics.length === 0) &&
            (!template.template_config.charts || template.template_config.charts.length === 0) && (
              <p className="text-gray-500 text-center py-8">
                Add metrics or charts to see a preview
              </p>
            )}
        </CardContent>
      </Card>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ReportTemplate } from '@/types'
import { MetricCard } from '@/components/reports/metric-card'
import { ChartContainer } from '@/components/reports/chart-container'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { format, subDays } from 'date-fns'

interface GA4Property {
  id: string
  name: string
}

interface TestPanelProps {
  template: Partial<ReportTemplate>
}

export function TestPanel({ template }: TestPanelProps) {
  const [properties, setProperties] = useState<GA4Property[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30))
  const [endDate, setEndDate] = useState<Date>(new Date())

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/ga4/properties')
      if (response.ok) {
        const data = await response.json()
        if (data.properties && Array.isArray(data.properties)) {
          setProperties(data.properties)
          if (data.properties.length > 0) {
            setSelectedPropertyId(data.properties[0].id)
          }
        }
      }
    } catch (err) {
      console.error('Error fetching properties:', err)
    }
  }

  const handleTest = async () => {
    if (!template.id || !selectedPropertyId) {
      setError('Template ID and property are required')
      return
    }

    setLoading(true)
    setError(null)
    setTestResults(null)

    try {
      const startDateStr = format(startDate, 'yyyy-MM-dd')
      const endDateStr = format(endDate, 'yyyy-MM-dd')

      const response = await fetch('/api/admin/templates/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          propertyId: selectedPropertyId,
          startDate: startDateStr,
          endDate: endDateStr,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to test template')
      }

      const data = await response.json()
      setTestResults(data)
    } catch (err: any) {
      setError(err.message || 'Failed to test template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test with Real Data</CardTitle>
        <CardDescription>Test your template with actual GA4 data before saving</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {properties.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              No GA4 properties connected. Please connect a GA4 account first.
            </p>
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="test-property">GA4 Property</Label>
              <Select
                id="test-property"
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="mt-1"
              >
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.name} ({prop.id.split('/')[1]})
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test-start-date">Start Date</Label>
                <input
                  id="test-start-date"
                  type="date"
                  value={format(startDate, 'yyyy-MM-dd')}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="test-end-date">End Date</Label>
                <input
                  id="test-end-date"
                  type="date"
                  value={format(endDate, 'yyyy-MM-dd')}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <Button
              onClick={handleTest}
              disabled={loading || !template.id || !selectedPropertyId}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Template'
              )}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Test Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {testResults && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Test Successful!</p>
                      <p className="text-sm text-green-700 mt-1">
                        Template generated successfully with real GA4 data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display test results */}
                {template.template_config?.metrics && template.template_config.metrics.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {template.template_config.metrics.map((metric, index) => (
                        <MetricCard
                          key={`test-metric-${metric.name}-${index}`}
                          title={metric.label}
                          value={testResults.metrics?.[metric.name] || 0}
                          format={metric.format || 'number'}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {template.template_config?.charts && template.template_config.charts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Charts</h4>
                    <div className="space-y-6">
                      {template.template_config.charts.map((chart, index) => (
                        <ChartContainer
                          key={index}
                          config={chart}
                          data={testResults.charts?.[index] || []}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}


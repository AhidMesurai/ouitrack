'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { DateRangePicker } from '@/components/reports/date-range-picker'
import { MetricCard } from '@/components/reports/metric-card'
import { ChartContainer } from '@/components/reports/chart-container'
import { ExportButton } from '@/components/reports/export-button'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ReportTemplate } from '@/types'
import { format, subDays } from 'date-fns'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function ReportViewerPage() {
  const params = useParams()
  const templateId = params.id as string
  const [template, setTemplate] = useState<ReportTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30))
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [reportData, setReportData] = useState<any>(null)
  const [properties, setProperties] = useState<Array<{ id: string; name: string }>>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch('/api/reports/templates')
        if (response.ok) {
          const templates = await response.json()
          const found = templates.find((t: ReportTemplate) => t.id === templateId)
          setTemplate(found || null)
        }
      } catch (error) {
        console.error('Error fetching template:', error)
      } finally {
        setLoading(false)
      }
    }

    if (templateId) {
      fetchTemplate()
    }
  }, [templateId])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/ga4/properties')
        if (response.ok) {
          const data = await response.json()
          const props = data.properties || []
          setProperties(props)
          if (props.length > 0 && !selectedPropertyId) {
            setSelectedPropertyId(props[0].id)
          }
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      }
    }

    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDateRangeChange = async (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
    
    if (!selectedPropertyId) {
      console.error('No property selected')
      return
    }
    
    // Fetch report data
    try {
      const startDateStr = format(start, 'yyyy-MM-dd')
      const endDateStr = format(end, 'yyyy-MM-dd')
      
      const reportRes = await fetch(
        `/api/reports/generate/${templateId}?startDate=${startDateStr}&endDate=${endDateStr}&propertyId=${selectedPropertyId}`
      )
      
      if (reportRes.ok) {
        const data = await reportRes.json()
        setReportData(data)
      } else {
        const errorData = await reportRes.json().catch(() => ({}))
        console.error('Error generating report:', errorData)
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    }
  }
  
  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId)
    // Reload report data with new property
    handleDateRangeChange(startDate, endDate)
  }
  
  // Load initial report data when template and property are loaded
  useEffect(() => {
    if (template && selectedPropertyId) {
      handleDateRangeChange(startDate, endDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, selectedPropertyId])

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (!template) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="text-center py-12">
            <p className="text-gray-500">Report template not found.</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div id="report-content" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
              {template.description && (
                <p className="mt-2 text-gray-600">{template.description}</p>
              )}
            </div>
            <ExportButton elementId="report-content" filename={template.name} />
          </div>

          <div className="flex justify-between items-center">
            {properties.length > 0 && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Property:</label>
                <select
                  value={selectedPropertyId || ''}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <DateRangePicker
              onDateRangeChange={handleDateRangeChange}
              defaultRange={{ start: startDate, end: endDate }}
            />
          </div>

          {/* Metrics */}
          {template.template_config.metrics && template.template_config.metrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {template.template_config.metrics.map((metric) => (
                <MetricCard
                  key={metric.name}
                  title={metric.label}
                  value={reportData?.metrics?.[metric.name] || 0}
                  format={metric.format}
                />
              ))}
            </div>
          )}

          {/* Charts */}
          {template.template_config.charts && template.template_config.charts.length > 0 && (
            <div className="space-y-6">
              {template.template_config.charts.map((chart, index) => (
                <ChartContainer
                  key={index}
                  config={chart}
                  data={reportData?.charts?.[index] || []}
                />
              ))}
            </div>
          )}

          {properties.length === 0 && (
            <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium mb-2">No GA4 Properties Connected</p>
              <p className="text-yellow-700 text-sm">Please connect your GA4 account to generate reports.</p>
            </div>
          )}
          
          {properties.length > 0 && !reportData && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Loading report data...</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


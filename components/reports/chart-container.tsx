'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartConfig } from '@/types'

interface ChartContainerProps {
  config: ChartConfig
  data: any[]
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export function ChartContainer({ config, data }: ChartContainerProps) {
  // Get the first dimension to use as the X-axis/label key
  const primaryDimension = config.dimensions?.[0] || 'name'
  
  // Sort data by date if the primary dimension is 'date'
  const sortedData = useMemo(() => {
    if (primaryDimension === 'date' && data.length > 0) {
      return [...data].sort((a, b) => {
        const dateA = a[primaryDimension] || ''
        const dateB = b[primaryDimension] || ''
        // Compare YYYYMMDD format strings directly (they sort correctly as strings)
        return dateA.localeCompare(dateB)
      })
    }
    return data
  }, [data, primaryDimension])
  
  // Format dimension values for display (truncate long paths, format dates, etc.)
  const formatDimensionValue = (value: string, dimension: string): string => {
    if (!value) return '-'
    
    // Format page paths - show only the last part if it's long
    if (dimension === 'pagePath' || dimension === 'pageLocation') {
      if (value.length > 30) {
        return '...' + value.slice(-27)
      }
      return value
    }
    
    // Format dates - GA4 returns dates as YYYYMMDD (e.g., "20240101")
    if (dimension === 'date' && value.length === 8 && /^\d{8}$/.test(value)) {
      const year = value.slice(0, 4)
      const month = value.slice(4, 6)
      const day = value.slice(6, 8)
      // Format as MM/DD/YY for display
      return `${month}/${day}/${year.slice(2)}`
    }
    
    return value
  }

  const renderChart = () => {
    switch (config.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sortedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={primaryDimension}
                tickFormatter={(value) => formatDimensionValue(value, primaryDimension)}
                angle={primaryDimension === 'date' ? 0 : -45}
                textAnchor={primaryDimension === 'date' ? 'middle' : 'end'}
                height={primaryDimension === 'date' ? 60 : 80}
                interval={primaryDimension === 'date' ? 'preserveStartEnd' : 0}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => {
                  const label = formatDimensionValue(value, primaryDimension)
                  return `${primaryDimension}: ${label}`
                }}
              />
              <Legend />
              {config.metrics.map((metric, index) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  name={metric}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={primaryDimension}
                tickFormatter={(value) => formatDimensionValue(value, primaryDimension)}
                angle={primaryDimension === 'date' ? 0 : -45}
                textAnchor={primaryDimension === 'date' ? 'middle' : 'end'}
                height={primaryDimension === 'date' ? 60 : 80}
                interval={primaryDimension === 'date' ? 'preserveStartEnd' : 0}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => {
                  const label = formatDimensionValue(value, primaryDimension)
                  return `${primaryDimension}: ${label}`
                }}
              />
              <Legend />
              {config.metrics.map((metric, index) => (
                <Bar
                  key={metric}
                  dataKey={metric}
                  fill={COLORS[index % COLORS.length]}
                  name={metric}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => {
                  const dimValue = entry[primaryDimension]
                  const metricValue = entry[config.metrics[0]]
                  const total = sortedData.reduce((sum, item) => sum + (item[config.metrics[0]] || 0), 0)
                  const percent = total > 0 ? ((metricValue / total) * 100).toFixed(0) : 0
                  const label = formatDimensionValue(dimValue, primaryDimension)
                  return `${label} (${percent}%)`
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey={config.metrics[0] || 'value'}
                nameKey={primaryDimension}
              >
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: string, props: any) => {
                  const dimValue = props.payload[primaryDimension]
                  const label = formatDimensionValue(dimValue, primaryDimension)
                  return [value, `${primaryDimension}: ${label}`]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {config.dimensions.map((dim) => (
                    <th key={dim} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dim}
                    </th>
                  ))}
                  {config.metrics.map((metric) => (
                    <th key={metric} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {metric}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((row, index) => (
                  <tr key={index}>
                    {config.dimensions.map((dim) => (
                      <td key={dim} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row[dim] || '-'}
                      </td>
                    ))}
                    {config.metrics.map((metric) => (
                      <td key={metric} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row[metric] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      
      default:
        return <div>Unsupported chart type</div>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  )
}


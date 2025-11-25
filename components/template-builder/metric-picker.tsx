'use client'

import { useState } from 'react'
import { GA4_METRICS, GA4_METRICS_BY_CATEGORY, searchMetrics } from '@/lib/ga4/metrics'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Search, Info } from 'lucide-react'

interface MetricPickerProps {
  selectedMetrics: string[]
  onMetricsChange: (metrics: string[]) => void
  multiSelect?: boolean
}

export function MetricPicker({ selectedMetrics, onMetricsChange, multiSelect = true }: MetricPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Object.keys(GA4_METRICS_BY_CATEGORY)
  const filteredMetrics = searchQuery
    ? searchMetrics(searchQuery)
    : selectedCategory
    ? GA4_METRICS_BY_CATEGORY[selectedCategory] || []
    : GA4_METRICS

  const handleMetricToggle = (metricName: string) => {
    if (multiSelect) {
      if (selectedMetrics.includes(metricName)) {
        onMetricsChange(selectedMetrics.filter(m => m !== metricName))
      } else {
        onMetricsChange([...selectedMetrics, metricName])
      }
    } else {
      onMetricsChange([metricName])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Search Metrics</Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search metrics..."
            className="pl-10"
          />
        </div>
      </div>

      {!searchQuery && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        <div className="divide-y divide-gray-200">
          {filteredMetrics.map((metric) => {
            const isSelected = selectedMetrics.includes(metric.name)
            return (
              <button
                key={metric.name}
                onClick={() => handleMetricToggle(metric.name)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' 
                    : 'border-2 border-transparent hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900">{metric.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                    </div>
                    <div className="mt-1.5 flex items-center space-x-2 flex-wrap gap-1">
                      <code className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-mono">
                        {metric.name}
                      </code>
                      <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                        {metric.category}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-600 rounded">
                        {metric.format}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{metric.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedMetrics.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-semibold text-blue-900 mb-3 flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Selected Metrics ({selectedMetrics.length})</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedMetrics.map((metricName) => {
              const metric = GA4_METRICS.find(m => m.name === metricName)
              return (
                <span
                  key={metricName}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  {metric?.label || metricName}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMetricToggle(metricName)
                    }}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-800 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}


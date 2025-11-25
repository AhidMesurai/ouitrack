'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { MetricPicker } from './metric-picker'
import { DimensionPicker } from './dimension-picker'
import { ChartConfig, FilterConfig } from '@/types'
import { validateChartConfig } from '@/lib/ga4/compatibility'
import { AlertCircle, X, BarChart3, LineChart, PieChart, Table, Filter } from 'lucide-react'

interface ChartEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chart?: ChartConfig
  availableMetrics: string[]
  onSave: (chart: ChartConfig) => void
}

export function ChartEditor({
  open,
  onOpenChange,
  chart,
  availableMetrics,
  onSave,
}: ChartEditorProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'line' | 'bar' | 'pie' | 'table'>('bar')
  const [metrics, setMetrics] = useState<string[]>([])
  const [dimensions, setDimensions] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  useEffect(() => {
    if (chart) {
      setTitle(chart.title)
      setType(chart.type)
      setMetrics(chart.metrics || [])
      setDimensions(chart.dimensions || [])
      setFilters(chart.filters || [])
    } else {
      setTitle('')
      setType('bar')
      setMetrics([])
      setDimensions([])
      setFilters([])
    }
    setValidationErrors([])
  }, [chart, open])

  const handleSave = () => {
    const validation = validateChartConfig(type, metrics, dimensions)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      return
    }

    const chartConfig: ChartConfig = {
      type,
      title,
      metrics,
      dimensions,
      ...(filters.length > 0 && { filters }),
    }

    onSave(chartConfig)
    onOpenChange(false)
  }

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      {
        dimension: '',
        operator: 'equals',
        value: '',
      },
    ])
  }

  const handleUpdateFilter = (index: number, field: keyof FilterConfig, value: any) => {
    const updated = [...filters]
    updated[index] = { ...updated[index], [field]: value }
    setFilters(updated)
  }

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const chartIcons = {
    line: LineChart,
    bar: BarChart3,
    pie: PieChart,
    table: Table,
  }

  const ChartIcon = chartIcons[type]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>{chart ? 'Edit Chart' : 'Add New Chart'}</DialogTitle>
              <DialogDescription>
                Configure your chart type, metrics, dimensions, and filters
              </DialogDescription>
            </div>
          </div>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900 mb-2">Validation Errors</p>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="chart-title" className="text-sm font-semibold text-gray-700 mb-2 block">
                Chart Title *
              </Label>
              <Input
                id="chart-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Sessions Over Time"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="chart-type" className="text-sm font-semibold text-gray-700 mb-2 block">
                Chart Type *
              </Label>
              <Select
                id="chart-type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="mt-1"
              >
                <option value="line">📈 Line Chart</option>
                <option value="bar">📊 Bar Chart</option>
                <option value="pie">🥧 Pie Chart</option>
                <option value="table">📋 Table</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Metrics * <span className="text-gray-400 font-normal">({metrics.length} selected)</span>
            </Label>
            <div className="border-2 border-gray-200 rounded-lg max-h-64 overflow-y-auto p-4 bg-gray-50 hover:border-blue-300 transition-colors">
              <MetricPicker
                selectedMetrics={metrics}
                onMetricsChange={setMetrics}
                multiSelect={true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Dimensions * <span className="text-gray-400 font-normal">({dimensions.length} selected)</span>
            </Label>
            <div className="border-2 border-gray-200 rounded-lg max-h-64 overflow-y-auto p-4 bg-gray-50 hover:border-blue-300 transition-colors">
              <DimensionPicker
                selectedDimensions={dimensions}
                onDimensionsChange={setDimensions}
                multiSelect={true}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters (Optional)</span>
                {filters.length > 0 && (
                  <span className="text-xs font-normal text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                    {filters.length}
                  </span>
                )}
              </Label>
              <Button variant="outline" size="sm" onClick={handleAddFilter} className="text-sm">
                <Filter className="h-3 w-3 mr-1.5" />
                Add Filter
              </Button>
            </div>
            {filters.length > 0 && (
              <div className="space-y-2">
                {filters.map((filter, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border-2 border-gray-200 rounded-lg bg-white hover:border-blue-300 transition-colors">
                    <Input
                      placeholder="Dimension name"
                      value={filter.dimension}
                      onChange={(e) => handleUpdateFilter(index, 'dimension', e.target.value)}
                      className="flex-1"
                    />
                    <Select
                      value={filter.operator}
                      onChange={(e) => handleUpdateFilter(index, 'operator', e.target.value)}
                      className="w-36"
                    >
                      <option value="equals">Equals</option>
                      <option value="contains">Contains</option>
                      <option value="startsWith">Starts With</option>
                      <option value="endsWith">Ends With</option>
                    </Select>
                    <Input
                      placeholder="Value"
                      value={filter.value}
                      onChange={(e) => handleUpdateFilter(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFilter(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {filters.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <Filter className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No filters added. Click &ldquo;Add Filter&rdquo; to get started.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title || metrics.length === 0 || dimensions.length === 0}>
            {chart ? 'Update Chart' : 'Add Chart'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


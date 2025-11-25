'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MetricPicker } from './metric-picker'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Plus, X, Edit2, BarChart3 } from 'lucide-react'
import { MetricConfig } from '@/types'
import { GA4_METRICS } from '@/lib/ga4/metrics'

interface MetricsSectionProps {
  metrics: MetricConfig[]
  onMetricsChange: (metrics: MetricConfig[]) => void
}

export function MetricsSection({ metrics, onMetricsChange }: MetricsSectionProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedMetricName, setSelectedMetricName] = useState('')
  const [metricLabel, setMetricLabel] = useState('')
  const [metricFormat, setMetricFormat] = useState<'number' | 'percentage' | 'currency' | 'duration'>('number')

  const handleAddMetric = () => {
    if (!selectedMetricName) return

    const metricDef = GA4_METRICS.find(m => m.name === selectedMetricName)
    const newMetric: MetricConfig = {
      name: selectedMetricName,
      label: metricLabel || metricDef?.label || selectedMetricName,
      format: metricFormat || metricDef?.format || 'number',
    }

    if (editingIndex !== null) {
      const updated = [...metrics]
      updated[editingIndex] = newMetric
      onMetricsChange(updated)
      setEditingIndex(null)
    } else {
      onMetricsChange([...metrics, newMetric])
    }

    setIsPickerOpen(false)
    setSelectedMetricName('')
    setMetricLabel('')
    setMetricFormat('number')
  }

  const handleEditMetric = (index: number) => {
    const metric = metrics[index]
    setSelectedMetricName(metric.name)
    setMetricLabel(metric.label)
    setMetricFormat(metric.format || 'number')
    setEditingIndex(index)
    setIsPickerOpen(true)
  }

  const handleRemoveMetric = (index: number) => {
    onMetricsChange(metrics.filter((_, i) => i !== index))
  }

  const handleMetricSelect = (metricName: string) => {
    setSelectedMetricName(metricName)
    const metricDef = GA4_METRICS.find(m => m.name === metricName)
    if (metricDef && !metricLabel) {
      setMetricLabel(metricDef.label)
      setMetricFormat(metricDef.format === 'decimal' ? 'number' : metricDef.format)
    }
  }

  return (
    <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Metrics</CardTitle>
            <CardDescription className="mt-1">Add metrics to display in your report</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {metrics.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <BarChart3 className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-2">No metrics added yet</p>
            <p className="text-xs text-gray-400">Click &ldquo;Add Metric&rdquo; to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {metrics.map((metric, index) => {
              const metricDef = GA4_METRICS.find(m => m.name === metric.name)
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900">{metric.label}</span>
                      <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                        {metric.name}
                      </code>
                      {metric.format && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          {metric.format}
                        </span>
                      )}
                    </div>
                    {metricDef && (
                      <p className="text-sm text-gray-600">{metricDef.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMetric(index)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMetric(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => {
            setEditingIndex(null)
            setSelectedMetricName('')
            setMetricLabel('')
            setMetricFormat('number')
            setIsPickerOpen(true)
          }}
          className="w-full border-2 border-dashed hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Metric
        </Button>

        <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Plus className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <DialogTitle>{editingIndex !== null ? 'Edit Metric' : 'Add Metric'}</DialogTitle>
                  <DialogDescription>
                    Select a metric and configure its display settings
                  </DialogDescription>
                </div>
              </div>
              <DialogClose onClose={() => setIsPickerOpen(false)} />
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Select Metric</Label>
                <div className="border-2 border-gray-200 rounded-lg max-h-64 overflow-y-auto p-4 bg-gray-50 hover:border-purple-300 transition-colors">
                  <MetricPicker
                    selectedMetrics={selectedMetricName ? [selectedMetricName] : []}
                    onMetricsChange={(metrics) => {
                      if (metrics.length > 0) {
                        handleMetricSelect(metrics[0])
                      } else {
                        setSelectedMetricName('')
                      }
                    }}
                    multiSelect={false}
                  />
                </div>
              </div>

              {selectedMetricName && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                  <div>
                    <Label htmlFor="metric-label" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Display Label *
                    </Label>
                    <Input
                      id="metric-label"
                      value={metricLabel}
                      onChange={(e) => setMetricLabel(e.target.value)}
                      placeholder="e.g., Total Sessions"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="metric-format" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Format
                    </Label>
                    <Select
                      id="metric-format"
                      value={metricFormat}
                      onChange={(e) => setMetricFormat(e.target.value as any)}
                      className="mt-1"
                    >
                      <option value="number">🔢 Number</option>
                      <option value="percentage">% Percentage</option>
                      <option value="currency">💰 Currency</option>
                      <option value="duration">⏱️ Duration</option>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <Button variant="outline" onClick={() => setIsPickerOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddMetric}
                disabled={!selectedMetricName || !metricLabel}
              >
                {editingIndex !== null ? 'Update' : 'Add'} Metric
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}


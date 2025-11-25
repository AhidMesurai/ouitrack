'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GripVertical, Edit2, Trash2, BarChart3, LineChart, PieChart, Table } from 'lucide-react'
import { ChartConfig } from '@/types'

interface ChartCardProps {
  chart: ChartConfig
  index: number
  onEdit: () => void
  onDelete: () => void
}

const chartIcons = {
  line: LineChart,
  bar: BarChart3,
  pie: PieChart,
  table: Table,
}

export function ChartCard({ chart, index, onEdit, onDelete }: ChartCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `chart-${index}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = chartIcons[chart.type] || BarChart3

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`cursor-move border-2 transition-all duration-200 ${
        isDragging 
          ? 'ring-2 ring-blue-500 border-blue-400 shadow-lg scale-105' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
              >
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">{chart.title}</CardTitle>
              <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full capitalize">
                {chart.type}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-gray-700 min-w-[80px]">Metrics:</span>
                <div className="flex-1">
                  {chart.metrics.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {chart.metrics.slice(0, 2).map((metric, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                          {metric}
                        </span>
                      ))}
                      {chart.metrics.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          +{chart.metrics.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-red-500 text-xs">No metrics</span>
                  )}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-gray-700 min-w-[80px]">Dimensions:</span>
                <div className="flex-1">
                  {chart.dimensions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {chart.dimensions.slice(0, 2).map((dim, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                          {dim}
                        </span>
                      ))}
                      {chart.dimensions.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          +{chart.dimensions.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-red-500 text-xs">No dimensions</span>
                  )}
                </div>
              </div>
            </div>
            {chart.filters && chart.filters.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">Filters:</span>
                <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  {chart.filters.length} filter{chart.filters.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


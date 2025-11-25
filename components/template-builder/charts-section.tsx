'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Layout } from 'lucide-react'
import { ChartCard } from './chart-card'
import { ChartEditor } from './chart-editor'
import { ChartConfig } from '@/types'

interface ChartsSectionProps {
  charts: ChartConfig[]
  availableMetrics: string[]
  onChartsChange: (charts: ChartConfig[]) => void
}

export function ChartsSection({ charts, onChartsChange, availableMetrics }: ChartsSectionProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = charts.findIndex((_, i) => `chart-${i}` === active.id)
      const newIndex = charts.findIndex((_, i) => `chart-${i}` === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        onChartsChange(arrayMove(charts, oldIndex, newIndex))
      }
    }
  }

  const handleAddChart = () => {
    setEditingIndex(null)
    setIsEditorOpen(true)
  }

  const handleEditChart = (index: number) => {
    setEditingIndex(index)
    setIsEditorOpen(true)
  }

  const handleDeleteChart = (index: number) => {
    onChartsChange(charts.filter((_, i) => i !== index))
  }

  const handleSaveChart = (chart: ChartConfig) => {
    if (editingIndex !== null) {
      const updated = [...charts]
      updated[editingIndex] = chart
      onChartsChange(updated)
    } else {
      onChartsChange([...charts, chart])
    }
    setIsEditorOpen(false)
    setEditingIndex(null)
  }

  return (
    <>
      <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Layout className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Charts</CardTitle>
              <CardDescription className="mt-1">Add and arrange charts for your report. Drag to reorder.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {charts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <Layout className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-1">No charts added yet</p>
              <p className="text-xs text-gray-400">Click &ldquo;Add Chart&rdquo; to get started</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={charts.map((_, i) => `chart-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {charts.map((chart, index) => (
                    <ChartCard
                      key={`chart-${index}`}
                      chart={chart}
                      index={index}
                      onEdit={() => handleEditChart(index)}
                      onDelete={() => handleDeleteChart(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <Button 
            variant="outline" 
            onClick={handleAddChart} 
            className="w-full border-2 border-dashed hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Chart
          </Button>
        </CardContent>
      </Card>

      <ChartEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        chart={editingIndex !== null ? charts[editingIndex] : undefined}
        availableMetrics={availableMetrics}
        onSave={handleSaveChart}
      />
    </>
  )
}


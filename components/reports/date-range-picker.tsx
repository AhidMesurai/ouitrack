'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown } from 'lucide-react'
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns'

interface DateRangePickerProps {
  onDateRangeChange: (start: Date, end: Date) => void
  defaultRange?: { start: Date; end: Date }
}

const presets = [
  { label: 'Last 7 days', getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
  { label: 'Last 30 days', getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  { label: 'Last 90 days', getValue: () => ({ start: subDays(new Date(), 90), end: new Date() }) },
  { label: 'This month', getValue: () => ({ start: startOfMonth(new Date()), end: new Date() }) },
  { label: 'Last month', getValue: () => {
    const lastMonth = subMonths(new Date(), 1)
    return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) }
  }},
]

export function DateRangePicker({ onDateRangeChange, defaultRange }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date>(defaultRange?.start || subDays(new Date(), 30))
  const [endDate, setEndDate] = useState<Date>(defaultRange?.end || new Date())
  const [showPresets, setShowPresets] = useState(false)

  const handlePresetClick = (preset: typeof presets[0]) => {
    const range = preset.getValue()
    setStartDate(range.start)
    setEndDate(range.end)
    onDateRangeChange(range.start, range.end)
    setShowPresets(false)
  }

  const handleCustomRange = () => {
    onDateRangeChange(startDate, endDate)
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center space-x-2"
        >
          <Calendar className="h-4 w-4" />
          <span>{format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
        {showPresets && (
          <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="date"
          value={format(startDate, 'yyyy-MM-dd')}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={format(endDate, 'yyyy-MM-dd')}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <Button onClick={handleCustomRange} size="sm">Apply</Button>
      </div>
    </div>
  )
}


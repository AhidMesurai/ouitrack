'use client'

import { useState } from 'react'
import { GA4_DIMENSIONS, GA4_DIMENSIONS_BY_CATEGORY, searchDimensions } from '@/lib/ga4/dimensions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Search } from 'lucide-react'

interface DimensionPickerProps {
  selectedDimensions: string[]
  onDimensionsChange: (dimensions: string[]) => void
  multiSelect?: boolean
}

export function DimensionPicker({ selectedDimensions, onDimensionsChange, multiSelect = true }: DimensionPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Object.keys(GA4_DIMENSIONS_BY_CATEGORY)
  const filteredDimensions = searchQuery
    ? searchDimensions(searchQuery)
    : selectedCategory
    ? GA4_DIMENSIONS_BY_CATEGORY[selectedCategory] || []
    : GA4_DIMENSIONS

  const handleDimensionToggle = (dimensionName: string) => {
    if (multiSelect) {
      if (selectedDimensions.includes(dimensionName)) {
        onDimensionsChange(selectedDimensions.filter(d => d !== dimensionName))
      } else {
        onDimensionsChange([...selectedDimensions, dimensionName])
      }
    } else {
      onDimensionsChange([dimensionName])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Search Dimensions</Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dimensions..."
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
                ? 'bg-purple-600 text-white shadow-md'
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
                  ? 'bg-purple-600 text-white shadow-md'
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
          {filteredDimensions.map((dimension) => {
            const isSelected = selectedDimensions.includes(dimension.name)
            return (
              <button
                key={dimension.name}
                onClick={() => handleDimensionToggle(dimension.name)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-purple-50 border-2 border-purple-500 shadow-sm' 
                    : 'border-2 border-transparent hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900">{dimension.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />}
                    </div>
                    <div className="mt-1.5 flex items-center space-x-2 flex-wrap gap-1">
                      <code className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-mono">
                        {dimension.name}
                      </code>
                      <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded">
                        {dimension.category}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{dimension.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedDimensions.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-semibold text-purple-900 mb-3 flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Selected Dimensions ({selectedDimensions.length})</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedDimensions.map((dimensionName) => {
              const dimension = GA4_DIMENSIONS.find(d => d.name === dimensionName)
              return (
                <span
                  key={dimensionName}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-600 text-white shadow-sm hover:bg-purple-700 transition-colors"
                >
                  {dimension?.label || dimensionName}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDimensionToggle(dimensionName)
                    }}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-800 transition-colors"
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


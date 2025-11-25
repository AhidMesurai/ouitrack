'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { FileText, Calendar } from 'lucide-react'

interface BasicInfoSectionProps {
  name: string
  description: string
  timeframe: 'last_7_days' | 'last_30_days' | 'last_90_days'
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
  onTimeframeChange: (timeframe: 'last_7_days' | 'last_30_days' | 'last_90_days') => void
}

export function BasicInfoSection({
  name,
  description,
  timeframe,
  onNameChange,
  onDescriptionChange,
  onTimeframeChange,
}: BasicInfoSectionProps) {
  return (
    <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Basic Information</CardTitle>
            <CardDescription className="mt-1">Set the name, description, and default timeframe for your template</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div>
          <Label htmlFor="template-name" className="text-sm font-semibold text-gray-700 mb-2 block">
            Template Name *
          </Label>
          <Input
            id="template-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., Website Performance Overview"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="template-description" className="text-sm font-semibold text-gray-700 mb-2 block">
            Description
          </Label>
          <Textarea
            id="template-description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe what this template shows..."
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="template-timeframe" className="text-sm font-semibold text-gray-700 mb-2 block flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Default Timeframe</span>
          </Label>
          <Select
            id="template-timeframe"
            value={timeframe}
            onChange={(e) => onTimeframeChange(e.target.value as 'last_7_days' | 'last_30_days' | 'last_90_days')}
            className="mt-1"
          >
            <option value="last_7_days">📅 Last 7 days</option>
            <option value="last_30_days">📅 Last 30 days</option>
            <option value="last_90_days">📅 Last 90 days</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}


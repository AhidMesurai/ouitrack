'use client'

import { useEffect, useState } from 'react'
import { ReportCard } from './report-card'
import { ReportTemplate } from '@/types'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'

export function ReportGrid() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/reports/templates')
        if (response.ok) {
          const data = await response.json()
          setTemplates(data)
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    // During SSR, use default theme
    theme = 'dark'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={cn(
              "h-64 animate-pulse rounded-lg",
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-200'
            )} 
          />
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className={cn(
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        )}>
          No report templates available yet.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <ReportCard key={template.id} template={template} />
      ))}
    </div>
  )
}


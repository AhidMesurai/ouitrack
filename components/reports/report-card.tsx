'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Eye } from 'lucide-react'
import Link from 'next/link'
import { ReportTemplate } from '@/types'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'

interface ReportCardProps {
  template: ReportTemplate
}

export function ReportCard({ template }: ReportCardProps) {
  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    // During SSR, use default theme
    theme = 'dark'
  }
  
  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-200",
      theme === 'dark'
        ? 'bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70'
        : 'bg-white border-gray-200 hover:shadow-xl'
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <FileText className={cn(
            "h-8 w-8",
            theme === 'dark' ? 'text-blue-400' : 'text-primary'
          )} />
          <span className={cn(
            "text-xs px-2 py-1 rounded",
            theme === 'dark'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-green-100 text-green-800'
          )}>
            Active
          </span>
        </div>
        <CardTitle className={cn(
          "mt-4",
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )} style={{ fontFamily: "'Inter', sans-serif" }}>
          {template.name}
        </CardTitle>
        <CardDescription className={cn(
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {template.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-sm",
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          <p>Charts: {template.template_config.charts?.length || 0}</p>
          <p>Metrics: {template.template_config.metrics?.length || 0}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/dashboard/reports/${template.id}`} className="w-full">
          <Button 
            className={cn(
              "w-full",
              theme === 'dark'
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                : ''
            )} 
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Report
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}


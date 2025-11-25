'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Eye } from 'lucide-react'
import Link from 'next/link'
import { ReportTemplate } from '@/types'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full"
    >
      <Card className={cn(
        "relative group overflow-hidden h-full transition-all duration-300",
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 border-gray-800/50 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/20'
          : 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl'
      )}>
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10' 
            : 'bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50'
        )} />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <FileText className={cn(
                "h-8 w-8",
                theme === 'dark' ? 'text-blue-400' : 'text-primary'
              )} />
            </motion.div>
            <span className={cn(
              "text-xs px-2 py-1 rounded font-semibold",
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
        <CardContent className="relative z-10">
          <div className={cn(
            "text-sm space-y-1",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            <p>Charts: {template.template_config.charts?.length || 0}</p>
            <p>Metrics: {template.template_config.metrics?.length || 0}</p>
          </div>
        </CardContent>
        <CardFooter className="relative z-10">
          <Link href={`/dashboard/reports/${template.id}`} className="w-full">
            <Button 
              className={cn(
                "w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300",
                theme === 'dark'
                  ? ''
                  : ''
              )} 
            >
              <Eye className="h-4 w-4 mr-2" />
              View Report
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Copy, Plus, Loader2, FileText } from 'lucide-react'
import Link from 'next/link'
import { ReportTemplate } from '@/types'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AdminTemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [loading, setLoading] = useState(true)
  // Use try-catch to handle SSR case where theme might not be available
  let theme: 'light' | 'dark' = 'dark'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch (e) {
    // During SSR, use default theme
    theme = 'dark'
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/templates')
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTemplates(templates.filter(t => t.id !== id))
      } else {
        const error = await response.json()
        alert(`Failed to delete template: ${error.error}`)
      }
    } catch (error: any) {
      alert(`Failed to delete template: ${error.message}`)
    }
  }

  const handleDuplicate = async (template: ReportTemplate) => {
    try {
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${template.name} (Copy)`,
          description: template.description,
          template_config: template.template_config,
        }),
      })

      if (response.ok) {
        const newTemplate = await response.json()
        router.push(`/admin/templates/${newTemplate.id}/edit`)
      } else {
        const error = await response.json()
        alert(`Failed to duplicate template: ${error.error}`)
      }
    } catch (error: any) {
      alert(`Failed to duplicate template: ${error.message}`)
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "p-2 rounded-lg",
                  theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                )}>
                  <FileText className={cn(
                    "w-6 h-6",
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  )} />
                </div>
                <h1 className={cn(
                  "text-3xl font-bold",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )} style={{ fontFamily: "'Inter', sans-serif" }}>
                  Report Templates
                </h1>
              </div>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )} style={{ fontFamily: "'Inter', sans-serif" }}>
                Create and manage report templates
              </p>
            </div>
            <Link href="/admin/templates/new">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className={cn(
              "relative group overflow-hidden rounded-xl p-12 border",
              theme === 'dark'
                ? 'bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 border-gray-800/50 backdrop-blur-xl shadow-2xl'
                : 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg'
            )}>
              <div className="flex items-center justify-center">
                <Loader2 className={cn(
                  "h-8 w-8 animate-spin",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )} />
              </div>
            </div>
          ) : templates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative group overflow-hidden">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition duration-1000" />
                <div className={cn(
                  "relative rounded-xl p-6 border shadow-lg backdrop-blur-xl",
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-900/95 via-purple-900/20 to-blue-900/20 border-purple-500/30'
                    : 'bg-white border-gray-200'
                )}>
                  <h3 className={cn(
                    "text-lg font-semibold mb-2",
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    No Templates
                  </h3>
                  <p className={cn(
                    "text-sm mb-4",
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    Get started by creating your first report template
                  </p>
                  <Link href="/admin/templates/new">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                      Create New Template
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="h-full"
                >
                  <div className="relative group overflow-hidden h-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition duration-1000" />
                    <div className={cn(
                      "relative rounded-xl p-5 border shadow-lg backdrop-blur-xl h-full flex flex-col",
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 border-gray-800/50'
                        : 'bg-white/95 backdrop-blur-sm border-gray-200'
                    )}>
                      <div className="flex-1">
                        <h3 className={cn(
                          "text-lg font-semibold mb-2 line-clamp-1",
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )} style={{ fontFamily: "'Inter', sans-serif" }}>
                          {template.name}
                        </h3>
                        <p className={cn(
                          "text-sm mb-4 line-clamp-2",
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {template.description || 'No description'}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className={cn(
                            "text-sm",
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            <span className="font-medium">Metrics:</span> {template.template_config.metrics?.length || 0}
                          </div>
                          <div className={cn(
                            "text-sm",
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            <span className="font-medium">Charts:</span> {template.template_config.charts?.length || 0}
                          </div>
                          <div className={cn(
                            "text-sm",
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            <span className="font-medium">Status:</span>{' '}
                            <span className={template.is_active ? 'text-green-500' : 'text-gray-500'}>
                              {template.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 pt-4 border-t border-gray-700/50">
                        <Link href={`/admin/templates/${template.id}/edit`} className="flex-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn(
                              "w-full",
                              theme === 'dark'
                                ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                                : ''
                            )}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicate(template)}
                          className={cn(
                            theme === 'dark'
                              ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                              : ''
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(template.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


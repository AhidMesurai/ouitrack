'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Copy, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { ReportTemplate } from '@/types'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AdminTemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [loading, setLoading] = useState(true)

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
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Report Templates</h1>
            <Link href="/admin/templates/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </Link>
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ) : templates.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Templates</CardTitle>
                <CardDescription>Get started by creating your first report template</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/templates/new">
                  <Button>Create New Template</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {template.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Metrics:</span> {template.template_config.metrics?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Charts:</span> {template.template_config.charts?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={template.is_active ? 'text-green-600' : 'text-gray-500'}>
                          {template.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/templates/${template.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(template)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


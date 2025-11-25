'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { BasicInfoSection } from '@/components/template-builder/basic-info-section'
import { MetricsSection } from '@/components/template-builder/metrics-section'
import { ChartsSection } from '@/components/template-builder/charts-section'
import { LivePreview } from '@/components/template-builder/live-preview'
import { ValidationPanel } from '@/components/template-builder/validation-panel'
import { TestPanel } from '@/components/template-builder/test-panel'
import { Button } from '@/components/ui/button'
import { ReportTemplate, MetricConfig, ChartConfig } from '@/types'
import { validateTemplate } from '@/lib/template-validation'
import { Save, ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function EditTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const templateId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [template, setTemplate] = useState<Partial<ReportTemplate> | null>(null)

  const fetchTemplate = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch template')
      }
      const data = await response.json()
      setTemplate(data)
    } catch (error: any) {
      alert(`Failed to load template: ${error.message}`)
      router.push('/admin/templates')
    } finally {
      setLoading(false)
    }
  }, [templateId, router])

  useEffect(() => {
    fetchTemplate()
  }, [fetchTemplate])

  const handleSave = async () => {
    if (!template) return

    const validation = validateTemplate(template)
    if (!validation.valid) {
      alert('Please fix validation errors before saving')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save template')
      }

      alert('Template saved successfully!')
    } catch (error: any) {
      alert(`Failed to save template: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete template')
      }

      router.push('/admin/templates')
    } catch (error: any) {
      alert(`Failed to delete template: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (!template) {
    return (
      <ProtectedRoute requireAdmin>
        <DashboardLayout>
          <div className="text-center py-12">
            <p className="text-gray-500">Template not found</p>
            <Link href="/admin/templates">
              <Button className="mt-4">Back to Templates</Button>
            </Link>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  const availableMetrics = template.template_config?.metrics?.map(m => m.name) || []

  return (
    <ProtectedRoute requireAdmin>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/templates">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Edit Template</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Builder */}
            <div className="space-y-6">
              <BasicInfoSection
                name={template.name || ''}
                description={template.description || ''}
                timeframe={template.template_config?.timeframe || 'last_30_days'}
                onNameChange={(name) => setTemplate({ ...template, name })}
                onDescriptionChange={(description) => setTemplate({ ...template, description })}
                onTimeframeChange={(timeframe) =>
                  setTemplate({
                    ...template,
                    template_config: {
                      ...template.template_config!,
                      timeframe,
                    },
                  })
                }
              />

              <MetricsSection
                metrics={template.template_config?.metrics || []}
                onMetricsChange={(metrics) =>
                  setTemplate({
                    ...template,
                    template_config: {
                      ...template.template_config!,
                      metrics,
                    },
                  })
                }
              />

              <ChartsSection
                charts={template.template_config?.charts || []}
                availableMetrics={availableMetrics}
                onChartsChange={(charts) =>
                  setTemplate({
                    ...template,
                    template_config: {
                      ...template.template_config!,
                      charts,
                    },
                  })
                }
              />

              <ValidationPanel template={template} />
            </div>

            {/* Right Column - Preview & Test */}
            <div className="space-y-6">
              <LivePreview template={template} />
              <TestPanel template={template} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


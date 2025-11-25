'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewTemplatePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [template, setTemplate] = useState<Partial<ReportTemplate>>({
    name: '',
    description: '',
    template_config: {
      timeframe: 'last_30_days',
      metrics: [],
      charts: [],
    },
  })

  const handleSave = async () => {
    const validation = validateTemplate(template)
    if (!validation.valid) {
      alert('Please fix validation errors before saving')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save template')
      }

      const savedTemplate = await response.json()
      router.push(`/admin/templates/${savedTemplate.id}/edit`)
    } catch (error: any) {
      alert(`Failed to save template: ${error.message}`)
    } finally {
      setSaving(false)
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Create New Template</h1>
            </div>
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
              {template.id && <TestPanel template={template} />}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}


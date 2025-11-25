'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react'
import { ReportTemplate } from '@/types'
import { validateTemplate, getValidationSummary } from '@/lib/template-validation'

interface ValidationPanelProps {
  template: Partial<ReportTemplate>
}

export function ValidationPanel({ template }: ValidationPanelProps) {
  const validation = useMemo(() => {
    return validateTemplate(template)
  }, [template])

  const summary = getValidationSummary(validation)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {validation.valid ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <span>Validation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-3 rounded-lg ${
          validation.valid
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm font-medium ${
            validation.valid ? 'text-green-900' : 'text-red-900'
          }`}>
            {summary}
          </p>
        </div>

        {validation.errors.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>Errors ({validation.errors.length})</span>
            </h4>
            <ul className="space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700 flex items-start space-x-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    <span className="font-medium">{error.field}:</span> {error.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {validation.warnings.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center space-x-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Warnings ({validation.warnings.length})</span>
            </h4>
            <ul className="space-y-1">
              {validation.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-yellow-700 flex items-start space-x-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    <span className="font-medium">{warning.field}:</span> {warning.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {validation.valid && validation.warnings.length === 0 && (
          <p className="text-sm text-green-700">
            Your template is valid and ready to save!
          </p>
        )}
      </CardContent>
    </Card>
  )
}


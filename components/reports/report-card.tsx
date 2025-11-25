import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Eye } from 'lucide-react'
import Link from 'next/link'
import { ReportTemplate } from '@/types'

interface ReportCardProps {
  template: ReportTemplate
}

export function ReportCard({ template }: ReportCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Active
          </span>
        </div>
        <CardTitle className="mt-4">{template.name}</CardTitle>
        <CardDescription>{template.description || 'No description available'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600">
          <p>Charts: {template.template_config.charts?.length || 0}</p>
          <p>Metrics: {template.template_config.metrics?.length || 0}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/dashboard/reports/${template.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Report
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}


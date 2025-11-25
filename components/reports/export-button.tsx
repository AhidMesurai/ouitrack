'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface ExportButtonProps {
  elementId: string
  filename?: string
}

export function ExportButton({ elementId, filename = 'report' }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    try {
      setExporting(true)
      const element = document.getElementById(elementId)
      if (!element) {
        alert('Report content not found')
        return
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <Button onClick={handleExport} disabled={exporting} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      {exporting ? 'Exporting...' : 'Export PDF'}
    </Button>
  )
}


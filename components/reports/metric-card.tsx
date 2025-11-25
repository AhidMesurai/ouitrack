import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  format?: 'number' | 'percentage' | 'currency' | 'duration'
}

export function MetricCard({ title, value, change, format = 'number' }: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val
    
    switch (format) {
      case 'percentage':
        return `${val.toFixed(2)}%`
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
      case 'duration':
        const minutes = Math.floor(val / 60)
        const seconds = Math.floor(val % 60)
        return `${minutes}m ${seconds}s`
      default:
        return new Intl.NumberFormat('en-US').format(val)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{formatValue(value)}</p>
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface GA4Connection {
  id: string
  property_id: string
  property_name: string
  is_active: boolean
  last_synced_at: string | null
}

export function ConnectionStatus() {
  const [connections, setConnections] = useState<GA4Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch('/api/ga4/properties')
        if (response.ok) {
          const data = await response.json()
          // Handle both old format (array) and new format ({ properties: [...] })
          if (Array.isArray(data)) {
            setConnections(data)
          } else if (data.properties && Array.isArray(data.properties)) {
            // Convert properties format to connections format
            const formattedConnections = data.properties.map((prop: any) => ({
              id: prop.id,
              property_id: prop.id,
              property_name: prop.name,
              is_active: true,
              last_synced_at: prop.connectedAt || null,
            }))
            setConnections(formattedConnections)
          } else {
            setConnections([])
          }
        }
      } catch (error) {
        console.error('Error fetching connections:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GA4 Connections</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (connections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GA4 Connections</CardTitle>
          <CardDescription>Connect your Google Analytics account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/connect-ga4">
            <Button>Connect GA4 Account</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GA4 Connections</CardTitle>
        <CardDescription>Your connected Google Analytics properties</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {connection.is_active ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{connection.property_name}</p>
                  <p className="text-sm text-gray-500">{connection.property_id}</p>
                  {connection.last_synced_at && (
                    <p className="text-xs text-gray-400">
                      Last synced: {new Date(connection.last_synced_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


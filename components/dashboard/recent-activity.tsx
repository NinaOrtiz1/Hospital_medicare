'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  UserPlus,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'patient' | 'appointment' | 'record' | 'alert'
  title: string
  description: string
  time: string
  status?: 'success' | 'warning' | 'pending'
  avatar?: {
    src?: string
    fallback: string
  }
}

const typeIcons = {
  patient: UserPlus,
  appointment: Calendar,
  record: FileText,
  alert: AlertCircle,
}

const statusStyles = {
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    icon: CheckCircle,
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    icon: AlertCircle,
  },
  pending: {
    bg: 'bg-info/10',
    text: 'text-info',
    icon: Clock,
  },
}

export function RecentActivity() {
  const [activityItems, setActivityItems] = React.useState<ActivityItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch('/api/activity')
        if (!response.ok) throw new Error('Failed to fetch activity')
        const data = await response.json()
        setActivityItems(data.activityItems || [])
      } catch (error) {
        console.error('Error fetching activity:', error)
        setActivityItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [])

  if (loading) {
    return (
      <Card className="transition-smooth hover:shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="px-6 pb-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas acciones en el sistema</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="px-6 pb-6 space-y-4" role="list" aria-label="Lista de actividades recientes">
            {activityItems.length > 0 ? activityItems.map((item) => {
              const TypeIcon = typeIcons[item.type]
              const statusConfig = item.status ? statusStyles[item.status] : null
              const StatusIcon = statusConfig?.icon

              return (
                <div
                  key={item.id}
                  role="listitem"
                  className="flex items-start gap-4 p-3 rounded-lg transition-smooth hover:bg-accent/50 cursor-pointer group"
                >
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage src={item.avatar?.src} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {item.avatar?.fallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <TypeIcon
                        className="w-4 h-4 text-muted-foreground shrink-0"
                        aria-hidden="true"
                      />
                      <span className="font-medium text-foreground truncate">
                        {item.title}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground truncate">
                      {item.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                      {statusConfig && StatusIcon && (
                        <Badge
                          variant="secondary"
                          className={cn('gap-1 text-xs', statusConfig.bg, statusConfig.text)}
                        >
                          <StatusIcon className="w-3 h-3" aria-hidden="true" />
                          {item.status === 'success' && 'Completado'}
                          {item.status === 'warning' && 'Atención'}
                          {item.status === 'pending' && 'Pendiente'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="px-6 py-8 text-center text-muted-foreground">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

interface AlertItem {
  id: string
  type: 'urgent' | 'warning' | 'info'
  title: string
  description: string
  time: string
}

const alertTypeStyles = {
  urgent: {
    border: 'border-l-4 border-l-destructive',
    bg: 'bg-destructive/5',
    badge: 'bg-destructive text-destructive-foreground',
  },
  warning: {
    border: 'border-l-4 border-l-warning',
    bg: 'bg-warning/5',
    badge: 'bg-warning text-warning-foreground',
  },
  info: {
    border: 'border-l-4 border-l-info',
    bg: 'bg-info/5',
    badge: 'bg-info text-info-foreground',
  },
}

export function AlertsPanel() {
  const [alertItems, setAlertItems] = React.useState<AlertItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/activity')
        if (!response.ok) throw new Error('Failed to fetch alerts')
        const data = await response.json()
        setAlertItems(data.alertItems || [])
      } catch (error) {
        console.error('Error fetching alerts:', error)
        setAlertItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  if (loading) {
    return (
      <Card className="transition-smooth hover:shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border-l-4 border-l-muted">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" aria-hidden="true" />
          Alertas del Sistema
        </CardTitle>
        <CardDescription>Notificaciones importantes que requieren atención</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alertItems.length > 0 ? alertItems.map((alert) => {
          const styles = alertTypeStyles[alert.type]
          return (
            <div
              key={alert.id}
              className={cn(
                'p-4 rounded-lg transition-smooth hover:shadow-sm cursor-pointer',
                styles.border,
                styles.bg
              )}
              role="alert"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn('text-xs', styles.badge)}>
                      {alert.type === 'urgent' && 'Urgente'}
                      {alert.type === 'warning' && 'Advertencia'}
                      {alert.type === 'info' && 'Info'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <h4 className="mt-2 font-medium text-foreground">{alert.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="py-8 text-center text-muted-foreground">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No hay alertas activas</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Bell,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  User,
  Clock,
} from 'lucide-react'

interface Notification {
  id: string
  type: 'appointment' | 'record' | 'alert' | 'system'
  title: string
  message: string
  time: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

interface NotificationsPanelProps {
  className?: string
}

export function NotificationsPanel({ className }: NotificationsPanelProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Nueva cita programada',
      message: 'Dr. García - Paciente María López - Mañana 10:30 AM',
      time: '2 min ago',
      read: false,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'record',
      title: 'Resultados de laboratorio disponibles',
      message: 'Análisis completos para Juan Pérez - Hematología',
      time: '15 min ago',
      read: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'alert',
      title: 'Recordatorio de reunión',
      message: 'Reunión de personal médico a las 3:00 PM en sala de conferencias',
      time: '1 hour ago',
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'system',
      title: 'Actualización del sistema',
      message: 'Nueva versión disponible - Mejoras en rendimiento',
      time: '2 hours ago',
      read: true,
      priority: 'low'
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4" />
      case 'record':
        return <FileText className="w-4 h-4" />
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />
      case 'system':
        return <Settings className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-destructive'
      case 'medium':
        return 'text-warning'
      case 'low':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Notificaciones</CardTitle>
          <CardDescription>
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
          </CardDescription>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            Marcar todas como leídas
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">No hay notificaciones</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={cn(
                      'flex items-start gap-3 p-4 hover:bg-accent/50 cursor-pointer transition-colors',
                      !notification.read && 'bg-accent/20'
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className={cn(
                      'flex-shrink-0 p-2 rounded-full',
                      notification.type === 'appointment' && 'bg-blue-100 text-blue-600',
                      notification.type === 'record' && 'bg-green-100 text-green-600',
                      notification.type === 'alert' && 'bg-orange-100 text-orange-600',
                      notification.type === 'system' && 'bg-purple-100 text-purple-600'
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={cn(
                            'text-sm font-medium',
                            !notification.read && 'font-semibold'
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                Nuevo
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
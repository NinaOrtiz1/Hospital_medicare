'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  Users,
  UserCog,
  CalendarDays,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'info' | 'success' | 'warning' | 'alert'
}

const variantStyles = {
  info: {
    iconBg: 'bg-info/10',
    iconColor: 'text-info',
  },
  success: {
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
  warning: {
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
  },
  alert: {
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
  },
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'info',
}: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className="overflow-hidden transition-smooth hover:shadow-lg hover:-translate-y-0.5 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div
                className={cn(
                  'mt-2 flex items-center gap-1 text-sm font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <TrendingDown className="w-4 h-4" aria-hidden="true" />
                )}
                <span>
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-muted-foreground font-normal">vs mes anterior</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              'flex items-center justify-center w-12 h-12 rounded-xl transition-smooth group-hover:scale-110',
              styles.iconBg
            )}
          >
            <Icon className={cn('w-6 h-6', styles.iconColor)} aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatCardsGrid() {
  const stats: StatCardProps[] = [
    {
      title: 'Total Pacientes',
      value: '2,847',
      description: '127 nuevos este mes',
      icon: Users,
      trend: { value: 12, isPositive: true },
      variant: 'info',
    },
    {
      title: 'Doctores Activos',
      value: '48',
      description: '12 especialidades',
      icon: UserCog,
      trend: { value: 4, isPositive: true },
      variant: 'success',
    },
    {
      title: 'Citas de Hoy',
      value: '156',
      description: '23 pendientes',
      icon: CalendarDays,
      trend: { value: 8, isPositive: true },
      variant: 'warning',
    },
    {
      title: 'Alertas',
      value: '7',
      description: '3 urgentes',
      icon: AlertTriangle,
      trend: { value: 15, isPositive: false },
      variant: 'alert',
    },
  ]

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      role="region"
      aria-label="Estadísticas generales"
    >
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}

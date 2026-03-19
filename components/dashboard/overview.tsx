'use client'

import dynamic from 'next/dynamic'
import { StatCardsGrid } from './stat-cards'
import { RecentActivity, AlertsPanel } from './recent-activity'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Dynamic import for charts to avoid SSR issues with Recharts
const ChartsGrid = dynamic(
  () => import('./charts').then(mod => mod.ChartsGrid),
  { 
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
)

interface DashboardOverviewProps {
  userName?: string
}

export function DashboardOverview({ userName = 'Doctor' }: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground text-balance">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Bienvenido de nuevo, {userName}. Aqui esta el resumen de hoy.
        </p>
      </div>

      {/* Stats */}
      <StatCardsGrid />

      {/* Charts */}
      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="text-xl font-semibold text-foreground mb-4">
          Analisis y Estadisticas
        </h2>
        <ChartsGrid />
      </section>

      {/* Activity & Alerts */}
      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="text-xl font-semibold text-foreground mb-4">
          Actividad y Alertas
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentActivity />
          <AlertsPanel />
        </div>
      </section>
    </div>
  )
}

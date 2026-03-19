'use client'

import * as React from 'react'
import { StatCardsGrid } from './stat-cards'
import { ChartsGrid } from './charts'
import { RecentActivity, AlertsPanel } from './recent-activity'

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
          Bienvenido de nuevo, {userName}. Aquí está el resumen de hoy.
        </p>
      </div>

      {/* Stats */}
      <StatCardsGrid />

      {/* Charts */}
      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="text-xl font-semibold text-foreground mb-4">
          Análisis y Estadísticas
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

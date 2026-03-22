'use client'

import * as React from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'

const appointmentsConfig = {
  completadas: {
    label: 'Completadas',
    color: 'var(--color-chart-2)',
  },
  canceladas: {
    label: 'Canceladas',
    color: 'var(--color-chart-5)',
  },
  pendientes: {
    label: 'Pendientes',
    color: 'var(--color-chart-4)',
  },
} satisfies ChartConfig

const patientGrowthConfig = {
  nuevos: {
    label: 'Nuevos Pacientes',
    color: 'var(--color-chart-1)',
  },
  retorno: {
    label: 'Pacientes Retorno',
    color: 'var(--color-chart-2)',
  },
} satisfies ChartConfig

const departmentConfig = {
  cardiologia: {
    label: 'Cardiología',
    color: 'var(--color-chart-1)',
  },
  pediatria: {
    label: 'Pediatría',
    color: 'var(--color-chart-2)',
  },
  neurologia: {
    label: 'Neurología',
    color: 'var(--color-chart-3)',
  },
  traumatologia: {
    label: 'Traumatología',
    color: 'var(--color-chart-4)',
  },
  otros: {
    label: 'Otros',
    color: 'var(--color-chart-5)',
  },
} satisfies ChartConfig

const revenueConfig = {
  ingresos: {
    label: 'Ingresos',
    color: 'var(--color-chart-2)',
  },
  gastos: {
    label: 'Gastos',
    color: 'var(--color-chart-5)',
  },
} satisfies ChartConfig

export function AppointmentsBarChart() {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/charts')
        if (!response.ok) throw new Error('Failed to fetch charts data')
        const chartsData = await response.json()
        setData(chartsData.appointmentsData || [])
      } catch (error) {
        console.error('Error fetching appointments data:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="transition-smooth hover:shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader>
        <CardTitle>Resumen de Citas</CardTitle>
        <CardDescription>Citas por mes - Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={appointmentsConfig} className="h-[300px] w-full">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis tickLine={false} axisLine={false} className="text-muted-foreground" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="completadas"
              fill="var(--color-completadas)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="canceladas"
              fill="var(--color-canceladas)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pendientes"
              fill="var(--color-pendientes)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function PatientGrowthLineChart() {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/charts')
        if (!response.ok) throw new Error('Failed to fetch charts data')
        const chartsData = await response.json()
        setData(chartsData.patientGrowthData || [])
      } catch (error) {
        console.error('Error fetching patient growth data:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="transition-smooth hover:shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader>
        <CardTitle>Crecimiento de Pacientes</CardTitle>
        <CardDescription>Pacientes nuevos vs retorno</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={patientGrowthConfig} className="h-[300px] w-full">
          <LineChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis tickLine={false} axisLine={false} className="text-muted-foreground" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="nuevos"
              stroke="var(--color-nuevos)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-nuevos)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="retorno"
              stroke="var(--color-retorno)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-retorno)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function DepartmentPieChart() {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/charts')
        if (!response.ok) throw new Error('Failed to fetch charts data')
        const chartsData = await response.json()
        setData(chartsData.departmentData || [])
      } catch (error) {
        console.error('Error fetching department data:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="transition-smooth hover:shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader>
        <CardTitle>Distribución por Departamento</CardTitle>
        <CardDescription>Porcentaje de citas por especialidad</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={departmentConfig} className="h-[300px] w-full">
          <PieChart accessibilityLayer>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function RevenueAreaChart() {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/charts')
        if (!response.ok) throw new Error('Failed to fetch charts data')
        const chartsData = await response.json()
        setData(chartsData.revenueData || [])
      } catch (error) {
        console.error('Error fetching revenue data:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="transition-smooth hover:shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader>
        <CardTitle>Análisis Financiero</CardTitle>
        <CardDescription>Ingresos vs Gastos mensuales</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="h-[300px] w-full">
          <AreaChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="var(--color-ingresos)"
              fill="var(--color-ingresos)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="gastos"
              stroke="var(--color-gastos)"
              fill="var(--color-gastos)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ChartsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" role="region" aria-label="Gráficos de análisis">
      <AppointmentsBarChart />
      <PatientGrowthLineChart />
      <DepartmentPieChart />
      <RevenueAreaChart />
    </div>
  )
}

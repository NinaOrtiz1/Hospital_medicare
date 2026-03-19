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
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'

// Sample data
const appointmentsData = [
  { month: 'Ene', completadas: 120, canceladas: 15, pendientes: 25 },
  { month: 'Feb', completadas: 145, canceladas: 12, pendientes: 30 },
  { month: 'Mar', completadas: 160, canceladas: 18, pendientes: 22 },
  { month: 'Abr', completadas: 135, canceladas: 10, pendientes: 28 },
  { month: 'May', completadas: 180, canceladas: 14, pendientes: 35 },
  { month: 'Jun', completadas: 195, canceladas: 8, pendientes: 20 },
]

const patientGrowthData = [
  { month: 'Ene', nuevos: 85, retorno: 120 },
  { month: 'Feb', nuevos: 95, retorno: 135 },
  { month: 'Mar', nuevos: 110, retorno: 145 },
  { month: 'Abr', nuevos: 90, retorno: 155 },
  { month: 'May', nuevos: 125, retorno: 170 },
  { month: 'Jun', nuevos: 140, retorno: 185 },
]

const departmentData = [
  { name: 'Cardiología', value: 25, fill: 'var(--color-chart-1)' },
  { name: 'Pediatría', value: 20, fill: 'var(--color-chart-2)' },
  { name: 'Neurología', value: 18, fill: 'var(--color-chart-3)' },
  { name: 'Traumatología', value: 15, fill: 'var(--color-chart-4)' },
  { name: 'Otros', value: 22, fill: 'var(--color-chart-5)' },
]

const revenueData = [
  { month: 'Ene', ingresos: 45000, gastos: 32000 },
  { month: 'Feb', ingresos: 52000, gastos: 35000 },
  { month: 'Mar', ingresos: 48000, gastos: 30000 },
  { month: 'Abr', ingresos: 61000, gastos: 38000 },
  { month: 'May', ingresos: 55000, gastos: 34000 },
  { month: 'Jun', ingresos: 67000, gastos: 40000 },
]

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
  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader>
        <CardTitle>Resumen de Citas</CardTitle>
        <CardDescription>Citas por mes - Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={appointmentsConfig} className="h-[300px] w-full">
          <BarChart data={appointmentsData} accessibilityLayer>
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
  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader>
        <CardTitle>Crecimiento de Pacientes</CardTitle>
        <CardDescription>Pacientes nuevos vs retorno</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={patientGrowthConfig} className="h-[300px] w-full">
          <LineChart data={patientGrowthData} accessibilityLayer>
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
              data={departmentData}
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
              {departmentData.map((entry, index) => (
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
  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader>
        <CardTitle>Análisis Financiero</CardTitle>
        <CardDescription>Ingresos vs Gastos mensuales</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="h-[300px] w-full">
          <AreaChart data={revenueData} accessibilityLayer>
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

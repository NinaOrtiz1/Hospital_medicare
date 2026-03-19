'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Filter,
  CalendarPlus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Video,
  MapPin,
} from 'lucide-react'

interface Appointment {
  id: string
  patient: {
    name: string
    avatar?: string
  }
  doctor: {
    name: string
    specialty: string
  }
  date: string
  time: string
  type: 'presencial' | 'virtual'
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress'
  reason: string
}

const appointments: Appointment[] = [
  {
    id: '1',
    patient: { name: 'María García López' },
    doctor: { name: 'Dr. Roberto García', specialty: 'Cardiología' },
    date: '2024-03-18',
    time: '09:00',
    type: 'presencial',
    status: 'scheduled',
    reason: 'Consulta de seguimiento',
  },
  {
    id: '2',
    patient: { name: 'Juan Pérez Rodríguez' },
    doctor: { name: 'Dra. Ana Rodríguez', specialty: 'Pediatría' },
    date: '2024-03-18',
    time: '10:30',
    type: 'virtual',
    status: 'in-progress',
    reason: 'Revisión de resultados',
  },
  {
    id: '3',
    patient: { name: 'Ana Martínez Sánchez' },
    doctor: { name: 'Dr. Carlos Méndez', specialty: 'Neurología' },
    date: '2024-03-18',
    time: '11:00',
    type: 'presencial',
    status: 'completed',
    reason: 'Primera consulta',
  },
  {
    id: '4',
    patient: { name: 'Carlos Ruiz Hernández' },
    doctor: { name: 'Dra. Laura Torres', specialty: 'Traumatología' },
    date: '2024-03-18',
    time: '14:00',
    type: 'presencial',
    status: 'cancelled',
    reason: 'Control post-operatorio',
  },
  {
    id: '5',
    patient: { name: 'Laura Sánchez Torres' },
    doctor: { name: 'Dr. Miguel Sánchez', specialty: 'Medicina General' },
    date: '2024-03-18',
    time: '15:30',
    type: 'virtual',
    status: 'scheduled',
    reason: 'Chequeo general',
  },
  {
    id: '6',
    patient: { name: 'Pedro Hernández Díaz' },
    doctor: { name: 'Dra. Patricia López', specialty: 'Ginecología' },
    date: '2024-03-19',
    time: '09:00',
    type: 'presencial',
    status: 'scheduled',
    reason: 'Consulta prenatal',
  },
]

const statusStyles = {
  scheduled: {
    bg: 'bg-info/10',
    text: 'text-info',
    label: 'Programada',
    icon: Clock,
  },
  'in-progress': {
    bg: 'bg-warning/10',
    text: 'text-warning',
    label: 'En Curso',
    icon: Clock,
  },
  completed: {
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Completada',
    icon: CheckCircle,
  },
  cancelled: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    label: 'Cancelada',
    icon: XCircle,
  },
}

export function AppointmentsSection() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [dateFilter, setDateFilter] = React.useState<string>('')

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || appointment.status === statusFilter
    const matchesDate = !dateFilter || appointment.date === dateFilter
    return matchesSearch && matchesStatus && matchesDate
  })

  const todaysAppointments = appointments.filter(
    (a) => a.date === '2024-03-18' && a.status !== 'cancelled'
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Citas</h1>
          <p className="text-muted-foreground">
            Gestiona las citas médicas del hospital
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <CalendarPlus className="w-4 h-4" aria-hidden="true" />
          Nueva Cita
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="transition-smooth hover:shadow-md">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {todaysAppointments.length}
            </div>
            <p className="text-sm text-muted-foreground">Citas de hoy</p>
          </CardContent>
        </Card>
        <Card className="transition-smooth hover:shadow-md">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-info">
              {appointments.filter((a) => a.status === 'scheduled').length}
            </div>
            <p className="text-sm text-muted-foreground">Programadas</p>
          </CardContent>
        </Card>
        <Card className="transition-smooth hover:shadow-md">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {appointments.filter((a) => a.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>
        <Card className="transition-smooth hover:shadow-md">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">
              {appointments.filter((a) => a.status === 'cancelled').length}
            </div>
            <p className="text-sm text-muted-foreground">Canceladas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Buscar por paciente o doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Buscar citas"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-auto"
                aria-label="Filtrar por fecha"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]" aria-label="Filtrar por estado">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="scheduled">Programadas</SelectItem>
                  <SelectItem value="in-progress">En Curso</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Citas</CardTitle>
          <CardDescription>
            {filteredAppointments.length} citas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  const status = statusStyles[appointment.status]
                  const StatusIcon = status.icon
                  return (
                    <TableRow
                      key={appointment.id}
                      className="transition-smooth hover:bg-accent/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={appointment.patient.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {appointment.patient.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{appointment.patient.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.doctor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctor.specialty}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {new Date(appointment.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.time}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'gap-1',
                            appointment.type === 'virtual'
                              ? 'text-info'
                              : 'text-foreground'
                          )}
                        >
                          {appointment.type === 'virtual' ? (
                            <Video className="w-3 h-3" aria-hidden="true" />
                          ) : (
                            <MapPin className="w-3 h-3" aria-hidden="true" />
                          )}
                          {appointment.type === 'virtual' ? 'Virtual' : 'Presencial'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <span className="text-sm text-muted-foreground truncate block">
                          {appointment.reason}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('gap-1', status.bg, status.text)}>
                          <StatusIcon className="w-3 h-3" aria-hidden="true" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Acciones para cita de ${appointment.patient.name}`}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              Reprogramar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-success">
                              Marcar Completada
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive">
                              Cancelar Cita
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

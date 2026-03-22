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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Search,
  Filter,
  CalendarPlus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
} from 'lucide-react'

interface Patient {
  id: number
  nombre: string
  apellido: string
}

interface Doctor {
  id: number
  nombre: string
  apellido: string
  especialidad: string
}

interface Appointment {
  id: number
  paciente_id: number
  medico_id: number
  fecha_hora: string
  motivo: string
  estado: string
  paciente_nombre: string
  paciente_apellido: string
  medico_nombre: string
  medico_apellido: string
}




export function AppointmentsSection() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [doctors, setDoctors] = React.useState<Doctor[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [editingAppointment, setEditingAppointment] = React.useState<Appointment | null>(null)
  const [deleteAppointmentId, setDeleteAppointmentId] = React.useState<number | null>(null)
  const [newAppointment, setNewAppointment] = React.useState({
    paciente_id: '',
    medico_id: '',
    fecha_hora: '',
    motivo: '',
    estado: 'programada'
  })

  React.useEffect(() => {
    fetchAppointments()
    fetchPatients()
    fetchDoctors()
  }, [])

  const fetchAppointments = () => {
    fetch('/api/citas')
      .then(response => response.json())
      .then(data => {
        setAppointments(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching appointments:', error)
        setLoading(false)
      })
  }

  const fetchPatients = () => {
    fetch('/api/pacientes')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error('Error fetching patients:', error))
  }

  const fetchDoctors = () => {
    fetch('/api/medicos')
      .then(response => response.json())
      .then(data => setDoctors(data))
      .catch(error => console.error('Error fetching doctors:', error))
  }

  const handleAddAppointment = async () => {
    try {
      const response = await fetch('/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAppointment,
          paciente_id: parseInt(newAppointment.paciente_id),
          medico_id: parseInt(newAppointment.medico_id)
        }),
      })
      const result = await response.json()
      if (result.id) {
        setIsAddModalOpen(false)
        setNewAppointment({
          paciente_id: '',
          medico_id: '',
          fecha_hora: '',
          motivo: '',
          estado: 'programada'
        })
        fetchAppointments() // Refresh list
      }
    } catch (error) {
      console.error('Error adding appointment:', error)
    }
  }

  const handleEditAppointment = async () => {
    if (!editingAppointment) return

    try {
      const response = await fetch(`/api/citas?id=${editingAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAppointment),
      })
      const result = await response.json()
      if (result.affected > 0) {
        setIsEditModalOpen(false)
        setEditingAppointment(null)
        fetchAppointments() // Refresh list
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const handleDeleteAppointment = async () => {
    if (!deleteAppointmentId) return

    try {
      const response = await fetch(`/api/citas?id=${deleteAppointmentId}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.affected > 0) {
        setDeleteAppointmentId(null)
        fetchAppointments() // Refresh list
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
    }
  }

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/citas?id=${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      })
      const result = await response.json()
      if (result.affected > 0) {
        fetchAppointments() // Refresh list
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setIsEditModalOpen(true)
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const fullName = `${appointment.paciente_nombre} ${appointment.paciente_apellido}`.toLowerCase()
    const doctorName = `${appointment.medico_nombre} ${appointment.medico_apellido}`.toLowerCase()
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                         doctorName.includes(searchQuery.toLowerCase()) ||
                         appointment.motivo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || appointment.estado === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div>Cargando citas...</div>
  }

  const todaysAppointments = appointments.filter(
    (a) => new Date(a.fecha_hora).toDateString() === new Date().toDateString() && a.estado !== 'cancelada'
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
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <CalendarPlus className="w-4 h-4" aria-hidden="true" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Nueva Cita</DialogTitle>
              <DialogDescription>
                Complete la información de la cita.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label className="text-sm font-medium">Paciente</label>
                <Select value={newAppointment.paciente_id} onValueChange={(value) => setNewAppointment({...newAppointment, paciente_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.nombre} {patient.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Doctor</label>
                <Select value={newAppointment.medico_id} onValueChange={(value) => setNewAppointment({...newAppointment, medico_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        Dr. {doctor.nombre} {doctor.apellido} - {doctor.especialidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Fecha y Hora</label>
                <Input
                  type="datetime-local"
                  value={newAppointment.fecha_hora}
                  onChange={(e) => setNewAppointment({...newAppointment, fecha_hora: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Motivo</label>
                <Input
                  value={newAppointment.motivo}
                  onChange={(e) => setNewAppointment({...newAppointment, motivo: e.target.value})}
                  placeholder="Motivo de la cita"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddAppointment}>
                Agendar Cita
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Appointment Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cita</DialogTitle>
              <DialogDescription>
                Modifique la información de la cita.
              </DialogDescription>
            </DialogHeader>
            {editingAppointment && (
              <div className="grid gap-4 py-4">
                <div>
                  <label className="text-sm font-medium">Paciente</label>
                  <Select
                    value={editingAppointment.paciente_id.toString()}
                    onValueChange={(value) => setEditingAppointment({...editingAppointment, paciente_id: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.nombre} {patient.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Doctor</label>
                  <Select
                    value={editingAppointment.medico_id.toString()}
                    onValueChange={(value) => setEditingAppointment({...editingAppointment, medico_id: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          Dr. {doctor.nombre} {doctor.apellido} - {doctor.especialidad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha y Hora</label>
                  <Input
                    type="datetime-local"
                    value={editingAppointment.fecha_hora.slice(0, 16)}
                    onChange={(e) => setEditingAppointment({...editingAppointment, fecha_hora: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Motivo</label>
                  <Input
                    value={editingAppointment.motivo}
                    onChange={(e) => setEditingAppointment({...editingAppointment, motivo: e.target.value})}
                    placeholder="Motivo de la cita"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <Select
                    value={editingAppointment.estado}
                    onValueChange={(value) => setEditingAppointment({...editingAppointment, estado: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programada">Programada</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditAppointment}>
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteAppointmentId} onOpenChange={() => setDeleteAppointmentId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la cita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAppointment}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
              {appointments.filter((a) => a.estado === 'programada').length}
            </div>
            <p className="text-sm text-muted-foreground">Programadas</p>
          </CardContent>
        </Card>
        <Card className="transition-smooth hover:shadow-md">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {appointments.filter((a) => a.estado === 'completada').length}
            </div>
            <p className="text-sm text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>
        <Card className="transition-smooth hover:shadow-md">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">
              {appointments.filter((a) => a.estado === 'cancelada').length}
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
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]" aria-label="Filtrar por estado">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="programada">Programadas</SelectItem>
                  <SelectItem value="completada">Completadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
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
                  <TableHead>Motivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  return (
                    <TableRow
                      key={appointment.id}
                      className="transition-smooth hover:bg-accent/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {appointment.paciente_nombre[0]}{appointment.paciente_apellido[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{appointment.paciente_nombre} {appointment.paciente_apellido}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">Dr. {appointment.medico_nombre} {appointment.medico_apellido}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {new Date(appointment.fecha_hora).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(appointment.fecha_hora).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <span className="text-sm text-muted-foreground truncate block">
                          {appointment.motivo}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('gap-1',
                          appointment.estado === 'programada' ? 'bg-blue-100 text-blue-800' :
                          appointment.estado === 'completada' ? 'bg-green-100 text-green-800' :
                          appointment.estado === 'cancelada' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        )}>
                          {appointment.estado === 'programada' ? 'Programada' :
                           appointment.estado === 'completada' ? 'Completada' :
                           appointment.estado === 'cancelada' ? 'Cancelada' : 'Desconocido'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Acciones para cita de ${appointment.paciente_nombre} ${appointment.paciente_apellido}`}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => openEditModal(appointment)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar Cita
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleStatusChange(appointment.id, 'completada')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar Completada
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleStatusChange(appointment.id, 'cancelada')}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar Cita
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer text-destructive focus:text-destructive"
                              onClick={() => setDeleteAppointmentId(appointment.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar Cita
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

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  UserPlus,
  Search,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

interface Doctor {
  id: number
  nombre: string
  apellido: string
  especialidad: string
  telefono: string
  email: string
  cedula_profesional: string
  created_at: string
  updated_at: string
}


export function DoctorsSection() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [editingDoctor, setEditingDoctor] = React.useState<Doctor | null>(null)
  const [deleteDoctorId, setDeleteDoctorId] = React.useState<number | null>(null)
  const [newDoctor, setNewDoctor] = React.useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    telefono: '',
    email: '',
    cedula_profesional: ''
  })

  React.useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = () => {
    fetch('/api/medicos')
      .then(response => response.json())
      .then(data => {
        setDoctors(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching doctors:', error)
        setLoading(false)
      })
  }

  const handleAddDoctor = async () => {
    try {
      const response = await fetch('/api/medicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDoctor),
      })
      const result = await response.json()
      if (result.id) {
        setIsAddModalOpen(false)
        setNewDoctor({
          nombre: '',
          apellido: '',
          especialidad: '',
          telefono: '',
          email: '',
          cedula_profesional: ''
        })
        fetchDoctors() // Refresh list
      }
    } catch (error) {
      console.error('Error adding doctor:', error)
    }
  }

  const handleEditDoctor = async () => {
    if (!editingDoctor) return

    try {
      const response = await fetch(`/api/medicos?id=${editingDoctor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingDoctor),
      })
      const result = await response.json()
      if (result.affected > 0) {
        setIsEditModalOpen(false)
        setEditingDoctor(null)
        fetchDoctors() // Refresh list
      }
    } catch (error) {
      console.error('Error updating doctor:', error)
    }
  }

  const handleDeleteDoctor = async () => {
    if (!deleteDoctorId) return

    try {
      const response = await fetch(`/api/medicos?id=${deleteDoctorId}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.affected > 0) {
        setDeleteDoctorId(null)
        fetchDoctors() // Refresh list
      }
    } catch (error) {
      console.error('Error deleting doctor:', error)
    }
  }

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setIsEditModalOpen(true)
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.nombre} ${doctor.apellido}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase()) ||
           doctor.especialidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
           doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (loading) {
    return <div>Cargando doctores...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctores</h1>
          <p className="text-muted-foreground">
            Directorio de profesionales médicos
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              Agregar Doctor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Doctor</DialogTitle>
              <DialogDescription>
                Complete la información del doctor.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    value={newDoctor.nombre}
                    onChange={(e) => setNewDoctor({...newDoctor, nombre: e.target.value})}
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Apellido</label>
                  <Input
                    value={newDoctor.apellido}
                    onChange={(e) => setNewDoctor({...newDoctor, apellido: e.target.value})}
                    placeholder="Apellido"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Especialidad</label>
                <Input
                  value={newDoctor.especialidad}
                  onChange={(e) => setNewDoctor({...newDoctor, especialidad: e.target.value})}
                  placeholder="Especialidad"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input
                    value={newDoctor.telefono}
                    onChange={(e) => setNewDoctor({...newDoctor, telefono: e.target.value})}
                    placeholder="Teléfono"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Cédula Profesional</label>
                <Input
                  value={newDoctor.cedula_profesional}
                  onChange={(e) => setNewDoctor({...newDoctor, cedula_profesional: e.target.value})}
                  placeholder="Cédula Profesional"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddDoctor}>
                Agregar Doctor
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Doctor Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Doctor</DialogTitle>
              <DialogDescription>
                Modifique la información del doctor.
              </DialogDescription>
            </DialogHeader>
            {editingDoctor && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre</label>
                    <Input
                      value={editingDoctor.nombre}
                      onChange={(e) => setEditingDoctor({...editingDoctor, nombre: e.target.value})}
                      placeholder="Nombre"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Apellido</label>
                    <Input
                      value={editingDoctor.apellido}
                      onChange={(e) => setEditingDoctor({...editingDoctor, apellido: e.target.value})}
                      placeholder="Apellido"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Especialidad</label>
                  <Input
                    value={editingDoctor.especialidad}
                    onChange={(e) => setEditingDoctor({...editingDoctor, especialidad: e.target.value})}
                    placeholder="Especialidad"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input
                      value={editingDoctor.telefono}
                      onChange={(e) => setEditingDoctor({...editingDoctor, telefono: e.target.value})}
                      placeholder="Teléfono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={editingDoctor.email}
                      onChange={(e) => setEditingDoctor({...editingDoctor, email: e.target.value})}
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Cédula Profesional</label>
                  <Input
                    value={editingDoctor.cedula_profesional}
                    onChange={(e) => setEditingDoctor({...editingDoctor, cedula_profesional: e.target.value})}
                    placeholder="Cédula Profesional"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditDoctor}>
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Buscar por nombre, especialidad o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Buscar doctores"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="overflow-hidden transition-smooth hover:shadow-lg hover:-translate-y-0.5 group"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {doctor.nombre[0]}{doctor.apellido[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    Dr. {doctor.nombre} {doctor.apellido}
                  </h3>
                  <Badge variant="secondary" className="mt-1">
                    {doctor.especialidad}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cédula: {doctor.cedula_profesional}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEditModal(doctor)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteDoctorId(doctor.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {doctor.telefono}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  Agendar Cita
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDoctorId} onOpenChange={() => setDeleteDoctorId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al doctor
              y todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDoctor} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

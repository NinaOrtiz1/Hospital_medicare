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
  UserPlus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  Phone,
  Mail,
} from 'lucide-react'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: 'M' | 'F'
  bloodType: string
  lastVisit: string
  status: 'active' | 'inactive' | 'critical'
  avatar?: string
}

const patients: Patient[] = [
  {
    id: '1',
    name: 'María García López',
    email: 'maria.garcia@email.com',
    phone: '+52 555 123 4567',
    age: 34,
    gender: 'F',
    bloodType: 'O+',
    lastVisit: '2024-03-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Juan Pérez Rodríguez',
    email: 'juan.perez@email.com',
    phone: '+52 555 234 5678',
    age: 45,
    gender: 'M',
    bloodType: 'A-',
    lastVisit: '2024-03-14',
    status: 'critical',
  },
  {
    id: '3',
    name: 'Ana Martínez Sánchez',
    email: 'ana.martinez@email.com',
    phone: '+52 555 345 6789',
    age: 28,
    gender: 'F',
    bloodType: 'B+',
    lastVisit: '2024-03-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Carlos Ruiz Hernández',
    email: 'carlos.ruiz@email.com',
    phone: '+52 555 456 7890',
    age: 52,
    gender: 'M',
    bloodType: 'AB+',
    lastVisit: '2024-02-28',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Laura Sánchez Torres',
    email: 'laura.sanchez@email.com',
    phone: '+52 555 567 8901',
    age: 39,
    gender: 'F',
    bloodType: 'O-',
    lastVisit: '2024-03-12',
    status: 'active',
  },
  {
    id: '6',
    name: 'Pedro Hernández Díaz',
    email: 'pedro.hernandez@email.com',
    phone: '+52 555 678 9012',
    age: 61,
    gender: 'M',
    bloodType: 'A+',
    lastVisit: '2024-03-16',
    status: 'critical',
  },
]

const statusStyles = {
  active: {
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Activo',
  },
  inactive: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    label: 'Inactivo',
  },
  critical: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    label: 'Crítico',
  },
}

export function PatientsSection() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
          <p className="text-muted-foreground">
            Gestiona la información de los pacientes del hospital
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          Nuevo Paciente
        </Button>
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
                placeholder="Buscar por nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Buscar pacientes"
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
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="critical">Críticos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            {filteredPatients.length} pacientes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Tipo de Sangre</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => {
                  const status = statusStyles[patient.status]
                  return (
                    <TableRow key={patient.id} className="transition-smooth hover:bg-accent/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={patient.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {patient.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: #{patient.id.padStart(5, '0')}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                            {patient.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" aria-hidden="true" />
                            {patient.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{patient.age}</span>
                        <span className="text-muted-foreground ml-1">
                          ({patient.gender})
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {patient.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(patient.lastVisit).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('gap-1', status.bg, status.text)}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Acciones para ${patient.name}`}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="w-4 h-4" />
                              Ver Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <FileText className="w-4 h-4" />
                              Historial Médico
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Edit className="w-4 h-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                              <Trash2 className="w-4 h-4" />
                              Eliminar
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

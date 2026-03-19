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
  Search,
  Filter,
  UserPlus,
  Star,
  Calendar,
  Clock,
  Phone,
  Mail,
} from 'lucide-react'

interface Doctor {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  rating: number
  patients: number
  availability: 'available' | 'busy' | 'off'
  schedule: string
  avatar?: string
}

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Roberto García',
    email: 'roberto.garcia@hospital.com',
    phone: '+52 555 111 2222',
    specialty: 'Cardiología',
    rating: 4.9,
    patients: 245,
    availability: 'available',
    schedule: 'Lun-Vie 8:00-16:00',
  },
  {
    id: '2',
    name: 'Dra. Ana Rodríguez',
    email: 'ana.rodriguez@hospital.com',
    phone: '+52 555 222 3333',
    specialty: 'Pediatría',
    rating: 4.8,
    patients: 312,
    availability: 'busy',
    schedule: 'Lun-Sab 9:00-17:00',
  },
  {
    id: '3',
    name: 'Dr. Carlos Méndez',
    email: 'carlos.mendez@hospital.com',
    phone: '+52 555 333 4444',
    specialty: 'Neurología',
    rating: 4.7,
    patients: 189,
    availability: 'available',
    schedule: 'Mar-Sab 10:00-18:00',
  },
  {
    id: '4',
    name: 'Dra. Laura Torres',
    email: 'laura.torres@hospital.com',
    phone: '+52 555 444 5555',
    specialty: 'Traumatología',
    rating: 4.9,
    patients: 267,
    availability: 'off',
    schedule: 'Lun-Vie 7:00-15:00',
  },
  {
    id: '5',
    name: 'Dr. Miguel Sánchez',
    email: 'miguel.sanchez@hospital.com',
    phone: '+52 555 555 6666',
    specialty: 'Medicina General',
    rating: 4.6,
    patients: 421,
    availability: 'available',
    schedule: 'Lun-Dom 8:00-20:00',
  },
  {
    id: '6',
    name: 'Dra. Patricia López',
    email: 'patricia.lopez@hospital.com',
    phone: '+52 555 666 7777',
    specialty: 'Ginecología',
    rating: 4.8,
    patients: 298,
    availability: 'busy',
    schedule: 'Lun-Vie 9:00-17:00',
  },
]

const availabilityStyles = {
  available: {
    bg: 'bg-success/10',
    text: 'text-success',
    dot: 'bg-success',
    label: 'Disponible',
  },
  busy: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    dot: 'bg-warning',
    label: 'Ocupado',
  },
  off: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
    label: 'No disponible',
  },
}

const specialties = [
  'Cardiología',
  'Pediatría',
  'Neurología',
  'Traumatología',
  'Medicina General',
  'Ginecología',
]

export function DoctorsSection() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [specialtyFilter, setSpecialtyFilter] = React.useState<string>('all')

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty =
      specialtyFilter === 'all' || doctor.specialty === specialtyFilter
    return matchesSearch && matchesSpecialty
  })

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
        <Button className="gap-2 shadow-sm">
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          Agregar Doctor
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
                placeholder="Buscar por nombre o especialidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Buscar doctores"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[180px]" aria-label="Filtrar por especialidad">
                  <SelectValue placeholder="Especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => {
          const availability = availabilityStyles[doctor.availability]
          return (
            <Card
              key={doctor.id}
              className="overflow-hidden transition-smooth hover:shadow-lg hover:-translate-y-0.5 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-border">
                    <AvatarImage src={doctor.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {doctor.name
                        .split(' ')
                        .slice(1)
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">
                        {doctor.name}
                      </h3>
                      <div className={cn('w-2 h-2 rounded-full', availability.dot)} />
                    </div>
                    <Badge variant="secondary" className="mt-1">
                      {doctor.specialty}
                    </Badge>
                    <div className="mt-2 flex items-center gap-1">
                      <Star
                        className="w-4 h-4 text-warning fill-warning"
                        aria-hidden="true"
                      />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({doctor.patients} pacientes)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {doctor.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {doctor.schedule}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge className={cn(availability.bg, availability.text)}>
                    {availability.label}
                  </Badge>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    Agendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  FileText,
  Calendar,
  Pill,
  Stethoscope,
  Activity,
  Syringe,
  TestTube,
  Download,
  Printer,
  User,
} from 'lucide-react'

interface MedicalRecord {
  id: string
  date: string
  type: 'consulta' | 'laboratorio' | 'receta' | 'procedimiento' | 'vacunacion'
  title: string
  doctor: string
  specialty: string
  notes: string
  attachments?: string[]
}

interface PatientHistory {
  id: string
  name: string
  dateOfBirth: string
  age?: number
  bloodType: string
  allergies: string[]
  chronicConditions: string[]
  records: MedicalRecord[]
}

interface Patient {
  id: string
  nombre: string
  apellido: string
}


const recordTypeConfig = {
  consulta: {
    icon: Stethoscope,
    bg: 'bg-info/10',
    text: 'text-info',
    label: 'Consulta',
  },
  laboratorio: {
    icon: TestTube,
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Laboratorio',
  },
  receta: {
    icon: Pill,
    bg: 'bg-warning/10',
    text: 'text-warning',
    label: 'Receta',
  },
  procedimiento: {
    icon: Activity,
    bg: 'bg-primary/10',
    text: 'text-primary',
    label: 'Procedimiento',
  },
  vacunacion: {
    icon: Syringe,
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Vacunación',
  },
}

export function MedicalHistorySection() {
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = React.useState<string>('')
  const [patientHistory, setPatientHistory] = React.useState<PatientHistory | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [loadingPatients, setLoadingPatients] = React.useState(true)

  // Fetch patients list
  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/pacientes')
        if (!response.ok) throw new Error('Failed to fetch patients')
        const data = await response.json()
        setPatients(data)
        if (data.length > 0) {
          setSelectedPatientId(data[0].id.toString())
        }
      } catch (error) {
        console.error('Error fetching patients:', error)
        setPatients([])
      } finally {
        setLoadingPatients(false)
      }
    }
    fetchPatients()
  }, [])

  // Fetch patient history when patient changes
  React.useEffect(() => {
    if (!selectedPatientId) return

    const fetchPatientHistory = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/historial?patientId=${selectedPatientId}`)
        if (!response.ok) throw new Error('Failed to fetch patient history')
        const data = await response.json()
        setPatientHistory(data)
      } catch (error) {
        console.error('Error fetching patient history:', error)
        setPatientHistory(null)
      } finally {
        setLoading(false)
      }
    }
    fetchPatientHistory()
  }, [selectedPatientId])

  const filteredRecords = React.useMemo(() => {
    if (!patientHistory) return []
    return patientHistory.records.filter((record) =>
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [patientHistory, searchQuery])

  if (loadingPatients) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px] lg:col-span-2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Patient Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Historial Médico</h2>
          <p className="text-muted-foreground">
            Consulta el historial médico completo de los pacientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="w-[250px]">
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
      </div>

      {!patientHistory ? (
        <Card>
          <CardContent className="py-8 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Selecciona un paciente para ver su historial médico</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {patientHistory.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{patientHistory.name}</CardTitle>
                  <CardDescription>
                    {patientHistory.age ? `${patientHistory.age} años` : 'Edad no disponible'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de Nacimiento</span>
                  <span className="text-sm font-medium">
                    {new Date(patientHistory.dateOfBirth).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipo de Sangre</span>
                  <Badge variant="outline" className="font-mono">
                    {patientHistory.bloodType}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-foreground mb-2">Alergias</h4>
                <div className="flex flex-wrap gap-2">
                  {patientHistory.allergies.length > 0 ? patientHistory.allergies.map((allergy) => (
                    <Badge
                      key={allergy}
                      variant="secondary"
                      className="bg-destructive/10 text-destructive"
                    >
                      {allergy}
                    </Badge>
                  )) : (
                    <span className="text-sm text-muted-foreground">No registradas</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Condiciones Crónicas</h4>
                <div className="flex flex-wrap gap-2">
                  {patientHistory.chronicConditions.length > 0 ? patientHistory.chronicConditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="bg-warning/10 text-warning">
                      {condition}
                    </Badge>
                  )) : (
                    <span className="text-sm text-muted-foreground">No registradas</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Records */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Registros Médicos</CardTitle>
                  <CardDescription>
                    {loading ? 'Cargando...' : `${filteredRecords.length} registros encontrados`}
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    placeholder="Buscar en historial..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-[250px]"
                    aria-label="Buscar en historial médico"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredRecords.map((record) => {
                      const config = recordTypeConfig[record.type]
                      const Icon = config.icon
                      return (
                        <AccordionItem
                          key={record.id}
                          value={record.id}
                          className="border rounded-lg px-4 transition-smooth hover:shadow-md"
                        >
                          <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-start gap-4 text-left">
                              <div
                                className={cn(
                                  'flex items-center justify-center w-10 h-10 rounded-lg shrink-0',
                                  config.bg
                                )}
                              >
                                <Icon className={cn('w-5 h-5', config.text)} aria-hidden="true" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge className={cn('text-xs', config.bg, config.text)}>
                                    {config.label}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" aria-hidden="true" />
                                    {new Date(record.date).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <h4 className="font-medium text-foreground mt-1 truncate">
                                  {record.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {record.doctor} - {record.specialty}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4">
                            <div className="pl-14 space-y-4">
                              <div>
                                <h5 className="font-medium text-sm text-foreground mb-2">
                                  Notas Médicas
                                </h5>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {record.notes}
                                </p>
                              </div>
                              {record.attachments && record.attachments.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-sm text-foreground mb-2">
                                    Archivos Adjuntos
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {record.attachments.map((file) => (
                                      <Button
                                        key={file}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 text-xs"
                                      >
                                        <FileText className="w-3 h-3" aria-hidden="true" />
                                        {file}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                  {filteredRecords.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No se encontraron registros médicos</p>
                    </div>
                  )}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

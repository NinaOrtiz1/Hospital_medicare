'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
} from 'lucide-react'

interface MedicalRecord {
  id: string
  date: string
  type: 'consultation' | 'lab' | 'prescription' | 'procedure' | 'vaccination'
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
  bloodType: string
  allergies: string[]
  chronicConditions: string[]
  records: MedicalRecord[]
}

const patientHistory: PatientHistory = {
  id: '1',
  name: 'María García López',
  dateOfBirth: '1990-05-15',
  bloodType: 'O+',
  allergies: ['Penicilina', 'Mariscos'],
  chronicConditions: ['Hipertensión', 'Diabetes Tipo 2'],
  records: [
    {
      id: '1',
      date: '2024-03-15',
      type: 'consultation',
      title: 'Consulta de Seguimiento - Cardiología',
      doctor: 'Dr. Roberto García',
      specialty: 'Cardiología',
      notes:
        'Paciente presenta mejoría en niveles de presión arterial. Se mantiene medicación actual. Control en 3 meses.',
      attachments: ['ECG_20240315.pdf'],
    },
    {
      id: '2',
      date: '2024-03-10',
      type: 'lab',
      title: 'Análisis de Sangre Completo',
      doctor: 'Dr. Miguel Sánchez',
      specialty: 'Laboratorio',
      notes:
        'Glucosa: 120 mg/dL, Colesterol Total: 195 mg/dL, Triglicéridos: 150 mg/dL. Valores dentro de rango controlado.',
      attachments: ['LAB_20240310.pdf'],
    },
    {
      id: '3',
      date: '2024-02-28',
      type: 'prescription',
      title: 'Receta Médica',
      doctor: 'Dr. Roberto García',
      specialty: 'Cardiología',
      notes:
        'Losartán 50mg - 1 tableta cada 12 horas. Metformina 850mg - 1 tableta con cada comida.',
    },
    {
      id: '4',
      date: '2024-02-15',
      type: 'vaccination',
      title: 'Vacunación Anual - Influenza',
      doctor: 'Dra. Ana Rodríguez',
      specialty: 'Medicina Preventiva',
      notes: 'Vacuna de influenza aplicada sin complicaciones. Próxima dosis: 2025.',
    },
    {
      id: '5',
      date: '2024-01-20',
      type: 'procedure',
      title: 'Electrocardiograma',
      doctor: 'Dr. Roberto García',
      specialty: 'Cardiología',
      notes:
        'ECG en reposo sin alteraciones significativas. Ritmo sinusal normal. FC: 72 lpm.',
      attachments: ['ECG_20240120.pdf', 'Informe_ECG.pdf'],
    },
  ],
}

const recordTypeConfig = {
  consultation: {
    icon: Stethoscope,
    bg: 'bg-info/10',
    text: 'text-info',
    label: 'Consulta',
  },
  lab: {
    icon: TestTube,
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Laboratorio',
  },
  prescription: {
    icon: Pill,
    bg: 'bg-warning/10',
    text: 'text-warning',
    label: 'Receta',
  },
  procedure: {
    icon: Activity,
    bg: 'bg-primary/10',
    text: 'text-primary',
    label: 'Procedimiento',
  },
  vaccination: {
    icon: Syringe,
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Vacunación',
  },
}

export function MedicalHistorySection() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredRecords = patientHistory.records.filter(
    (record) =>
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Historial Médico</h1>
          <p className="text-muted-foreground">
            Consulta y gestiona el historial clínico de los pacientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" aria-hidden="true" />
            Imprimir
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" aria-hidden="true" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Información del Paciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  MG
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{patientHistory.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ID: #{patientHistory.id.padStart(5, '0')}
                </p>
              </div>
            </div>

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
                {patientHistory.allergies.map((allergy) => (
                  <Badge
                    key={allergy}
                    variant="secondary"
                    className="bg-destructive/10 text-destructive"
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Condiciones Crónicas</h4>
              <div className="flex flex-wrap gap-2">
                {patientHistory.chronicConditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="bg-warning/10 text-warning">
                    {condition}
                  </Badge>
                ))}
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
                  {filteredRecords.length} registros encontrados
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

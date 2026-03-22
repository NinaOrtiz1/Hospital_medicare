'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Save,
  RefreshCw,
} from 'lucide-react'

export function SettingsSection() {
  const [settings, setSettings] = React.useState({
    // Perfil
    nombre: '',
    email: '',
    telefono: '',
    especialidad: '',

    // Notificaciones
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    systemAlerts: true,

    // Apariencia
    theme: 'system',
    language: 'es',
    timezone: 'America/Mexico_City',

    // Sistema
    autoSave: true,
    dataRetention: '1year',
    backupFrequency: 'daily',
  })

  const [hasChanges, setHasChanges] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // For demo purposes, using user ID 1. In a real app, this would come from authentication
      const response = await fetch('/api/configuracion?userId=1')
      if (!response.ok) throw new Error('Failed to fetch settings')
      const data = await response.json()

      setSettings({
        nombre: data.nombre || 'Dr. Carlos Mendoza',
        email: data.email || 'carlos.mendoza@hospital.com',
        telefono: data.telefono || '+52 55 1234 5678',
        especialidad: data.especialidad || 'Medicina General',
        emailNotifications: data.email_notifications !== undefined ? data.email_notifications : true,
        pushNotifications: data.push_notifications !== undefined ? data.push_notifications : true,
        smsNotifications: data.sms_notifications !== undefined ? data.sms_notifications : false,
        appointmentReminders: data.appointment_reminders !== undefined ? data.appointment_reminders : true,
        systemAlerts: data.system_alerts !== undefined ? data.system_alerts : true,
        theme: data.theme || 'system',
        language: data.language || 'es',
        timezone: data.timezone || 'America/Mexico_City',
        autoSave: data.auto_save !== undefined ? data.auto_save : true,
        dataRetention: data.data_retention || '1year',
        backupFrequency: data.backup_frequency || 'daily',
      })
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Keep default values
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/configuracion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // In a real app, this would come from authentication
          email_notifications: settings.emailNotifications,
          push_notifications: settings.pushNotifications,
          sms_notifications: settings.smsNotifications,
          appointment_reminders: settings.appointmentReminders,
          system_alerts: settings.systemAlerts,
          theme: settings.theme,
          language: settings.language,
          timezone: settings.timezone,
          auto_save: settings.autoSave,
          data_retention: settings.dataRetention,
          backup_frequency: settings.backupFrequency,
        }),
      })

      if (response.ok) {
        setHasChanges(false)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      // In a real app, you might show an error message to the user
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    // Reset to default values
    setSettings({
      nombre: 'Dr. Carlos Mendoza',
      email: 'carlos.mendoza@hospital.com',
      telefono: '+52 55 1234 5678',
      especialidad: 'Medicina General',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      systemAlerts: true,
      theme: 'system',
      language: 'es',
      timezone: 'America/Mexico_City',
      autoSave: true,
      dataRetention: '1year',
      backupFrequency: 'daily',
    })
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground">
            Personaliza tu experiencia en el sistema hospitalario
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Restablecer
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil de Usuario
            </CardTitle>
            <CardDescription>
              Información personal y profesional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={settings.nombre}
                  onChange={(e) => handleSettingChange('nombre', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Input
                  id="especialidad"
                  value={settings.especialidad}
                  onChange={(e) => handleSettingChange('especialidad', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={settings.telefono}
                onChange={(e) => handleSettingChange('telefono', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Configura cómo quieres recibir las notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe actualizaciones por correo electrónico
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones Push</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones en el navegador
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe alertas importantes por SMS
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios de Citas</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe recordatorios antes de las citas
                </p>
              </div>
              <Switch
                checked={settings.appointmentReminders}
                onCheckedChange={(checked) => handleSettingChange('appointmentReminders', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas del Sistema</Label>
                <p className="text-sm text-muted-foreground">
                  Notificaciones de mantenimiento y actualizaciones
                </p>
              </div>
              <Switch
                checked={settings.systemAlerts}
                onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Apariencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Apariencia
            </CardTitle>
            <CardDescription>
              Personaliza la apariencia del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleSettingChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleSettingChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                  <SelectItem value="America/Monterrey">Monterrey (GMT-6)</SelectItem>
                  <SelectItem value="America/Tijuana">Tijuana (GMT-8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Sistema
            </CardTitle>
            <CardDescription>
              Configuraciones avanzadas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Guardado Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Guarda automáticamente los cambios
                </p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="dataRetention">Retención de Datos</Label>
              <Select
                value={settings.dataRetention}
                onValueChange={(value) => handleSettingChange('dataRetention', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">6 meses</SelectItem>
                  <SelectItem value="1year">1 año</SelectItem>
                  <SelectItem value="2years">2 años</SelectItem>
                  <SelectItem value="indefinite">Indefinido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Frecuencia de Respaldo</Label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value) => handleSettingChange('backupFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Cada hora</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensualmente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de Cambios */}
      {hasChanges && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Cambios pendientes</span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Tienes cambios sin guardar. Recuerda hacer clic en "Guardar Cambios" para aplicar las modificaciones.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
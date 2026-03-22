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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Smartphone,
  Monitor,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useTheme } from 'next-themes'

interface SettingsPanelProps {
  className?: string
}

export function SettingsPanel({ className }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Configuración de notificaciones
  const [notificationSettings, setNotificationSettings] = React.useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    systemAlerts: true,
    marketingEmails: false,
  })

  // Configuración de apariencia
  const [appearanceSettings, setAppearanceSettings] = React.useState({
    theme: 'system',
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    itemsPerPage: '10',
  })

  // Configuración de privacidad
  const [privacySettings, setPrivacySettings] = React.useState({
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true,
    cookieConsent: true,
  })

  // Configuración del sistema
  const [systemSettings, setSystemSettings] = React.useState({
    autoSave: true,
    backupFrequency: 'daily',
    sessionTimeout: '30',
    twoFactorAuth: false,
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveSettings = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log('Guardando configuración...', {
      notifications: notificationSettings,
      appearance: appearanceSettings,
      privacy: privacySettings,
      system: systemSettings,
    })
    // Mostrar notificación de éxito
  }

  const handleResetSettings = () => {
    // Resetear a valores por defecto
    setNotificationSettings({
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      systemAlerts: true,
      marketingEmails: false,
    })
    setAppearanceSettings({
      theme: 'system',
      language: 'es',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      itemsPerPage: '10',
    })
    setPrivacySettings({
      profileVisibility: 'private',
      dataSharing: false,
      analyticsTracking: true,
      cookieConsent: true,
    })
    setSystemSettings({
      autoSave: true,
      backupFrequency: 'daily',
      sessionTimeout: '30',
      twoFactorAuth: false,
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={cn('w-full max-w-4xl mx-auto space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Personaliza tu experiencia en el sistema hospitalario
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restablecer
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Apariencia</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Privacidad</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Preferencias de Notificación
              </CardTitle>
              <CardDescription>
                Configura cómo y cuándo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Correo Electrónico
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Notificaciones por email</Label>
                      <Switch
                        id="email-notifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="appointment-reminders">Recordatorios de citas</Label>
                      <Switch
                        id="appointment-reminders"
                        checked={notificationSettings.appointmentReminders}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, appointmentReminders: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-emails">Emails de marketing</Label>
                      <Switch
                        id="marketing-emails"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Aplicación Móvil
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Notificaciones push</Label>
                      <Switch
                        id="push-notifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications">Mensajes SMS</Label>
                      <Switch
                        id="sms-notifications"
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-alerts">Alertas del sistema</Label>
                      <Switch
                        id="system-alerts"
                        checked={notificationSettings.systemAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Apariencia y Idioma
              </CardTitle>
              <CardDescription>
                Personaliza la apariencia y el idioma de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <Select
                      value={appearanceSettings.theme}
                      onValueChange={(value) =>
                        setAppearanceSettings(prev => ({ ...prev, theme: value }))
                      }
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

                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={appearanceSettings.language}
                      onValueChange={(value) =>
                        setAppearanceSettings(prev => ({ ...prev, language: value }))
                      }
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
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date-format">Formato de Fecha</Label>
                    <Select
                      value={appearanceSettings.dateFormat}
                      onValueChange={(value) =>
                        setAppearanceSettings(prev => ({ ...prev, dateFormat: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="time-format">Formato de Hora</Label>
                    <Select
                      value={appearanceSettings.timeFormat}
                      onValueChange={(value) =>
                        setAppearanceSettings(prev => ({ ...prev, timeFormat: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 horas</SelectItem>
                        <SelectItem value="24h">24 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="items-per-page">Elementos por página</Label>
                    <Select
                      value={appearanceSettings.itemsPerPage}
                      onValueChange={(value) =>
                        setAppearanceSettings(prev => ({ ...prev, itemsPerPage: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacidad y Seguridad
              </CardTitle>
              <CardDescription>
                Controla tu privacidad y configura medidas de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-visibility">Visibilidad del perfil</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) =>
                      setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                      <SelectItem value="team">Solo equipo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-sharing">Compartir datos anónimos</Label>
                      <p className="text-sm text-muted-foreground">
                        Ayuda a mejorar el sistema con datos de uso anónimos
                      </p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={privacySettings.dataSharing}
                      onCheckedChange={(checked) =>
                        setPrivacySettings(prev => ({ ...prev, dataSharing: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics-tracking">Seguimiento de analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite analizar el uso de la aplicación
                      </p>
                    </div>
                    <Switch
                      id="analytics-tracking"
                      checked={privacySettings.analyticsTracking}
                      onCheckedChange={(checked) =>
                        setPrivacySettings(prev => ({ ...prev, analyticsTracking: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cookie-consent">Consentimiento de cookies</Label>
                      <p className="text-sm text-muted-foreground">
                        Aceptar cookies para mejorar la experiencia
                      </p>
                    </div>
                    <Switch
                      id="cookie-consent"
                      checked={privacySettings.cookieConsent}
                      onCheckedChange={(checked) =>
                        setPrivacySettings(prev => ({ ...prev, cookieConsent: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription>
                Configura el comportamiento general del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backup-frequency">Frecuencia de respaldo</Label>
                    <Select
                      value={systemSettings.backupFrequency}
                      onValueChange={(value) =>
                        setSystemSettings(prev => ({ ...prev, backupFrequency: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Cada hora</SelectItem>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="session-timeout">Tiempo de sesión (minutos)</Label>
                    <Select
                      value={systemSettings.sessionTimeout}
                      onValueChange={(value) =>
                        setSystemSettings(prev => ({ ...prev, sessionTimeout: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="240">4 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-save">Guardado automático</Label>
                      <p className="text-sm text-muted-foreground">
                        Guardar automáticamente los cambios
                      </p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={systemSettings.autoSave}
                      onCheckedChange={(checked) =>
                        setSystemSettings(prev => ({ ...prev, autoSave: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor-auth">Autenticación de dos factores</Label>
                      <p className="text-sm text-muted-foreground">
                        Aumenta la seguridad de tu cuenta
                      </p>
                    </div>
                    <Switch
                      id="two-factor-auth"
                      checked={systemSettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSystemSettings(prev => ({ ...prev, twoFactorAuth: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
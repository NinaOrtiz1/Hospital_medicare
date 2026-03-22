'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Camera,
  Save,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react'

interface UserProfile {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  especialidad?: string
  cedula_profesional?: string
  rol: 'admin' | 'medico' | 'recepcionista'
  fecha_nacimiento?: string
  direccion?: string
  biografia?: string
  avatar?: string
  activo: boolean
  created_at: string
  updated_at: string
}

interface ProfilePanelProps {
  className?: string
}

export function ProfilePanel({ className }: ProfilePanelProps) {
  // Estado del perfil del usuario
  const [profile, setProfile] = React.useState<UserProfile>({
    id: '1',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    email: 'carlos.mendoza@hospital.com',
    telefono: '+52 55 1234 5678',
    especialidad: 'Medicina Interna',
    cedula_profesional: '12345678',
    rol: 'admin',
    fecha_nacimiento: '1985-06-15',
    direccion: 'Av. Reforma 123, Ciudad de México',
    biografia: 'Médico especialista en medicina interna con más de 15 años de experiencia en el sector hospitalario.',
    avatar: '/placeholder-avatar.jpg',
    activo: true,
    created_at: '2020-01-15T08:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  })

  // Estado para edición
  const [isEditing, setIsEditing] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  // Estado para cambios
  const [editedProfile, setEditedProfile] = React.useState<UserProfile>(profile)

  const handleSaveProfile = () => {
    // Aquí iría la lógica para guardar el perfil
    setProfile(editedProfile)
    setIsEditing(false)
    console.log('Perfil actualizado:', editedProfile)
  }

  const handleCancelEdit = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    // Aquí iría la lógica para cambiar la contraseña
    console.log('Contraseña cambiada')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'admin':
        return 'Administrador'
      case 'medico':
        return 'Médico'
      case 'recepcionista':
        return 'Recepcionista'
      default:
        return 'Usuario'
    }
  }

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'medico':
        return 'bg-blue-100 text-blue-800'
      case 'recepcionista':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={cn('w-full max-w-4xl mx-auto space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <User className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Información Personal</TabsTrigger>
          <TabsTrigger value="professional">Información Profesional</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Actualiza tu información básica y de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar} alt={`${profile.nombre} ${profile.apellido}`} />
                    <AvatarFallback className="text-lg">
                      {profile.nombre[0]}{profile.apellido[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {profile.nombre} {profile.apellido}
                  </h3>
                  <Badge className={cn('w-fit', getRoleColor(profile.rol))}>
                    <Shield className="w-3 h-3 mr-1" />
                    {getRoleLabel(profile.rol)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Miembro desde {new Date(profile.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Personal Information Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={isEditing ? editedProfile.nombre : profile.nombre}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, nombre: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      value={isEditing ? editedProfile.apellido : profile.apellido}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, apellido: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? editedProfile.email : profile.email}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={isEditing ? editedProfile.telefono : profile.telefono}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, telefono: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                    <Input
                      id="fecha_nacimiento"
                      type="date"
                      value={isEditing ? editedProfile.fecha_nacimiento : profile.fecha_nacimiento}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Textarea
                      id="direccion"
                      value={isEditing ? editedProfile.direccion : profile.direccion}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, direccion: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="biografia">Biografía</Label>
                    <Textarea
                      id="biografia"
                      value={isEditing ? editedProfile.biografia : profile.biografia}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, biografia: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Cuéntanos un poco sobre ti..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Información Profesional
              </CardTitle>
              <CardDescription>
                Detalles de tu carrera y especialización médica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rol">Rol en el Sistema</Label>
                    <Select value={profile.rol} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="medico">Médico</SelectItem>
                        <SelectItem value="recepcionista">Recepcionista</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      El rol solo puede ser cambiado por un administrador
                    </p>
                  </div>

                  {profile.rol === 'medico' && (
                    <>
                      <div>
                        <Label htmlFor="especialidad">Especialidad</Label>
                        <Input
                          id="especialidad"
                          value={isEditing ? editedProfile.especialidad : profile.especialidad}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, especialidad: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cedula_profesional">Cédula Profesional</Label>
                        <Input
                          id="cedula_profesional"
                          value={isEditing ? editedProfile.cedula_profesional : profile.cedula_profesional}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, cedula_profesional: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Estadísticas Profesionales</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Pacientes Atendidos</p>
                        <p className="font-semibold">1,247</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Citas Realizadas</p>
                        <p className="font-semibold">892</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Años de Experiencia</p>
                        <p className="font-semibold">15+</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tasa de Satisfacción</p>
                        <p className="font-semibold">98%</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Estado de la Cuenta</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Cuenta Activa</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Última actualización: {new Date(profile.updated_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Seguridad de la Cuenta
              </CardTitle>
              <CardDescription>
                Gestiona la seguridad de tu cuenta y cambia tu contraseña
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Change Password Section */}
              <div className="space-y-4">
                <h4 className="font-medium">Cambiar Contraseña</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Label htmlFor="current-password">Contraseña Actual</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nueva contraseña"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirma la nueva contraseña"
                    />
                  </div>
                </div>

                <Button onClick={handlePasswordChange} disabled={!currentPassword || !newPassword || !confirmPassword}>
                  <Key className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </div>

              <Separator />

              {/* Security Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Configuración de Seguridad</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">Autenticación de Dos Factores</h5>
                      <p className="text-sm text-muted-foreground">
                        Añade una capa extra de seguridad a tu cuenta
                      </p>
                    </div>
                    <Badge variant="secondary">Próximamente</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">Sesiones Activas</h5>
                      <p className="text-sm text-muted-foreground">
                        Gestiona los dispositivos conectados a tu cuenta
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Sesiones
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">Historial de Actividad</h5>
                      <p className="text-sm text-muted-foreground">
                        Revisa el historial de accesos a tu cuenta
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Historial
                    </Button>
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
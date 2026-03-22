'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarDays,
  FileText,
  Settings,
  Bell,
  LogOut,
  Activity,
  Menu,
  X,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'doctors', label: 'Doctores', icon: UserCog },
  { id: 'users', label: 'Usuarios', icon: UserCheck },
  { id: 'appointments', label: 'Citas', icon: CalendarDays },
  { id: 'medical-history', label: 'Historial Médico', icon: FileText },
]

const bottomNavItems = [
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'settings', label: 'Configuración', icon: Settings },
]

export function Sidebar({
  activeSection,
  onSectionChange,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-smooth',
        collapsed ? 'w-16' : 'w-64'
      )}
      role="navigation"
      aria-label="Navegación principal"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Activity className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">MediCare</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1" role="menubar">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition-smooth group',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-smooth',
                    isActive ? 'text-sidebar-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-accent-foreground'
                  )}
                  aria-hidden="true"
                />
                {!collapsed && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="px-2 py-4 border-t border-sidebar-border">
        <nav className="space-y-1" role="menubar" aria-label="Opciones adicionales">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                role="menuitem"
                className={cn(
                  'flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition-smooth group',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0',
                    isActive ? 'text-sidebar-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-accent-foreground'
                  )}
                  aria-hidden="true"
                />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <Separator className="my-3" />

        {/* User / Logout */}
        <button
          className={cn(
            'flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition-smooth',
            'text-destructive hover:bg-destructive/10'
          )}
          role="menuitem"
        >
          <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span className="font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  )
}

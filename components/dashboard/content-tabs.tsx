'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarDays,
  FileText,
  Bell,
  Settings,
} from 'lucide-react'

interface ContentTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

const tabItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'doctors', label: 'Doctores', icon: UserCog },
  { id: 'appointments', label: 'Citas', icon: CalendarDays },
  { id: 'medical-history', label: 'Historial', icon: FileText },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'settings', label: 'Configuración', icon: Settings },
]

export function ContentTabs({ activeTab, onTabChange, children }: ContentTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <TabsList
          className="w-full h-auto justify-start gap-1 bg-transparent p-2 rounded-none overflow-x-auto"
          aria-label="Secciones del dashboard"
        >
          {tabItems.map((item) => {
            const Icon = item.icon
            return (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className={cn(
                  'gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                  'data-[state=active]:shadow-sm transition-smooth',
                  'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>
      {children}
    </Tabs>
  )
}

export function ContentTabPanel({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) {
  return (
    <TabsContent value={value} className="mt-0 p-6 outline-none">
      {children}
    </TabsContent>
  )
}

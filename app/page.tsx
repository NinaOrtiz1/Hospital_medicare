'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { ContentTabs, ContentTabPanel } from '@/components/dashboard/content-tabs'
import { DashboardOverview } from '@/components/dashboard/overview'
import { PatientsSection } from '@/components/dashboard/patients-section'
import { DoctorsSection } from '@/components/dashboard/doctors-section'
import { AppointmentsSection } from '@/components/dashboard/appointments-section'
import { MedicalHistorySection } from '@/components/dashboard/medical-history-section'

const AccessibilityPanel = dynamic(
  () => import('@/components/dashboard/accessibility-panel').then(mod => mod.AccessibilityPanel),
  { ssr: false }
)

export default function HospitalDashboard() {
  const [activeSection, setActiveSection] = React.useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Saltar al contenido principal
      </a>

      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main id="main-content" className="flex-1" role="main" aria-label="Contenido principal">
          <ContentTabs activeTab={activeSection} onTabChange={setActiveSection}>
            <ContentTabPanel value="dashboard">
              <DashboardOverview userName="Dr. Carlos Mendoza" />
            </ContentTabPanel>

            <ContentTabPanel value="patients">
              <PatientsSection />
            </ContentTabPanel>

            <ContentTabPanel value="doctors">
              <DoctorsSection />
            </ContentTabPanel>

            <ContentTabPanel value="appointments">
              <AppointmentsSection />
            </ContentTabPanel>

            <ContentTabPanel value="medical-history">
              <MedicalHistorySection />
            </ContentTabPanel>
          </ContentTabs>
        </main>
      </div>

      <AccessibilityPanel />
    </div>
  )
}

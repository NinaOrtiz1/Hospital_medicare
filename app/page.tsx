'use client'

import * as React from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { ContentTabs, ContentTabPanel } from '@/components/dashboard/content-tabs'
import { DashboardOverview } from '@/components/dashboard/overview'
import { PatientsSection } from '@/components/dashboard/patients-section'
import { DoctorsSection } from '@/components/dashboard/doctors-section'
import { AppointmentsSection } from '@/components/dashboard/appointments-section'
import { MedicalHistorySection } from '@/components/dashboard/medical-history-section'
import { AccessibilityPanel } from '@/components/dashboard/accessibility-panel'

export default function HospitalDashboard() {
  const [activeSection, setActiveSection] = React.useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  // Sync sidebar and tabs navigation
  const handleSectionChange = (section: string) => {
    setActiveSection(section)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />

        {/* Content Area with Tabs */}
        <main className="flex-1" role="main" aria-label="Contenido principal">
          <ContentTabs
            activeTab={activeSection}
            onTabChange={handleSectionChange}
          >
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

      {/* Accessibility Floating Button */}
      <AccessibilityPanel />

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Saltar al contenido principal
      </a>
    </div>
  )
}

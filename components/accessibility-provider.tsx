'use client'

import * as React from 'react'

type TextSize = 'small' | 'normal' | 'large' | 'xlarge'

interface AccessibilityContextType {
  textSize: TextSize
  setTextSize: (size: TextSize) => void
  highContrast: boolean
  setHighContrast: (enabled: boolean) => void
  resetSettings: () => void
}

const AccessibilityContext = React.createContext<AccessibilityContextType | null>(null)

export function useAccessibility() {
  const context = React.useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSize] = React.useState<TextSize>('normal')
  const [highContrast, setHighContrast] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Load saved settings from localStorage only on client
    try {
      const savedTextSize = localStorage.getItem('accessibility-text-size') as TextSize
      const savedHighContrast = localStorage.getItem('accessibility-high-contrast')
      
      if (savedTextSize && ['small', 'normal', 'large', 'xlarge'].includes(savedTextSize)) {
        setTextSize(savedTextSize)
      }
      if (savedHighContrast === 'true') {
        setHighContrast(true)
      }
    } catch {
      // localStorage not available
    }
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    
    // Apply text size class to body
    document.body.classList.remove('text-size-small', 'text-size-normal', 'text-size-large', 'text-size-xlarge')
    document.body.classList.add(`text-size-${textSize}`)
    try {
      localStorage.setItem('accessibility-text-size', textSize)
    } catch {
      // localStorage not available
    }
  }, [textSize, mounted])

  React.useEffect(() => {
    if (!mounted) return
    
    // Apply high contrast class to html
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
    try {
      localStorage.setItem('accessibility-high-contrast', String(highContrast))
    } catch {
      // localStorage not available
    }
  }, [highContrast, mounted])

  const resetSettings = () => {
    setTextSize('normal')
    setHighContrast(false)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

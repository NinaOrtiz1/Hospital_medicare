'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useAccessibility } from '@/components/accessibility-provider'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Accessibility,
  ZoomIn,
  ZoomOut,
  Contrast,
  RotateCcw,
  Type,
} from 'lucide-react'

const textSizeLabels = {
  small: 'Pequeno',
  normal: 'Normal',
  large: 'Grande',
  xlarge: 'Extra Grande',
}

const textSizeOrder: Array<'small' | 'normal' | 'large' | 'xlarge'> = [
  'small',
  'normal',
  'large',
  'xlarge',
]

export function AccessibilityPanel() {
  const [mounted, setMounted] = React.useState(false)
  const accessibility = useAccessibility()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const { textSize, setTextSize, highContrast, setHighContrast, resetSettings } = accessibility

  const increaseTextSize = () => {
    const currentIndex = textSizeOrder.indexOf(textSize)
    if (currentIndex < textSizeOrder.length - 1) {
      setTextSize(textSizeOrder[currentIndex + 1])
    }
  }

  const decreaseTextSize = () => {
    const currentIndex = textSizeOrder.indexOf(textSize)
    if (currentIndex > 0) {
      setTextSize(textSizeOrder[currentIndex - 1])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'transition-all duration-200 hover:scale-110',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
          )}
          aria-label="Abrir panel de accesibilidad"
        >
          <Accessibility className="h-6 w-6" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-80 p-0"
        sideOffset={16}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Accessibility className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold text-lg">Accesibilidad</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                <Type className="h-4 w-4" aria-hidden="true" />
                Tamano de Texto
              </Label>
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseTextSize}
                  disabled={textSize === 'small'}
                  className="gap-1"
                  aria-label="Reducir tamano de texto"
                >
                  <ZoomOut className="h-4 w-4" aria-hidden="true" />
                  A-
                </Button>
                <span
                  className="text-sm font-medium text-center flex-1"
                  aria-live="polite"
                >
                  {textSizeLabels[textSize]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseTextSize}
                  disabled={textSize === 'xlarge'}
                  className="gap-1"
                  aria-label="Aumentar tamano de texto"
                >
                  <ZoomIn className="h-4 w-4" aria-hidden="true" />
                  A+
                </Button>
              </div>
              <div className="mt-2 flex gap-1">
                {textSizeOrder.map((size) => (
                  <div
                    key={size}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors',
                      textSizeOrder.indexOf(size) <= textSizeOrder.indexOf(textSize)
                        ? 'bg-primary'
                        : 'bg-muted'
                    )}
                  />
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label
                htmlFor="high-contrast"
                className="text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                <Contrast className="h-4 w-4" aria-hidden="true" />
                Alto Contraste
              </Label>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-describedby="high-contrast-description"
              />
            </div>
            <p
              id="high-contrast-description"
              className="text-xs text-muted-foreground -mt-2"
            >
              Mejora la visibilidad con colores de alto contraste
            </p>

            <Separator />

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={resetSettings}
              aria-label="Restablecer configuracion de accesibilidad"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Restablecer Configuracion
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 px-4 py-3 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Atajos de teclado:</strong> Use Tab para navegar, Enter para
            seleccionar, y Escape para cerrar menus.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

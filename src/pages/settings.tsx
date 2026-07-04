import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/features/theme'
import { PreferencesSection } from '@/features/settings/components/preferences-section'
import { DataSection } from '@/features/settings/components/data-section'
import { AboutSection } from '@/features/settings/components/about-section'
import { Palette } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Personalizá tu experiencia
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Apariencia</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Personalizá el tema de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Tema</Label>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <PreferencesSection />
        <DataSection />
        <AboutSection />
      </div>
    </div>
  )
}

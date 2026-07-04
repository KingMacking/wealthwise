import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe } from 'lucide-react'
import { useSettingsStore, CURRENCIES, type Locale } from '@/store/settings.store'

const LOCALES: { code: Locale; name: string }[] = [
  { code: 'es-AR', name: 'Español (Argentina)' },
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
]

export function PreferencesSection() {
  const { currency, locale, setCurrency, setLocale } = useSettingsStore()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Preferencias regionales</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Configurá moneda e idioma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Moneda</Label>
          <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">{c.symbol}</span>
                    <span>{c.name}</span>
                    <span className="text-muted-foreground">({c.code})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Idioma</Label>
          <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCALES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

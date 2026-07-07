import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import type { DashboardPreferences, DashboardSection } from '@/hooks/useDashboardPreferences'

export const DASHBOARD_SECTIONS: { key: DashboardSection; label: string }[] = [
  { key: 'statsCards', label: 'Tarjetas de resumen' },
  { key: 'indicators', label: 'Indicadores' },
  { key: 'charts', label: 'Gráficos' },
  { key: 'recentMovements', label: 'Movimientos recientes' },
]

interface DashboardCustomizeProps {
  prefs: DashboardPreferences
  toggle: (section: DashboardSection) => void
}

export function DashboardCustomize({ prefs, toggle }: DashboardCustomizeProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Personalizar dashboard</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1 space-y-1">
          {DASHBOARD_SECTIONS.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent transition-colors"
            >
              {label}
              <Switch
                checked={prefs[key]}
                onCheckedChange={() => toggle(key)}
              />
            </label>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

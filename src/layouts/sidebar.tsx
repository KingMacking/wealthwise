import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Wallet,
  Landmark,
  Banknote,
  CreditCard,
  Target,
  BarChart3,
  Calendar,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { APP_NAME } from '@/lib/constants'

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Movimientos', href: '/movements', icon: ArrowLeftRight },
  { label: 'Categorías', href: '/categories', icon: Tags },
  { label: 'Presupuestos', href: '/budgets', icon: Wallet },
  { label: 'Cuentas', href: '/accounts', icon: Landmark },
  { label: 'Métodos de Pago', href: '/payment-methods', icon: Banknote },
  { label: 'Tarjetas', href: '/credit-cards', icon: CreditCard },
  { label: 'Objetivos', href: '/goals', icon: Target },
  { label: 'Reportes', href: '/reports', icon: BarChart3 },
  { label: 'Calendario', href: '/calendar', icon: Calendar },
  { label: 'Configuración', href: '/settings', icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 md:relative md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b px-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            W
          </div>
          <span className="text-sm font-semibold">{APP_NAME}</span>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-1 px-3" aria-label="Navegación principal">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            WealthWise v1.0.0
          </p>
        </div>
      </aside>
    </>
  )
}

import { useNavigate } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '@convex/api'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
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
  Plus,
  Search,
  type LucideIcon,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { formatCurrency } from '@/utils/format'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

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

const quickActions: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Nuevo movimiento', href: '/movements?new=true', icon: Plus },
  { label: 'Nueva categoría', href: '/categories?new=true', icon: Plus },
  { label: 'Nuevo presupuesto', href: '/budgets?new=true', icon: Plus },
  { label: 'Nueva cuenta', href: '/accounts?new=true', icon: Plus },
  { label: 'Nuevo objetivo', href: '/goals?new=true', icon: Plus },
]

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()

  const allMovements = useQuery(api.movements.getAll) ?? []
  const allCategories = useQuery(api.categories.getAll) ?? []
  const allAccounts = useQuery(api.accounts.getAll) ?? []
  const allPaymentMethods = useQuery(api.paymentMethods.getAll) ?? []

  function handleSelect(href: string) {
    navigate(href)
    onClose()
  }

  return (
    <CommandDialog open={open} onOpenChange={onClose}>
      <CommandInput placeholder="Buscá páginas, movimientos, categorías..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center py-6 text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Sin resultados</p>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Navegación">
          {navItems.map((item) => (
            <CommandItem key={item.href} onSelect={() => handleSelect(item.href)}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Acciones rápidas">
          {quickActions.map((item) => (
            <CommandItem key={item.href} onSelect={() => handleSelect(item.href)}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {allMovements.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Movimientos">
              {allMovements.slice(0, 10).map((m) => {
                const cat = allCategories.find((c) => c.id === m.categoryId)
                return (
                  <CommandItem key={m.id} onSelect={() => handleSelect(`/movements`)}>
                    <div
                      className="mr-2 h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: cat?.color ?? '#3b82f6' }}
                    />
                    <span className="flex-1 truncate">{m.description}</span>
                    <span className={`text-xs font-medium ml-2 ${m.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {m.type === 'income' ? '+' : '-'}{formatCurrency(m.amount)}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </>
        )}

        {allCategories.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Categorías">
              {allCategories.slice(0, 8).map((cat) => {
                const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[cat.icon] ?? LucideIcons.Folder
                return (
                  <CommandItem key={cat.id} onSelect={() => handleSelect('/categories')}>
                    <Icon className="mr-2 h-4 w-4" style={{ color: cat.color }} />
                    <span className="flex-1">{cat.name}</span>
                    {cat.subcategories.length > 0 && (
                      <span className="text-xs text-muted-foreground">{cat.subcategories.length} sub</span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </>
        )}

        {allAccounts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Cuentas">
              {allAccounts.slice(0, 5).map((acc) => (
                <CommandItem key={acc.id} onSelect={() => handleSelect('/accounts')}>
                  <div className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: acc.color }} />
                  <span className="flex-1">{acc.name}</span>
                  <span className="text-xs text-muted-foreground">{formatCurrency(acc.balance)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {allPaymentMethods.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Métodos de pago">
              {allPaymentMethods.slice(0, 5).map((pm) => {
                const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[pm.icon] ?? LucideIcons.CreditCard
                return (
                  <CommandItem key={pm.id} onSelect={() => handleSelect('/payment-methods')}>
                    <Icon className="mr-2 h-4 w-4 text-primary" />
                    <span>{pm.name}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

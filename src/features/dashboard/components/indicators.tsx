import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { Calendar, ArrowUp, ArrowDown, Receipt, ShoppingCart, TrendingUp } from 'lucide-react'

interface IndicatorsProps {
  avgDailyExpense: number
  highestExpense: { amount: number; description: string }
  lowestExpense: { amount: number; description: string }
  movementCount: number
  expenseCount: number
  avgTicket: number
  topCategory: { name: string; total: number } | null
}

export function Indicators({
  avgDailyExpense,
  highestExpense,
  lowestExpense,
  movementCount,
  expenseCount,
  avgTicket,
  topCategory,
}: IndicatorsProps) {
  const items = [
    {
      label: 'Gasto promedio diario',
      value: formatCurrency(avgDailyExpense),
      icon: Calendar,
      color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      label: 'Mayor gasto',
      value: formatCurrency(highestExpense.amount),
      sub: highestExpense.description,
      icon: ArrowUp,
      color: 'text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
    },
    {
      label: 'Menor gasto',
      value: formatCurrency(lowestExpense.amount),
      sub: lowestExpense.description,
      icon: ArrowDown,
      color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      label: 'Total movimientos',
      value: movementCount.toString(),
      sub: `${expenseCount} gastos · ${movementCount - expenseCount} ingresos`,
      icon: Receipt,
      color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      label: 'Ticket promedio',
      value: formatCurrency(avgTicket),
      icon: ShoppingCart,
      color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      label: 'Categoría más usada',
      value: topCategory?.name ?? '-',
      sub: topCategory ? formatCurrency(topCategory.total) : undefined,
      icon: TrendingUp,
      color: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <Card key={item.label} className="transition-all duration-200 hover:shadow-md">
          <CardContent className="flex items-start gap-3 p-4">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider truncate">
                {item.label}
              </p>
              <p className="text-base font-semibold mt-0.5">{item.value}</p>
              {item.sub && (
                <p className="text-[11px] text-muted-foreground truncate">{item.sub}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

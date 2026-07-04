import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate } from '@/utils/format'
import type { Movement, Category } from '@/types'

interface RecentMovementsProps {
  movements: Movement[]
  categories: Category[]
  isLoading: boolean
}

export function RecentMovements({ movements, categories, isLoading }: RecentMovementsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (movements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Últimos movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No hay movimientos este mes</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Últimos movimientos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {movements.slice(0, 10).map((m) => {
            const cat = categories.find((c) => c.id === m.categoryId)
            return (
              <div
                key={m.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${cat?.color ?? '#3b82f6'}15` }}
                  >
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat?.color ?? '#3b82f6' }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{m.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(m.date)} · {cat?.name ?? 'Sin categoría'}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p
                    className={`text-sm font-semibold ${
                      m.type === 'income'
                        ? 'text-emerald-500'
                        : m.type === 'expense'
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {m.type === 'expense' ? '-' : '+'}
                    {formatCurrency(m.amount)}
                  </p>
                  <Badge
                    variant={m.status === 'confirmed' ? 'success' : 'warning'}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {m.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/format'
import type { CalendarDay } from '../hooks/use-calendar'
import type { Category } from '@/types'

interface DayDetailProps {
  day: CalendarDay
  categories: Category[]
}

export function DayDetail({ day, categories }: DayDetailProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">
          {format(day.date, "EEEE d 'de' MMMM", { locale: es })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {day.movements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Sin movimientos este día
          </p>
        ) : (
          <>
            <div className="flex justify-between text-sm py-2 border-b">
              <span className="text-emerald-500 font-medium">
                Ingresos: {formatCurrency(day.totalIncomes)}
              </span>
              <span className="text-red-500 font-medium">
                Gastos: {formatCurrency(day.totalExpenses)}
              </span>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {day.movements.map((m) => {
                const cat = categories.find((c) => c.id === m.categoryId)
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat?.color ?? '#3b82f6' }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm truncate max-w-[180px]">{m.description}</p>
                        <p className="text-[11px] text-muted-foreground">{cat?.name ?? '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-sm font-medium ${
                          m.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                        }`}
                      >
                        {m.type === 'income' ? '+' : '-'}{formatCurrency(m.amount)}
                      </span>
                      <Badge
                        variant={m.status === 'confirmed' ? 'default' : 'secondary'}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {m.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

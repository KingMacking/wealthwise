import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatCurrency } from '@/utils/format'
import type { DailyTotal } from '../hooks/use-dashboard'
import { startOfMonth, endOfMonth, getDay } from 'date-fns'

interface Props {
  data: DailyTotal[]
  year?: number
  month?: number
}

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export function SpendingHeatmap({ data, year = 2026, month = 7 }: Props) {
  const maxExpense = Math.max(...data.map((d) => d.expenses), 1)
  const firstDay = getDay(startOfMonth(new Date(year, month - 1)))

  const totalDays = endOfMonth(new Date(year, month - 1)).getDate()
  const days = Array.from({ length: totalDays }, (_, i) => {
    const found = data.find((d) => d.day === i + 1)
    return {
      day: i + 1,
      expenses: found?.expenses ?? 0,
      count: found?.count ?? 0,
    }
  })

  function getIntensity(expenses: number): string {
    if (expenses === 0) return 'bg-muted'
    const ratio = expenses / maxExpense
    if (ratio > 0.75) return 'bg-red-500 dark:bg-red-400'
    if (ratio > 0.5) return 'bg-red-400 dark:bg-red-300'
    if (ratio > 0.25) return 'bg-red-300 dark:bg-red-200'
    return 'bg-red-200 dark:bg-red-100'
  }

  const today = new Date().getDate()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Heatmap de gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-1">
            <div className="grid grid-cols-7 gap-1">
              {DAY_LABELS.map((label) => (
                <div key={label} className="text-center text-[10px] text-muted-foreground font-medium py-1">
                  {label}
                </div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((d) => (
                <Tooltip key={d.day}>
                  <TooltipTrigger asChild>
                    <div
                      className={`aspect-square rounded-md ${getIntensity(d.expenses)} flex items-center justify-center text-[10px] font-medium transition-colors cursor-default ${
                        d.expenses > 0 ? 'text-white dark:text-black' : 'text-muted-foreground'
                      } ${d.day === today ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}`}
                    >
                      {d.day}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p>Día {d.day}</p>
                    <p className="font-medium">Gastos: {formatCurrency(d.expenses)}</p>
                    <p className="text-muted-foreground">{d.count} movimientos</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </TooltipProvider>
        <div className="flex items-center justify-end gap-1 mt-3">
          <span className="text-[10px] text-muted-foreground">Menos</span>
          <div className="h-3 w-3 rounded bg-muted" />
          <div className="h-3 w-3 rounded bg-red-200 dark:bg-red-100" />
          <div className="h-3 w-3 rounded bg-red-300 dark:bg-red-200" />
          <div className="h-3 w-3 rounded bg-red-400 dark:bg-red-300" />
          <div className="h-3 w-3 rounded bg-red-500 dark:bg-red-400" />
          <span className="text-[10px] text-muted-foreground">Más</span>
        </div>
      </CardContent>
    </Card>
  )
}

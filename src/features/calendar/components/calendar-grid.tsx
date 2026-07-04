import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'
import type { CalendarDay } from '../hooks/use-calendar'

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

interface CalendarGridProps {
  days: CalendarDay[]
  selectedDate: Date | null
  onSelectDay: (date: Date) => void
}

export function CalendarGrid({ days, selectedDate, onSelectDay }: CalendarGridProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="grid grid-cols-7">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-2.5 text-center text-xs font-medium text-muted-foreground border-b"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const isSelected = selectedDate && day.date.getTime() === selectedDate.getTime()
          const hasMovements = day.movements.length > 0

          return (
            <button
              key={day.date.toISOString()}
              onClick={() => onSelectDay(day.date)}
              disabled={!day.isCurrentMonth}
              className={cn(
                'relative flex flex-col items-center justify-start p-1.5 min-h-[80px] border-b border-r transition-colors last:border-r-0',
                day.isCurrentMonth
                  ? 'hover:bg-accent/50 cursor-pointer'
                  : 'opacity-30 cursor-default',
                isSelected && 'bg-accent/80 ring-1 ring-primary'
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs',
                  day.isToday && 'bg-primary text-primary-foreground font-bold',
                  isSelected && !day.isToday && 'bg-primary/20 font-semibold'
                )}
              >
                {day.day}
              </span>

              {hasMovements && (
                <div className="flex flex-col items-center gap-0.5 mt-0.5 w-full">
                  {day.totalExpenses > 0 && (
                    <span className="text-[10px] font-medium text-red-500 leading-tight truncate w-full text-center">
                      -{formatCurrency(day.totalExpenses).replace(/[$,]/g, '').slice(0, 6)}
                    </span>
                  )}
                  {day.totalIncomes > 0 && (
                    <span className="text-[10px] font-medium text-emerald-500 leading-tight truncate w-full text-center">
                      +{formatCurrency(day.totalIncomes).replace(/[$,]/g, '').slice(0, 6)}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

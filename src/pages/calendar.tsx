import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCalendar, CalendarGrid, DayDetail } from '@/features/calendar'

export default function CalendarPage() {
  const {
    isLoading,
    days,
    selectedDay,
    selectedDate,
    setSelectedDate,
    monthLabel,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    categories,
  } = useCalendar()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-60 mt-1" />
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendario</h1>
          <p className="text-sm text-muted-foreground">
            Visualiza tus movimientos en el calendario
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={goToToday}>
          <CalendarDays className="mr-2 h-4 w-4" />
          Hoy
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium capitalize min-w-[160px] text-center">
            {monthLabel}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarGrid
            days={days}
            selectedDate={selectedDate}
            onSelectDay={setSelectedDate}
          />
        </div>

        <div className="lg:col-span-1">
          {selectedDay ? (
            <DayDetail day={selectedDay} categories={categories} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] rounded-xl border bg-card text-muted-foreground">
              <CalendarDays className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Seleccioná un día para ver los movimientos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

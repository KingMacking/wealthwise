import { useState, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@convex/api'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, getDate, isSameDay, format, parseISO,
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { Movement } from '@/types'

export interface CalendarDay {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  movements: Movement[]
  totalExpenses: number
  totalIncomes: number
}

export function useCalendar() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(new Date(currentYear, currentMonth))
  const monthEnd = endOfMonth(monthStart)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const dateRangeStart = format(calStart, 'yyyy-MM-dd')
  const dateRangeEnd = format(calEnd, 'yyyy-MM-dd')

  const movements = useQuery(api.movements.getByDateRange, { startDate: dateRangeStart, endDate: dateRangeEnd }) ?? []
  const categories = useQuery(api.categories.getAll) ?? []

  const isLoading = movements === undefined || categories === undefined

  const days = useMemo(() => {
    const allDays = eachDayOfInterval({ start: calStart, end: calEnd })

    return allDays.map((date) => {
      const dayMovements = movements.filter((m) => isSameDay(parseISO(m.date), date))
      return {
        date,
        day: getDate(date),
        isCurrentMonth: date >= monthStart && date <= monthEnd,
        isToday: isSameDay(date, today),
        movements: dayMovements,
        totalExpenses: dayMovements.filter((m) => m.type === 'expense').reduce((s, m) => s + m.amount, 0),
        totalIncomes: dayMovements.filter((m) => m.type === 'income').reduce((s, m) => s + m.amount, 0),
      }
    })
  }, [movements, calStart, calEnd, monthStart, monthEnd, today])

  const selectedDay = selectedDate
    ? days.find((d) => isSameDay(d.date, selectedDate)) ?? null
    : null

  const monthLabel = format(monthStart, 'MMMM yyyy', { locale: es })

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedDate(null)
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setSelectedDate(null)
  }

  const goToToday = () => {
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDate(today)
  }

  return {
    isLoading,
    days,
    selectedDay,
    selectedDate,
    setSelectedDate,
    monthLabel,
    currentMonth,
    currentYear,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    categories,
  }
}

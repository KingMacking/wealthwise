import { useQuery } from 'convex/react'
import { api } from '@convex/api'
import { startOfMonth, endOfMonth, subMonths, eachDayOfInterval, isSameDay, format, parseISO } from 'date-fns'
import type { Movement, Category } from '@/types'

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export interface DailyTotal {
  day: number
  date: string
  expenses: number
  incomes: number
  count: number
}

export interface CategoryTotal {
  categoryId: string
  categoryName: string
  color: string
  total: number
  percentage: number
  count: number
}

export interface PaymentMethodTotal {
  paymentMethodId: string
  paymentMethodName: string
  total: number
  percentage: number
}

export interface MonthlyComparison {
  month: string
  year: number
  monthLabel: string
  expenses: number
  incomes: number
}

export interface DashboardData {
  isLoading: boolean
  currentMonthExpenses: number
  currentMonthIncomes: number
  netBalance: number
  savingsRate: number
  totalBalance: number
  dailyTotals: DailyTotal[]
  categoryTotals: CategoryTotal[]
  paymentMethodTotals: PaymentMethodTotal[]
  monthlyComparison: MonthlyComparison[]
  avgDailyExpense: number
  highestExpense: { amount: number; description: string }
  lowestExpense: { amount: number; description: string }
  movementCount: number
  avgTicket: number
  topCategory: { name: string; total: number } | null
  expenseCount: number
  movements: Movement[]
  categories: Category[]
}

export function useDashboard(): DashboardData {
  const now = new Date()
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd')
  const prevMonthStart = format(startOfMonth(subMonths(now, 1)), 'yyyy-MM-dd')
  const prevMonthEnd = format(endOfMonth(subMonths(now, 1)), 'yyyy-MM-dd')
  const prev2MonthStart = format(startOfMonth(subMonths(now, 2)), 'yyyy-MM-dd')
  const prev2MonthEnd = format(endOfMonth(subMonths(now, 2)), 'yyyy-MM-dd')

  const currentMovements = useQuery(api.movements.getByDateRange, { startDate: monthStart, endDate: monthEnd }) ?? []
  const prevMovements = useQuery(api.movements.getByDateRange, { startDate: prevMonthStart, endDate: prevMonthEnd }) ?? []
  const prev2Movements = useQuery(api.movements.getByDateRange, { startDate: prev2MonthStart, endDate: prev2MonthEnd }) ?? []
  const categories = useQuery(api.categories.getAll) ?? []
  const accounts = useQuery(api.accounts.getAll) ?? []
  const paymentMethods = useQuery(api.paymentMethods.getAll) ?? []

  const isLoading = currentMovements === undefined || categories === undefined || accounts === undefined

  const movements = currentMovements
  const expenses = movements.filter((m) => m.type === 'expense')
  const incomes = movements.filter((m) => m.type === 'income')
  const totalExpenses = expenses.reduce((s, m) => s + m.amount, 0)
  const totalIncomes = incomes.reduce((s, m) => s + m.amount, 0)
  const net = totalIncomes - totalExpenses
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0)
  const rate = totalIncomes > 0 ? (net / totalIncomes) * 100 : 0

  const daysInMonth = eachDayOfInterval({ start: startOfMonth(now), end: now < endOfMonth(now) ? now : endOfMonth(now) })
  const dailyTotals: DailyTotal[] = daysInMonth.map((day) => {
    const dayMovements = movements.filter((m) => isSameDay(parseISO(m.date), day))
    return {
      day: day.getDate(),
      date: format(day, 'yyyy-MM-dd'),
      expenses: dayMovements.filter((m) => m.type === 'expense').reduce((s, m) => s + m.amount, 0),
      incomes: dayMovements.filter((m) => m.type === 'income').reduce((s, m) => s + m.amount, 0),
      count: dayMovements.length,
    }
  })

  const categoryTotals: CategoryTotal[] = categories
    .map((cat) => {
      const catExpenses = expenses.filter((m) => m.categoryId === cat.id)
      const total = catExpenses.reduce((s, m) => s + m.amount, 0)
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        color: cat.color,
        total,
        percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
        count: catExpenses.length,
      }
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)

  const paymentMethodTotals: PaymentMethodTotal[] = paymentMethods
    .map((pm) => {
      const pmExpenses = expenses.filter((m) => m.paymentMethodId === pm.id)
      const total = pmExpenses.reduce((s, m) => s + m.amount, 0)
      return {
        paymentMethodId: pm.id,
        paymentMethodName: pm.name,
        total,
        percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
      }
    })
    .filter((p) => p.total > 0)
    .sort((a, b) => b.total - a.total)

  function getMonthData(movs: typeof movements, offset: number): MonthlyComparison {
    const date = subMonths(now, offset)
    return {
      month: format(date, 'MMM'),
      year: date.getFullYear(),
      monthLabel: MONTH_LABELS[date.getMonth()],
      expenses: movs.filter((m) => m.type === 'expense').reduce((s, m) => s + m.amount, 0),
      incomes: movs.filter((m) => m.type === 'income').reduce((s, m) => s + m.amount, 0),
    }
  }

  const monthlyComparison = [
    getMonthData(prev2Movements, 2),
    getMonthData(prevMovements, 1),
    getMonthData(movements, 0),
  ]

  const avgDaily = dailyTotals.length > 0 ? totalExpenses / dailyTotals.length : 0
  const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount)
  const highExp = sortedExpenses[0] ?? { amount: 0, description: '-' }
  const lowExp = sortedExpenses[sortedExpenses.length - 1] ?? { amount: 0, description: '-' }
  const avgTicket = expenses.length > 0 ? totalExpenses / expenses.length : 0
  const topCat = categoryTotals[0] ?? null

  return {
    isLoading,
    currentMonthExpenses: totalExpenses,
    currentMonthIncomes: totalIncomes,
    netBalance: net,
    savingsRate: rate,
    totalBalance,
    dailyTotals,
    categoryTotals,
    paymentMethodTotals,
    monthlyComparison,
    avgDailyExpense: avgDaily,
    highestExpense: highExp,
    lowestExpense: lowExp,
    movementCount: movements.length,
    avgTicket,
    topCategory: topCat ? { name: topCat.categoryName, total: topCat.total } : null,
    expenseCount: expenses.length,
    movements,
    categories,
  }
}

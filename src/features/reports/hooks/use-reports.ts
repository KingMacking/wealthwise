import { useState, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@convex/api'
import type { Movement, Category } from '@/types'

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export interface MonthlyData {
  month: number
  label: string
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
  name: string
  total: number
  percentage: number
}

export interface ReportsData {
  isLoading: boolean
  year: number
  setYear: (y: number) => void
  totalExpenses: number
  totalIncomes: number
  netBalance: number
  savingsRate: number
  monthlyData: MonthlyData[]
  categoryTotals: CategoryTotal[]
  paymentMethodTotals: PaymentMethodTotal[]
  topExpenses: Movement[]
  categories: Category[]
  movementCount: number
}

export function useReports(): ReportsData {
  const [year, setYear] = useState(new Date().getFullYear())

  const movements = useQuery(api.movements.getByYear, { year }) ?? []
  const categories = useQuery(api.categories.getAll) ?? []
  const paymentMethods = useQuery(api.paymentMethods.getAll) ?? []

  const isLoading = movements === undefined || categories === undefined

  return useMemo(() => {
    const expenses = movements.filter((m) => m.type === 'expense')
    const incomes = movements.filter((m) => m.type === 'income')
    const totalExpenses = expenses.reduce((s, m) => s + m.amount, 0)
    const totalIncomes = incomes.reduce((s, m) => s + m.amount, 0)
    const netBalance = totalIncomes - totalExpenses
    const savingsRate = totalIncomes > 0 ? (netBalance / totalIncomes) * 100 : 0

    const monthlyData: MonthlyData[] = Array.from({ length: 12 }, (_, i) => {
      const monthMovements = movements.filter((m) => new Date(m.date).getMonth() === i)
      return {
        month: i + 1,
        label: MONTH_LABELS[i],
        expenses: monthMovements.filter((m) => m.type === 'expense').reduce((s, m) => s + m.amount, 0),
        incomes: monthMovements.filter((m) => m.type === 'income').reduce((s, m) => s + m.amount, 0),
        count: monthMovements.length,
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
          name: pm.name,
          total,
          percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
        }
      })
      .filter((p) => p.total > 0)
      .sort((a, b) => b.total - a.total)

    const topExpenses = [...expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 20)

    return {
      isLoading,
      year,
      setYear,
      totalExpenses,
      totalIncomes,
      netBalance,
      savingsRate,
      monthlyData,
      categoryTotals,
      paymentMethodTotals,
      topExpenses,
      categories,
      movementCount: movements.length,
    }
  }, [movements, categories, paymentMethods, isLoading, year])
}

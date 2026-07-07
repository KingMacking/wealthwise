import {
  Calendar, TrendingUp, TrendingDown, Wallet, DollarSign, Target,
  Building2, Clock, ArrowUp, ArrowDown, Receipt, ShoppingCart,
  CreditCard, PiggyBank,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { DashboardData } from './hooks/use-dashboard'
import { formatCurrency } from '@/utils/format'

export interface StatCardDef {
  id: string
  label: string
  icon: LucideIcon
  getValue: (data: DashboardData) => string
  getTrend: (data: DashboardData) => 'up' | 'down' | 'neutral'
}

export const STAT_CARD_DEFS: StatCardDef[] = [
  {
    id: 'initialMoney',
    label: 'Dinero Inicial',
    icon: Calendar,
    getValue: (d) => formatCurrency(d.totalBalance - d.netBalance),
    getTrend: () => 'neutral',
  },
  {
    id: 'incomes',
    label: 'Ingresos',
    icon: TrendingUp,
    getValue: (d) => formatCurrency(d.currentMonthIncomes),
    getTrend: () => 'up',
  },
  {
    id: 'expenses',
    label: 'Gastos',
    icon: TrendingDown,
    getValue: (d) => formatCurrency(d.currentMonthExpenses),
    getTrend: () => 'down',
  },
  {
    id: 'balance',
    label: 'Balance Actual',
    icon: Wallet,
    getValue: (d) => formatCurrency(d.totalBalance),
    getTrend: () => 'neutral',
  },
  {
    id: 'netResult',
    label: 'Resultado del Mes',
    icon: DollarSign,
    getValue: (d) => formatCurrency(d.netBalance),
    getTrend: (d) => (d.netBalance >= 0 ? 'up' : 'down'),
  },
  {
    id: 'savingsRate',
    label: 'Ahorro Generado',
    icon: Target,
    getValue: (d) => `${d.savingsRate.toFixed(0)}%`,
    getTrend: (d) => (d.savingsRate >= 10 ? 'up' : 'down'),
  },
  {
    id: 'accounts',
    label: 'Cuentas activas',
    icon: Building2,
    getValue: (d) => String(d.accountCount),
    getTrend: () => 'neutral',
  },
  {
    id: 'pending',
    label: 'Gastos pendientes',
    icon: Clock,
    getValue: (d) => formatCurrency(d.pendingExpenses),
    getTrend: () => 'neutral',
  },
]

export const STAT_CARD_IDS = STAT_CARD_DEFS.map((w) => w.id)

export function getStatCardDef(id: string): StatCardDef | undefined {
  return STAT_CARD_DEFS.find((w) => w.id === id)
}

export interface IndicatorDef {
  id: string
  label: string
  icon: LucideIcon
  color: string
  getValue: (data: DashboardData) => string
  getSub: (data: DashboardData) => string | undefined
}

export const INDICATOR_DEFS: IndicatorDef[] = [
  {
    id: 'avgDaily',
    label: 'Gasto promedio diario',
    icon: Calendar,
    color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
    getValue: (d) => formatCurrency(d.avgDailyExpense),
    getSub: () => undefined,
  },
  {
    id: 'highest',
    label: 'Mayor gasto',
    icon: ArrowUp,
    color: 'text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
    getValue: (d) => formatCurrency(d.highestExpense.amount),
    getSub: (d) => d.highestExpense.description,
  },
  {
    id: 'lowest',
    label: 'Menor gasto',
    icon: ArrowDown,
    color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
    getValue: (d) => formatCurrency(d.lowestExpense.amount),
    getSub: (d) => d.lowestExpense.description,
  },
  {
    id: 'movements',
    label: 'Total movimientos',
    icon: Receipt,
    color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
    getValue: (d) => d.movementCount.toString(),
    getSub: (d) => `${d.expenseCount} gastos · ${d.incomeCount} ingresos`,
  },
  {
    id: 'avgTicket',
    label: 'Ticket promedio',
    icon: ShoppingCart,
    color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
    getValue: (d) => formatCurrency(d.avgTicket),
    getSub: () => undefined,
  },
  {
    id: 'topCategory',
    label: 'Categoría más usada',
    icon: TrendingUp,
    color: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400',
    getValue: (d) => d.topCategory?.name ?? '-',
    getSub: (d) => (d.topCategory ? formatCurrency(d.topCategory.total) : undefined),
  },
  {
    id: 'incomeCount',
    label: 'Total ingresos',
    icon: PiggyBank,
    color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
    getValue: (d) => d.incomeCount.toString(),
    getSub: () => undefined,
  },
  {
    id: 'topPaymentMethod',
    label: 'Método más usado',
    icon: CreditCard,
    color: 'text-violet-500 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400',
    getValue: (d) => d.topPaymentMethod?.name ?? '-',
    getSub: (d) => (d.topPaymentMethod ? formatCurrency(d.topPaymentMethod.total) : undefined),
  },
  {
    id: 'savingsProgress',
    label: 'Avance de metas',
    icon: Target,
    color: 'text-rose-500 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400',
    getValue: (d) => `${d.savingsProgress}%`,
    getSub: () => undefined,
  },
]

export const INDICATOR_IDS = INDICATOR_DEFS.map((w) => w.id)

export function getIndicatorDef(id: string): IndicatorDef | undefined {
  return INDICATOR_DEFS.find((w) => w.id === id)
}

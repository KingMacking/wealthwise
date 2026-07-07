import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { TrendingUp, TrendingDown, Wallet, DollarSign, Target, Calendar } from 'lucide-react'
import {
  useDashboard,
  StatCard,
  Indicators,
  DailyEvolutionChart,
  ExpensesByCategoryChart,
  IncomeVsExpensesChart,
  ExpensesByPaymentMethodChart,
  MonthlyComparisonChart,
  SpendingHeatmap,
  RecentMovements,
  DashboardSkeleton,
  DashboardCustomize,
} from '@/features/dashboard'
import { useDashboardPreferences } from '@/hooks/useDashboardPreferences'
import { formatCurrency } from '@/utils/format'

export default function DashboardPage() {
  const data = useDashboard()
  const { prefs, toggle } = useDashboardPreferences()

  if (data.isLoading) return <DashboardSkeleton />

  const now = new Date()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {format(now, "MMMM yyyy", { locale: es })}
          </p>
        </div>
        <DashboardCustomize prefs={prefs} toggle={toggle} />
      </div>

      {prefs.statsCards && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Dinero Inicial"
            value={formatCurrency(data.totalBalance - data.netBalance)}
            icon={Calendar}
            trend="neutral"
          />
          <StatCard
            title="Ingresos"
            value={formatCurrency(data.currentMonthIncomes)}
            icon={TrendingUp}
            trend="up"
          />
          <StatCard
            title="Gastos"
            value={formatCurrency(data.currentMonthExpenses)}
            icon={TrendingDown}
            trend="down"
          />
          <StatCard
            title="Balance Actual"
            value={formatCurrency(data.totalBalance)}
            icon={Wallet}
            trend="neutral"
          />
          <StatCard
            title="Resultado del Mes"
            value={formatCurrency(data.netBalance)}
            icon={DollarSign}
            trend={data.netBalance >= 0 ? 'up' : 'down'}
          />
          <StatCard
            title="Ahorro Generado"
            value={`${data.savingsRate.toFixed(0)}%`}
            icon={Target}
            trend={data.savingsRate >= 10 ? 'up' : 'down'}
          />
        </div>
      )}

      {prefs.indicators && (
        <Indicators
          avgDailyExpense={data.avgDailyExpense}
          highestExpense={data.highestExpense}
          lowestExpense={data.lowestExpense}
          movementCount={data.movementCount}
          expenseCount={data.expenseCount}
          avgTicket={data.avgTicket}
          topCategory={data.topCategory}
        />
      )}

      {prefs.charts && (
        <div className="grid gap-6 lg:grid-cols-2">
          <DailyEvolutionChart data={data.dailyTotals} />
          <ExpensesByCategoryChart data={data.categoryTotals} />
          <IncomeVsExpensesChart data={data.dailyTotals} />
          <ExpensesByPaymentMethodChart data={data.paymentMethodTotals} />
          <MonthlyComparisonChart data={data.monthlyComparison} />
          <SpendingHeatmap data={data.dailyTotals} />
        </div>
      )}

      {prefs.recentMovements && (
        <RecentMovements
          movements={data.movements}
          categories={data.categories}
          isLoading={data.isLoading}
        />
      )}
    </div>
  )
}

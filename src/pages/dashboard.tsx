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
} from '@/features/dashboard'
import { formatCurrency } from '@/utils/format'

export default function DashboardPage() {
  const data = useDashboard()

  if (data.isLoading) return <DashboardSkeleton />

  const now = new Date()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {format(now, "MMMM yyyy", { locale: es })}
        </p>
      </div>

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
          title="Dinero Restante"
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

      <Indicators
        avgDailyExpense={data.avgDailyExpense}
        highestExpense={data.highestExpense}
        lowestExpense={data.lowestExpense}
        movementCount={data.movementCount}
        expenseCount={data.expenseCount}
        avgTicket={data.avgTicket}
        topCategory={data.topCategory}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <DailyEvolutionChart data={data.dailyTotals} />
        <ExpensesByCategoryChart data={data.categoryTotals} />
        <IncomeVsExpensesChart data={data.dailyTotals} />
        <ExpensesByPaymentMethodChart data={data.paymentMethodTotals} />
        <MonthlyComparisonChart data={data.monthlyComparison} />
        <SpendingHeatmap data={data.dailyTotals} />
      </div>

      <RecentMovements
        movements={data.movements}
        categories={data.categories}
        isLoading={data.isLoading}
      />
    </div>
  )
}

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SlidersHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  useDashboard,
  StatCard,
  DailyEvolutionChart,
  ExpensesByCategoryChart,
  IncomeVsExpensesChart,
  ExpensesByPaymentMethodChart,
  MonthlyComparisonChart,
  SpendingHeatmap,
  RecentMovements,
  DashboardSkeleton,
  DashboardCustomize as DashboardCustomizeDialog,
} from '@/features/dashboard'
import { getStatCardDef, getIndicatorDef } from '@/features/dashboard/widgets'
import { useDashboardPreferences } from '@/hooks/useDashboardPreferences'
import type { DashboardData } from '@/features/dashboard/hooks/use-dashboard'
import type { IndicatorDef } from '@/features/dashboard/widgets'

function IndicatorCard({ def, data }: { def: IndicatorDef; data: DashboardData }) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="flex items-start gap-3 p-4">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${def.color}`}>
          <def.icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider truncate">{def.label}</p>
          <p className="text-base font-semibold mt-0.5">{def.getValue(data)}</p>
          {def.getSub(data) && (
            <p className="text-[11px] text-muted-foreground truncate">{def.getSub(data)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const data = useDashboard()
  const { prefs, toggleWidget, toggleSection, reorderWidgets } = useDashboardPreferences()
  const [customizeOpen, setCustomizeOpen] = useState(false)

  if (data.isLoading) return <DashboardSkeleton />

  const now = new Date()
  const enabledStatCards = prefs.statCards.filter((w) => w.enabled)
  const enabledIndicators = prefs.indicators.filter((w) => w.enabled)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {format(now, "MMMM yyyy", { locale: es })}
          </p>
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setCustomizeOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {enabledStatCards.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {enabledStatCards.map(({ id }) => {
            const def = getStatCardDef(id)
            if (!def) return null
            return (
              <StatCard
                key={id}
                title={def.label}
                value={def.getValue(data)}
                icon={def.icon}
                trend={def.getTrend(data)}
              />
            )
          })}
        </div>
      )}

      {enabledIndicators.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {enabledIndicators.map(({ id }) => {
            const def = getIndicatorDef(id)
            if (!def) return null
            return <IndicatorCard key={id} def={def} data={data} />
          })}
        </div>
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

      <DashboardCustomizeDialog
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        prefs={prefs}
        toggleWidget={toggleWidget}
        reorderWidgets={reorderWidgets}
      />
    </div>
  )
}

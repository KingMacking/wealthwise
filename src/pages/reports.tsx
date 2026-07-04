import {
  BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
  PieChart, Pie, Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/format'
import { useThemeStore } from '@/store/theme.store'
import { useReports, YearSelector } from '@/features/reports'

export default function ReportsPage() {
  const resolved = useThemeStore((s) => s.resolved)
  const isDark = resolved === 'dark'

  const {
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
    movementCount,
  } = useReports()

  const tickStyle = { fontSize: 12, fill: isDark ? '#a1a1aa' : '#71717a' }
  const tooltipStyle = { background: isDark ? '#18181b' : '#fff', border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, borderRadius: '8px', fontSize: '13px' }
  const legendFormatter = (value: string) => <span style={{ color: isDark ? '#d4d4d8' : '#52525b', fontSize: '12px' }}>{value}</span>

  const pieSliced = categoryTotals.slice(0, 8)
  const pieOthers = categoryTotals.slice(8)
  const pieOthersTotal = pieOthers.reduce((s, c) => s + c.total, 0)
  const pieData = pieOthersTotal > 0
    ? [...pieSliced, { categoryName: 'Otros', total: pieOthersTotal, color: '#71717a', categoryId: '', percentage: 0, count: 0 }]
    : pieSliced

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-60 mt-1" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
          <p className="text-sm text-muted-foreground">Análisis detallado de tus finanzas</p>
        </div>
        <YearSelector year={year} onPrev={() => setYear(year - 1)} onNext={() => setYear(year + 1)} />
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-emerald-500">{formatCurrency(totalIncomes)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-red-500">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-xl font-semibold ${netBalance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {formatCurrency(netBalance)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Ahorro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-xl font-semibold ${savingsRate >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {savingsRate.toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Ingresos vs Gastos mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e5e7eb'} vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={tickStyle} />
                  <YAxis tickLine={false} axisLine={false} tick={tickStyle} tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), '']} />
                  <Legend formatter={legendFormatter} />
                  <Bar dataKey="incomes" name="Ingresos" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} fillOpacity={0.8} />
                  <Bar dataKey="expenses" name="Gastos" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={24} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Gastos por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="total"
                    nameKey="categoryName"
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [formatCurrency(Number(value)), name]} />
                  <Legend formatter={legendFormatter} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Distribución por método de pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodTotals} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e5e7eb'} horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={tickStyle} tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}K`} />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={tickStyle} width={100} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), 'Total']} />
                  <Bar dataKey="total" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={24} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Top Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {topExpenses.map((m, i) => {
                const cat = categories.find((c) => c.id === m.categoryId)
                return (
                  <div key={m.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-sm truncate max-w-[180px]">{m.description}</p>
                        <div className="flex items-center gap-1.5">
                          {cat && <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />}
                          <span className="text-[11px] text-muted-foreground truncate">{cat?.name ?? '—'}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium ml-2 shrink-0">{formatCurrency(m.amount)}</span>
                  </div>
                )
              })}
              {topExpenses.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No hay gastos en este período</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Resumen anual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Total movimientos</p>
              <p className="font-semibold mt-0.5">{movementCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Promedio mensual gastos</p>
              <p className="font-semibold mt-0.5">{formatCurrency(totalExpenses / 12)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Promedio mensual ingresos</p>
              <p className="font-semibold mt-0.5">{formatCurrency(totalIncomes / 12)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Tasa de ahorro</p>
              <p className="font-semibold mt-0.5">
                <Badge variant={savingsRate >= 0 ? 'success' : 'destructive'} className="text-[10px] px-1.5 py-0">
                  {savingsRate.toFixed(1)}%
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

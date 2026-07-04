import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { useThemeStore } from '@/store/theme.store'
import type { DailyTotal } from '../hooks/use-dashboard'

interface Props {
  data: DailyTotal[]
}

export function DailyEvolutionChart({ data }: Props) {
  const resolved = useThemeStore((s) => s.resolved)
  const isDark = resolved === 'dark'

  const chartData = data.map((d) => ({
    day: d.day,
    Gastos: Math.round(d.expenses),
    Ingresos: Math.round(d.incomes),
  }))

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Evolución diaria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e5e7eb'} vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: isDark ? '#a1a1aa' : '#71717a' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: isDark ? '#a1a1aa' : '#71717a' }} tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: isDark ? '#18181b' : '#fff', border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, borderRadius: '8px', fontSize: '13px' }}
                labelFormatter={(day) => `Día ${day}`}
                formatter={(value) => [formatCurrency(Number(value)), 'Gastos']}
              />
              <Area type="monotone" dataKey="Gastos" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Ingresos" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

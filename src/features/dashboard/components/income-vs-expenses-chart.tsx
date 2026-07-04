import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { useThemeStore } from '@/store/theme.store'
import type { DailyTotal } from '../hooks/use-dashboard'

interface Props {
  data: DailyTotal[]
}

export function IncomeVsExpensesChart({ data }: Props) {
  const resolved = useThemeStore((s) => s.resolved)
  const isDark = resolved === 'dark'

  let cumExpenses = 0
  let cumIncomes = 0
  const chartData = data.map((d) => {
    cumExpenses += d.expenses
    cumIncomes += d.incomes
    return {
      day: d.day,
      'Gastos acumulados': Math.round(cumExpenses),
      'Ingresos acumulados': Math.round(cumIncomes),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Ingresos vs Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e5e7eb'} vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: isDark ? '#a1a1aa' : '#71717a' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: isDark ? '#a1a1aa' : '#71717a' }} tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: isDark ? '#18181b' : '#fff', border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, borderRadius: '8px', fontSize: '13px' }}
                formatter={(value, name) => [formatCurrency(Number(value)), name]}
              />
              <Legend formatter={(value: string) => <span style={{ color: isDark ? '#d4d4d8' : '#52525b', fontSize: '12px' }}>{value}</span>} />
              <Line type="monotone" dataKey="Ingresos acumulados" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Gastos acumulados" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { useThemeStore } from '@/store/theme.store'
import type { MonthlyComparison } from '../hooks/use-dashboard'

interface Props {
  data: MonthlyComparison[]
}

export function MonthlyComparisonChart({ data }: Props) {
  const resolved = useThemeStore((s) => s.resolved)
  const isDark = resolved === 'dark'

  const chartData = data.map((d) => ({
    mes: d.monthLabel,
    Gastos: Math.round(d.expenses),
    Ingresos: Math.round(d.incomes),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Comparación mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e5e7eb'} vertical={false} />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: isDark ? '#a1a1aa' : '#71717a' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: isDark ? '#a1a1aa' : '#71717a' }} tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: isDark ? '#18181b' : '#fff', border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, borderRadius: '8px', fontSize: '13px' }}
                formatter={(value, name) => [formatCurrency(Number(value)), name]}
              />
              <Legend formatter={(value: string) => <span style={{ color: isDark ? '#d4d4d8' : '#52525b', fontSize: '12px' }}>{value}</span>} />
              <Bar dataKey="Gastos" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} fillOpacity={0.8} />
              <Bar dataKey="Ingresos" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { useThemeStore } from '@/store/theme.store'
import type { CategoryTotal } from '../hooks/use-dashboard'

interface Props {
  data: CategoryTotal[]
}

export function ExpensesByCategoryChart({ data }: Props) {
  const resolved = useThemeStore((s) => s.resolved)
  const isDark = resolved === 'dark'

  const sliced = data.slice(0, 8)
  const others = data.slice(8)
  const othersTotal = others.reduce((s, c) => s + c.total, 0)

  const chartData = othersTotal > 0
    ? [...sliced, { categoryName: 'Otros', total: othersTotal, color: '#71717a' }]
    : sliced

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Gastos por categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="total"
                nameKey="categoryName"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                strokeWidth={0}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: isDark ? '#18181b' : '#fff', border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, borderRadius: '8px', fontSize: '13px' }}
                formatter={(value, name) => [formatCurrency(Number(value)), name]}
              />
              <Legend
                formatter={(value: string) => <span style={{ color: isDark ? '#d4d4d8' : '#52525b', fontSize: '12px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

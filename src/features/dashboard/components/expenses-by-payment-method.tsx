import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { useThemeStore } from '@/store/theme.store'
import type { PaymentMethodTotal } from '../hooks/use-dashboard'

const BAR_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

interface Props {
  data: PaymentMethodTotal[]
}

export function ExpensesByPaymentMethodChart({ data }: Props) {
  const resolved = useThemeStore((s) => s.resolved)
  const isDark = resolved === 'dark'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Gastos por método de pago</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e5e7eb'} horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: isDark ? '#a1a1aa' : '#71717a' }} tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="paymentMethodName" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: isDark ? '#a1a1aa' : '#71717a' }} />
              <Tooltip
                contentStyle={{ background: isDark ? '#18181b' : '#fff', border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, borderRadius: '8px', fontSize: '13px' }}
                formatter={(value) => [formatCurrency(Number(value)), 'Total']}
              />
              <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={24}>
                {data.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

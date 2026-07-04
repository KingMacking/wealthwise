import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend: 'up' | 'down' | 'neutral'
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            trend === 'up'
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
              : trend === 'down'
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}

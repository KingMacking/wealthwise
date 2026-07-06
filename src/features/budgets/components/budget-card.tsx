import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import type { Budget } from '@/types'
import type { Category } from '@/types'

interface BudgetCardProps {
  budget: Budget
  category?: Category
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function BudgetCard({ budget, category, onEdit, onDelete }: BudgetCardProps) {
  const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0
  const isWarning = percentage >= 80 && percentage < 100
  const isDanger = percentage >= 100
  const color = category?.color ?? '#3b82f6'

  return (
    <Card className="group relative transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium leading-none">{category?.name ?? 'Sin categoría'}</span>
          </div>
          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(budget.id)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(budget.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Progress
          value={Math.min(percentage, 100)}
          className={`h-2.5 mb-2 ${
            isDanger ? '[&>div]:bg-red-500' : isWarning ? '[&>div]:bg-amber-500' : ''
          }`}
        />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Gastado <strong>{formatCurrency(budget.spent)}</strong>
          </span>
          <span className="text-muted-foreground">
            {formatCurrency(budget.amount)}
          </span>
        </div>
        <div className="mt-1.5 text-right">
          <span
            className={`text-xs font-semibold ${
              isDanger ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'
            }`}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

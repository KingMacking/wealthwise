import * as LucideIcons from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, CircleDollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/format'
import type { Goal } from '@/types'

interface GoalCardProps {
  goal: Goal
  onEdit: (id: string) => void
  onDeposit: (id: string) => void
  onDelete: (id: string) => void
}

export function GoalCard({ goal, onEdit, onDeposit, onDelete }: GoalCardProps) {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100
  const isCompleted = percentage >= 100
  const isNear = percentage >= 80 && !isCompleted
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[goal.icon] ?? LucideIcons.Target

  return (
    <Card className="group relative transition-all duration-200 hover:shadow-md overflow-hidden">
      <div className="h-1.5" style={{ backgroundColor: goal.color }} />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
              style={{ backgroundColor: `${goal.color}15` }}
            >
              <Icon className="h-4 w-4" style={{ color: goal.color }} />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{goal.name}</p>
              {goal.targetDate && (
                <p className="text-xs text-muted-foreground mt-0.5">Meta: {formatDate(goal.targetDate)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity -mt-1 -mr-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeposit(goal.id)} title="Agregar ahorro">
              <CircleDollarSign className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(goal.id)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(goal.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Progress
          value={Math.min(percentage, 100)}
          className={`h-2.5 ${
            isCompleted ? '[&>div]:bg-emerald-500' : isNear ? '[&>div]:bg-amber-500' : ''
          }`}
        />

        <div className="flex justify-between items-baseline">
          <div>
            <p className="text-xs text-muted-foreground">Ahorrado</p>
            <p className="text-sm font-semibold">{formatCurrency(goal.currentAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Meta</p>
            <p className="text-sm font-semibold">{formatCurrency(goal.targetAmount)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold ${
              isCompleted ? 'text-emerald-500' : isNear ? 'text-amber-500' : 'text-muted-foreground'
            }`}
          >
            {percentage.toFixed(1)}%
          </span>
          {isCompleted && (
            <Badge variant="success" className="text-[10px] px-2 py-0">Completado</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

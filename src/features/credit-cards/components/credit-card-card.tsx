import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Pencil, Trash2, CreditCard as CreditCardIcon } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import type { CreditCard } from '@/types'

interface CreditCardCardProps {
  card: CreditCard
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function CreditCardCard({ card, onEdit, onDelete }: CreditCardCardProps) {
  const utilization = card.limit > 0 ? (card.currentConsumption / card.limit) * 100 : 0
  const available = card.limit - card.currentConsumption
  const isDanger = utilization >= 90
  const isWarning = utilization >= 70 && utilization < 90

  return (
    <div className="group relative rounded-xl border bg-card transition-all duration-200 hover:shadow-md overflow-hidden">
      <div className="h-2" style={{ backgroundColor: card.color }} />

      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${card.color}15` }}
            >
              <CreditCardIcon className="h-5 w-5" style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{card.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cierre: {card.closingDay} · Vencimiento: {card.dueDay}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(card.id)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(card.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Consumo actual</p>
            <p className="text-lg font-semibold tracking-tight">
              {formatCurrency(card.currentConsumption)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Disponible</p>
            <p className="text-lg font-semibold tracking-tight">
              {formatCurrency(available)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Utilización</span>
            <span className={isDanger ? 'text-red-500 font-semibold' : isWarning ? 'text-amber-500 font-semibold' : ''}>
              {utilization.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.min(utilization, 100)}
            className={`h-2 ${
              isDanger ? '[&>div]:bg-red-500' : isWarning ? '[&>div]:bg-amber-500' : ''
            }`}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Límite: {formatCurrency(card.limit)}</span>
        </div>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import { ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS } from '../constants'
import type { Account } from '@/types'

interface AccountCardProps {
  account: Account
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  const Icon = ACCOUNT_TYPE_ICONS[account.type]
  const color = account.color

  return (
    <Card className="group relative transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(account.id)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(account.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="mt-3 space-y-0.5">
          <p className="text-sm font-medium leading-none">{account.name}</p>
          <p className="text-xs text-muted-foreground">{ACCOUNT_TYPE_LABELS[account.type]}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{formatCurrency(account.balance)}</p>
      </CardContent>
    </Card>
  )
}

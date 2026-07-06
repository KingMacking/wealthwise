import * as LucideIcons from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import type { PaymentMethod } from '@/types'

interface PaymentMethodCardProps {
  method: PaymentMethod
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function PaymentMethodCard({ method, onEdit, onDelete }: PaymentMethodCardProps) {
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[method.icon] ?? LucideIcons.CreditCard

  return (
    <Card className="group relative transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{method.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(method.id)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(method.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

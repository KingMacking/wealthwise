import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { goalDepositSchema, type GoalDepositValues } from '../schemas/goal.schema'

interface GoalDepositDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: GoalDepositValues) => void
  isDepositing: boolean
}

export function GoalDepositDialog({ open, onClose, onSubmit, isDepositing }: GoalDepositDialogProps) {
  const form = useForm<GoalDepositValues>({
    resolver: zodResolver(goalDepositSchema),
    defaultValues: { amount: undefined as unknown as number },
  })

  const { register, handleSubmit, reset, formState: { errors } } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset({ amount: undefined as unknown as number })
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Agregar ahorro</DialogTitle>
          <DialogDescription>
            Registrá cuánto agregaste a este objetivo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0"
              autoFocus
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isDepositing}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isDepositing}>
              {isDepositing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agregar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

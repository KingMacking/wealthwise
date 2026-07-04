import { useEffect } from 'react'
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
import { Loader2, CreditCard as CreditCardIcon } from 'lucide-react'
import { creditCardFormSchema, type CreditCardFormValues } from '../schemas/credit-card.schema'
import { CARD_COLORS } from '../constants'
import type { CreditCard } from '@/types'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormSubmitHandler = (values: any) => void

interface CreditCardFormProps {
  open: boolean
  onClose: () => void
  onSubmit: FormSubmitHandler
  editingCard: CreditCard | null
  isSaving: boolean
}

export function CreditCardForm({
  open,
  onClose,
  onSubmit,
  editingCard,
  isSaving,
}: CreditCardFormProps) {
  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardFormSchema),
    defaultValues: {
      name: '',
      limit: undefined as unknown as number,
      closingDay: undefined as unknown as number,
      dueDay: undefined as unknown as number,
      currentConsumption: 0,
      color: '#3b82f6',
    },
  })

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form
  const watchColor = watch('color')

  useEffect(() => {
    if (editingCard) {
      reset({
        name: editingCard.name,
        limit: editingCard.limit,
        closingDay: editingCard.closingDay,
        dueDay: editingCard.dueDay,
        currentConsumption: editingCard.currentConsumption,
        color: editingCard.color,
      })
    } else {
      reset({
        name: '',
        limit: undefined as unknown as number,
        closingDay: undefined as unknown as number,
        dueDay: undefined as unknown as number,
        currentConsumption: 0,
        color: '#3b82f6',
      })
    }
  }, [editingCard, reset, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{editingCard ? 'Editar tarjeta' : 'Nueva tarjeta'}</DialogTitle>
          <DialogDescription>
            {editingCard ? 'Modificá los datos de la tarjeta' : 'Agregá una nueva tarjeta'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
              style={{ backgroundColor: `${watchColor}15` }}
            >
              <CreditCardIcon className="h-5 w-5" style={{ color: watchColor }} />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Ej: Visa Galicia" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {CARD_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-7 w-7 rounded-full transition-all duration-200 ${
                    watchColor === color
                      ? 'ring-2 ring-offset-2 ring-offset-background scale-110'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setValue('color', color)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limit">Límite</Label>
              <Input
                id="limit"
                type="number"
                step="0.01"
                placeholder="0"
                {...register('limit', { valueAsNumber: true })}
              />
              {errors.limit && <p className="text-xs text-red-500">{errors.limit.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentConsumption">Consumo actual</Label>
              <Input
                id="currentConsumption"
                type="number"
                step="0.01"
                placeholder="0"
                {...register('currentConsumption', { valueAsNumber: true })}
              />
              {errors.currentConsumption && (
                <p className="text-xs text-red-500">{errors.currentConsumption.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="closingDay">Día de cierre</Label>
              <Input
                id="closingDay"
                type="number"
                min={1}
                max={31}
                placeholder="15"
                {...register('closingDay', { valueAsNumber: true })}
              />
              {errors.closingDay && <p className="text-xs text-red-500">{errors.closingDay.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDay">Día de vencimiento</Label>
              <Input
                id="dueDay"
                type="number"
                min={1}
                max={31}
                placeholder="3"
                {...register('dueDay', { valueAsNumber: true })}
              />
              {errors.dueDay && <p className="text-xs text-red-500">{errors.dueDay.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingCard ? 'Guardar cambios' : 'Crear tarjeta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

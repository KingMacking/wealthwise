import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as LucideIcons from 'lucide-react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'
import { paymentMethodFormSchema, type PaymentMethodFormValues } from '../schemas/payment-method.schema'
import { PAYMENT_METHOD_ICONS } from '../constants'
import type { PaymentMethod } from '@/types'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormSubmitHandler = (values: any) => void

interface PaymentMethodFormProps {
  open: boolean
  onClose: () => void
  onSubmit: FormSubmitHandler
  editingMethod: PaymentMethod | null
  isSaving: boolean
}

export function PaymentMethodForm({
  open,
  onClose,
  onSubmit,
  editingMethod,
  isSaving,
}: PaymentMethodFormProps) {
  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodFormSchema),
    defaultValues: {
      name: '',
      icon: 'CreditCard',
    },
  })

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form
  const watchIcon = watch('icon')
  const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[watchIcon] ?? LucideIcons.CreditCard

  useEffect(() => {
    if (editingMethod) {
      reset({ name: editingMethod.name, icon: editingMethod.icon })
    } else {
      reset({ name: '', icon: 'CreditCard' })
    }
  }, [editingMethod, reset, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{editingMethod ? 'Editar método de pago' : 'Nuevo método de pago'}</DialogTitle>
          <DialogDescription>
            {editingMethod ? 'Modificá el método de pago' : 'Agregá un nuevo método de pago'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Ej: Débito" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icono</Label>
            <ScrollArea className="h-32 rounded-md border">
              <div className="grid grid-cols-8 gap-1 p-2">
                {PAYMENT_METHOD_ICONS.map((iconName) => {
                  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] ?? LucideIcons.CreditCard
                  return (
                    <button
                      key={iconName}
                      type="button"
                      className={`flex items-center justify-center h-8 w-8 rounded-md transition-all ${
                        watchIcon === iconName
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent text-muted-foreground'
                      }`}
                      onClick={() => setValue('icon', iconName)}
                      title={iconName}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingMethod ? 'Guardar cambios' : 'Crear método'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

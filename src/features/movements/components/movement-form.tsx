import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { movementFormSchema, type MovementFormValues } from '../schemas/movement.schema'
import type { Movement, Category, Account, PaymentMethod } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormSubmitHandler = (values: any) => void

interface MovementFormProps {
  open: boolean
  onClose: () => void
  onSubmit: FormSubmitHandler
  editingMovement: Movement | null
  categories: Category[]
  accounts: Account[]
  paymentMethods: PaymentMethod[]
  isSaving: boolean
}

export function MovementForm({
  open,
  onClose,
  onSubmit,
  editingMovement,
  categories,
  accounts,
  paymentMethods,
  isSaving,
}: MovementFormProps) {
  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'expense',
      description: '',
      amount: 0,
      categoryId: '',
      subcategoryId: '',
      accountId: '',
      destinationAccountId: '',
      paymentMethodId: '',
      status: 'confirmed',
      notes: '',
      tags: '',
    },
  })

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form

  const watchType = watch('type')
  const watchCategoryId = watch('categoryId')

  const selectedCategory = categories.find((c) => c.id === watchCategoryId)

  useEffect(() => {
    if (editingMovement) {
      reset({
        date: editingMovement.date.split('T')[0],
        type: editingMovement.type,
        description: editingMovement.description,
        amount: editingMovement.amount,
        categoryId: editingMovement.categoryId,
        subcategoryId: editingMovement.subcategoryId ?? '',
        accountId: editingMovement.accountId,
        destinationAccountId: editingMovement.destinationAccountId ?? '',
        paymentMethodId: editingMovement.paymentMethodId,
        status: editingMovement.status,
        notes: editingMovement.notes ?? '',
        tags: editingMovement.tags.join(', '),
      })
    } else {
      reset({
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'expense',
        description: '',
        amount: 0,
        categoryId: '',
        subcategoryId: '',
        accountId: '',
        paymentMethodId: '',
        status: 'confirmed',
        notes: '',
        tags: '',
      })
    }
  }, [editingMovement, reset, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingMovement ? 'Editar movimiento' : 'Nuevo movimiento'}</DialogTitle>
          <DialogDescription>
            {editingMovement ? 'Modificá los datos del movimiento' : 'Registrá un nuevo movimiento'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                defaultValue={watchType}
                onValueChange={(v: 'income' | 'expense' | 'transfer') => setValue('type', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Gasto</SelectItem>
                  <SelectItem value="income">Ingreso</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" placeholder="Ej: Supermercado Semanal" {...register('description')} />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input id="amount" type="number" step="0.01" placeholder="0.00" {...register('amount', { valueAsNumber: true })} />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoría</Label>
              <Select
                defaultValue={watchCategoryId}
                onValueChange={(v) => {
                  setValue('categoryId', v)
                  setValue('subcategoryId', '')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c.active)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
            </div>

            {selectedCategory && selectedCategory.subcategories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="subcategoryId">Subcategoría</Label>
                <Select value={watch('subcategoryId')} onValueChange={(v) => setValue('subcategoryId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory.subcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="accountId">{watchType === 'transfer' ? 'Cuenta origen' : 'Cuenta'}</Label>
              <Select value={watch('accountId')} onValueChange={(v) => setValue('accountId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountId && <p className="text-xs text-red-500">{errors.accountId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethodId">Método de pago</Label>
              <Select value={watch('paymentMethodId')} onValueChange={(v) => setValue('paymentMethodId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Método" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((pm) => (
                    <SelectItem key={pm.id} value={pm.id}>
                      {pm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paymentMethodId && <p className="text-xs text-red-500">{errors.paymentMethodId.message}</p>}
            </div>
          </div>

          {watchType === 'transfer' && (
            <div className="space-y-2">
              <Label htmlFor="destinationAccountId">Cuenta destino</Label>
              <Select value={watch('destinationAccountId')} onValueChange={(v) => setValue('destinationAccountId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cuenta destino" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((acc) => acc.id !== watch('accountId'))
                    .map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.destinationAccountId && <p className="text-xs text-red-500">{errors.destinationAccountId.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select defaultValue="confirmed" onValueChange={(v: 'pending' | 'confirmed') => setValue('status', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Input id="notes" placeholder="Notas adicionales..." {...register('notes')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" placeholder="tag1, tag2, tag3" {...register('tags')} />
            <p className="text-xs text-muted-foreground">Separados por coma</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingMovement ? 'Guardar cambios' : 'Crear movimiento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

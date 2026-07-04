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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { accountFormSchema, type AccountFormValues } from '../schemas/account.schema'
import { ACCOUNT_TYPES, ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS, ACCOUNT_COLORS } from '../constants'
import type { Account } from '@/types'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormSubmitHandler = (values: any) => void

interface AccountFormProps {
  open: boolean
  onClose: () => void
  onSubmit: FormSubmitHandler
  editingAccount: Account | null
  isSaving: boolean
}

export function AccountForm({
  open,
  onClose,
  onSubmit,
  editingAccount,
  isSaving,
}: AccountFormProps) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      type: 'checking',
      color: '#3b82f6',
      balance: 0,
    },
  })

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form
  const watchType = watch('type')
  const watchColor = watch('color')
  const Icon = ACCOUNT_TYPE_ICONS[watchType]

  useEffect(() => {
    if (editingAccount) {
      reset({
        name: editingAccount.name,
        type: editingAccount.type,
        color: editingAccount.color,
        balance: editingAccount.balance,
      })
    } else {
      reset({
        name: '',
        type: 'checking',
        color: '#3b82f6',
        balance: 0,
      })
    }
  }, [editingAccount, reset, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{editingAccount ? 'Editar cuenta' : 'Nueva cuenta'}</DialogTitle>
          <DialogDescription>
            {editingAccount ? 'Modificá los datos de la cuenta' : 'Agregá una nueva cuenta'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
              style={{ backgroundColor: `${watchColor}15` }}
            >
              <Icon className="h-5 w-5" style={{ color: watchColor }} />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Ej: Banco Galicia" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={watchType}
              onValueChange={(v: 'cash' | 'checking' | 'savings' | 'investment') => setValue('type', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div className="flex items-center gap-2">
                      {ACCOUNT_TYPE_LABELS[t.value]}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {ACCOUNT_COLORS.map((color) => (
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

          <div className="space-y-2">
            <Label htmlFor="balance">Saldo inicial</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0"
              {...register('balance', { valueAsNumber: true })}
            />
            {errors.balance && <p className="text-xs text-red-500">{errors.balance.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingAccount ? 'Guardar cambios' : 'Crear cuenta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

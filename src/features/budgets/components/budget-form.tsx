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
import { budgetFormSchema, type BudgetFormValues } from '../schemas/budget.schema'
import type { Budget, Category } from '@/types'

interface BudgetFormProps {
  open: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => void
  editingBudget: Budget | null
  categories: Category[]
  isSaving: boolean
}

export function BudgetForm({
  open,
  onClose,
  onSubmit,
  editingBudget,
  categories,
  isSaving,
}: BudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: '',
      amount: undefined as unknown as number,
    },
  })

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form

  useEffect(() => {
    if (editingBudget) {
      reset({
        categoryId: editingBudget.categoryId,
        amount: editingBudget.amount,
      })
    } else {
      reset({
        categoryId: '',
        amount: undefined as unknown as number,
      })
    }
  }, [editingBudget, reset, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{editingBudget ? 'Editar presupuesto' : 'Nuevo presupuesto'}</DialogTitle>
          <DialogDescription>
            {editingBudget
              ? 'Actualizá el límite de gasto para esta categoría'
              : 'Establecé un límite de gasto mensual'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoría</Label>
            <Select
              value={watch('categoryId')}
              onValueChange={(v) => setValue('categoryId', v)}
              disabled={!!editingBudget}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.active)
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Límite mensual</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingBudget ? 'Guardar cambios' : 'Crear presupuesto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

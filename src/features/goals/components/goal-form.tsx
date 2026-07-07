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
import { ColorPicker } from '@/components/ui/color-picker'
import { goalFormSchema, type GoalFormValues } from '../schemas/goal.schema'
import { GOAL_ICONS } from '../constants'
import type { Goal } from '@/types'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormSubmitHandler = (values: any) => void

interface GoalFormProps {
  open: boolean
  onClose: () => void
  onSubmit: FormSubmitHandler
  editingGoal: Goal | null
  isSaving: boolean
}

export function GoalForm({
  open,
  onClose,
  onSubmit,
  editingGoal,
  isSaving,
}: GoalFormProps) {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: '',
      targetAmount: undefined as unknown as number,
      currentAmount: 0,
      targetDate: null,
      icon: 'Target',
      color: '#3b82f6',
    },
  })

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form
  const watchIcon = watch('icon')
  const watchColor = watch('color')
  const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[watchIcon] ?? LucideIcons.Target

  useEffect(() => {
    if (editingGoal) {
      reset({
        name: editingGoal.name,
        targetAmount: editingGoal.targetAmount,
        currentAmount: editingGoal.currentAmount,
        targetDate: editingGoal.targetDate,
        icon: editingGoal.icon,
        color: editingGoal.color,
      })
    } else {
      reset({
        name: '',
        targetAmount: undefined as unknown as number,
        currentAmount: 0,
        targetDate: null,
        icon: 'Target',
        color: '#3b82f6',
      })
    }
  }, [editingGoal, reset, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingGoal ? 'Editar objetivo' : 'Nuevo objetivo'}</DialogTitle>
          <DialogDescription>
            {editingGoal ? 'Modificá los datos del objetivo' : 'Definí una meta financiera'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
              style={{ backgroundColor: `${watchColor}15` }}
            >
              <IconComponent className="h-5 w-5" style={{ color: watchColor }} />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Ej: Viaje a Japón" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icono</Label>
            <ScrollArea className="h-32 rounded-md border">
              <div className="grid grid-cols-8 gap-1 p-2">
                {GOAL_ICONS.map((iconName) => {
                  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] ?? LucideIcons.Target
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

          <div className="space-y-2">
            <Label>Color</Label>
            <ColorPicker value={watchColor} onChange={(color) => setValue('color', color)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Meta</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="0"
                {...register('targetAmount', { valueAsNumber: true })}
              />
              {errors.targetAmount && <p className="text-xs text-red-500">{errors.targetAmount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentAmount">Ahorrado inicial</Label>
              <Input
                id="currentAmount"
                type="number"
                step="0.01"
                placeholder="0"
                {...register('currentAmount', { valueAsNumber: true })}
              />
              {errors.currentAmount && <p className="text-xs text-red-500">{errors.currentAmount.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Fecha meta (opcional)</Label>
            <Input
              id="targetDate"
              type="date"
              {...register('targetDate')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingGoal ? 'Guardar cambios' : 'Crear objetivo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Plus, X, GripVertical } from 'lucide-react'
import { categoryFormSchema, type CategoryFormValues } from '../schemas/category.schema'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants'
import type { Category } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormSubmitHandler = (values: any) => void

interface CategoryFormProps {
  open: boolean
  onClose: () => void
  onSubmit: FormSubmitHandler
  editingCategory: Category | null
  isSaving: boolean
}

export function CategoryForm({
  open,
  onClose,
  onSubmit,
  editingCategory,
  isSaving,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      icon: 'Folder',
      color: '#3b82f6',
      monthlyBudget: undefined,
      active: true,
      subcategories: [],
    },
  })

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'subcategories' })
  const watchIcon = watch('icon')
  const watchColor = watch('color')
  const [newSubName, setNewSubName] = useState('')

  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        icon: editingCategory.icon,
        color: editingCategory.color,
        monthlyBudget: editingCategory.monthlyBudget ?? undefined,
        active: editingCategory.active,
        subcategories: editingCategory.subcategories,
      })
    } else {
      reset({
        name: '',
        icon: 'Folder',
        color: '#3b82f6',
        monthlyBudget: undefined,
        active: true,
        subcategories: [],
      })
    }
  }, [editingCategory, reset, open])

  const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[watchIcon] ?? LucideIcons.Folder

  const addSubcategory = () => {
    const name = newSubName.trim()
    if (!name) return
    append({ id: crypto.randomUUID?.() ?? `${Date.now()}`, name })
    setNewSubName('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
          <DialogDescription>
            {editingCategory ? 'Modificá los datos de la categoría' : 'Creá una nueva categoría'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl transition-colors"
              style={{ backgroundColor: `${watchColor}20` }}
            >
              <IconComponent className="h-6 w-6" style={{ color: watchColor }} />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Ej: Comida" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((color) => (
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
            <Label>Icono</Label>
            <ScrollArea className="h-32 rounded-md border">
              <div className="grid grid-cols-8 gap-1 p-2">
                {CATEGORY_ICONS.map((iconName) => {
                  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] ?? LucideIcons.Folder
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
            <Label htmlFor="monthlyBudget">Presupuesto mensual</Label>
            <Input
              id="monthlyBudget"
              type="number"
              placeholder="0"
              {...register('monthlyBudget', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
            />
            {errors.monthlyBudget && <p className="text-xs text-red-500">{errors.monthlyBudget.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Categoría activa</Label>
            <Switch
              id="active"
              checked={watch('active')}
              onCheckedChange={(v) => setValue('active', v)}
            />
          </div>

          <div className="space-y-3">
            <Label>Subcategorías</Label>
            <div className="space-y-2">
              {fields.map((field, i) => (
                <div key={field.id} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    {...register(`subcategories.${i}.name`)}
                    className="h-8 text-sm"
                    placeholder="Nombre de subcategoría"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="Nueva subcategoría..."
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSubcategory()
                  }
                }}
              />
              <Button type="button" variant="outline" size="sm" className="h-8" onClick={addSubcategory}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingCategory ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

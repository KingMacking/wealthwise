import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/api'
import { toast } from 'sonner'
import type { CategoryFormValues } from '../schemas/category.schema'

export function useCategories() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const categories = useQuery(api.categories.getAll) ?? []

  const createCategory = useMutation(api.categories.create)
  const updateCategory = useMutation(api.categories.update)
  const deleteCategory = useMutation(api.categories.remove)

  const openCreate = useCallback(() => {
    setEditingCategory(null)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((id: string) => {
    setEditingCategory(id)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditingCategory(null)
  }, [])

  const openDelete = useCallback((id: string) => {
    setDeleteTarget(id)
    setDeleteDialogOpen(true)
  }, [])

  const closeDelete = useCallback(() => {
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }, [])

  const editingData = editingCategory
    ? categories.find((c) => c._id === editingCategory) ?? null
    : null

  const submitForm = useCallback(
    async (values: CategoryFormValues) => {
      setIsSaving(true)
      try {
        if (editingCategory) {
          await updateCategory({
            id: editingCategory,
            name: values.name,
            icon: values.icon,
            color: values.color,
            monthlyBudget: values.monthlyBudget ?? undefined,
            active: values.active,
            subcategories: values.subcategories ?? [],
          })
          toast.success('Categoría actualizada')
        } else {
          await createCategory({
            name: values.name,
            icon: values.icon,
            color: values.color,
            monthlyBudget: values.monthlyBudget ?? undefined,
            active: values.active,
            subcategories: values.subcategories ?? [],
          })
          toast.success('Categoría creada')
        }
        closeForm()
      } catch {
        toast.error(editingCategory ? 'Error al actualizar la categoría' : 'Error al crear la categoría')
      }
      setIsSaving(false)
    },
    [editingCategory, createCategory, updateCategory]
  )

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await deleteCategory({ id: deleteTarget })
      toast.success('Categoría eliminada')
      closeDelete()
    } catch {
      toast.error('Error al eliminar la categoría')
    }
  }, [deleteTarget, deleteCategory])

  return {
    categories,
    isLoading: categories === undefined,
    formOpen,
    editingCategory: editingData,
    isSaving,
    deleteDialogOpen,
    deleteTarget,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    openDelete,
    closeDelete,
    confirmDelete,
  }
}

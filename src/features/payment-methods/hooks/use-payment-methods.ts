import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/api'
import { toast } from 'sonner'
import type { PaymentMethodFormValues } from '../schemas/payment-method.schema'

export function usePaymentMethods() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const methods = useQuery(api.paymentMethods.getAll) ?? []

  const createMethod = useMutation(api.paymentMethods.create)
  const updateMethod = useMutation(api.paymentMethods.update)
  const deleteMethod = useMutation(api.paymentMethods.remove)

  const openCreate = useCallback(() => {
    setEditingMethod(null)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((id: string) => {
    setEditingMethod(id)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditingMethod(null)
  }, [])

  const openDelete = useCallback((id: string) => {
    setDeleteTarget(id)
    setDeleteDialogOpen(true)
  }, [])

  const closeDelete = useCallback(() => {
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }, [])

  const editingData = editingMethod
    ? methods.find((m) => m._id === editingMethod) ?? null
    : null

  const submitForm = useCallback(
    async (values: PaymentMethodFormValues) => {
      setIsSaving(true)
      try {
        if (editingMethod) {
          await updateMethod({ id: editingMethod, ...values })
          toast.success('Método de pago actualizado')
        } else {
          await createMethod(values)
          toast.success('Método de pago creado')
        }
        closeForm()
      } catch {
        toast.error(editingMethod ? 'Error al actualizar el método' : 'Error al crear el método')
      }
      setIsSaving(false)
    },
    [editingMethod, createMethod, updateMethod]
  )

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await deleteMethod({ id: deleteTarget })
      toast.success('Método de pago eliminado')
      closeDelete()
    } catch {
      toast.error('Error al eliminar el método de pago')
    }
  }, [deleteTarget, deleteMethod])

  return {
    methods,
    isLoading: methods === undefined,
    formOpen,
    editingMethod: editingData,
    isSaving,
    deleteDialogOpen,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    openDelete,
    closeDelete,
    confirmDelete,
  }
}

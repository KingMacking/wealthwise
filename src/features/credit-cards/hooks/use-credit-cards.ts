import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/api'
import { toast } from 'sonner'
import type { CreditCardFormValues } from '../schemas/credit-card.schema'

export function useCreditCards() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const cards = useQuery(api.creditCards.getAll) ?? []

  const createCard = useMutation(api.creditCards.create)
  const updateCard = useMutation(api.creditCards.update)
  const deleteCard = useMutation(api.creditCards.remove)

  const openCreate = useCallback(() => {
    setEditingCard(null)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((id: string) => {
    setEditingCard(id)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditingCard(null)
  }, [])

  const openDelete = useCallback((id: string) => {
    setDeleteTarget(id)
    setDeleteDialogOpen(true)
  }, [])

  const closeDelete = useCallback(() => {
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }, [])

  const editingData = editingCard
    ? cards.find((c) => c._id === editingCard) ?? null
    : null

  const submitForm = useCallback(
    async (values: CreditCardFormValues) => {
      setIsSaving(true)
      try {
        if (editingCard) {
          await updateCard({ id: editingCard, ...values })
          toast.success('Tarjeta actualizada')
        } else {
          await createCard(values)
          toast.success('Tarjeta creada')
        }
        closeForm()
      } catch {
        toast.error(editingCard ? 'Error al actualizar la tarjeta' : 'Error al crear la tarjeta')
      }
      setIsSaving(false)
    },
    [editingCard, createCard, updateCard]
  )

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await deleteCard({ id: deleteTarget })
      toast.success('Tarjeta eliminada')
      closeDelete()
    } catch {
      toast.error('Error al eliminar la tarjeta')
    }
  }, [deleteTarget, deleteCard])

  return {
    cards,
    isLoading: cards === undefined,
    formOpen,
    editingCard: editingData,
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

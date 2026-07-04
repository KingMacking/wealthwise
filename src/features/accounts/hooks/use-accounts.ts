import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/api'
import { toast } from 'sonner'
import type { AccountFormValues } from '../schemas/account.schema'

export function useAccounts() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const accounts = useQuery(api.accounts.getAll) ?? []

  const createAccount = useMutation(api.accounts.create)
  const updateAccount = useMutation(api.accounts.update)
  const deleteAccount = useMutation(api.accounts.remove)

  const openCreate = useCallback(() => {
    setEditingAccount(null)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((id: string) => {
    setEditingAccount(id)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditingAccount(null)
  }, [])

  const openDelete = useCallback((id: string) => {
    setDeleteTarget(id)
    setDeleteDialogOpen(true)
  }, [])

  const closeDelete = useCallback(() => {
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }, [])

  const editingData = editingAccount
    ? accounts.find((a) => a._id === editingAccount) ?? null
    : null

  const submitForm = useCallback(
    async (values: AccountFormValues) => {
      setIsSaving(true)
      try {
        if (editingAccount) {
          await updateAccount({ id: editingAccount, ...values })
          toast.success('Cuenta actualizada')
        } else {
          await createAccount(values)
          toast.success('Cuenta creada')
        }
        closeForm()
      } catch {
        toast.error(editingAccount ? 'Error al actualizar la cuenta' : 'Error al crear la cuenta')
      }
      setIsSaving(false)
    },
    [editingAccount, createAccount, updateAccount]
  )

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await deleteAccount({ id: deleteTarget })
      toast.success('Cuenta eliminada')
      closeDelete()
    } catch {
      toast.error('Error al eliminar la cuenta')
    }
  }, [deleteTarget, deleteAccount])

  return {
    accounts,
    isLoading: accounts === undefined,
    formOpen,
    editingAccount: editingData,
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

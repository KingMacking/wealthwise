import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/api'
import { toast } from 'sonner'
import type { GoalFormValues, GoalDepositValues } from '../schemas/goal.schema'

export function useGoals() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [depositOpen, setDepositOpen] = useState(false)
  const [depositTarget, setDepositTarget] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)

  const goals = useQuery(api.goals.getAll) ?? []

  const createGoal = useMutation(api.goals.create)
  const updateGoal = useMutation(api.goals.update)
  const depositGoal = useMutation(api.goals.deposit)
  const deleteGoal = useMutation(api.goals.remove)

  const openCreate = useCallback(() => {
    setEditingGoal(null)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((id: string) => {
    setEditingGoal(id)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditingGoal(null)
  }, [])

  const openDeposit = useCallback((id: string) => {
    setDepositTarget(id)
    setDepositOpen(true)
  }, [])

  const closeDeposit = useCallback(() => {
    setDepositOpen(false)
    setDepositTarget(null)
  }, [])

  const openDelete = useCallback((id: string) => {
    setDeleteTarget(id)
    setDeleteDialogOpen(true)
  }, [])

  const closeDelete = useCallback(() => {
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }, [])

  const editingData = editingGoal
    ? goals.find((g) => g._id === editingGoal) ?? null
    : null

  const submitForm = useCallback(
    async (values: GoalFormValues) => {
      setIsSaving(true)
      try {
        if (editingGoal) {
          await updateGoal({
            id: editingGoal,
            name: values.name,
            targetAmount: values.targetAmount,
            currentAmount: values.currentAmount,
            targetDate: values.targetDate || undefined,
            icon: values.icon,
            color: values.color,
          })
          toast.success('Objetivo actualizado')
        } else {
          await createGoal({
            name: values.name,
            targetAmount: values.targetAmount,
            currentAmount: values.currentAmount,
            targetDate: values.targetDate || undefined,
            icon: values.icon,
            color: values.color,
          })
          toast.success('Objetivo creado')
        }
        closeForm()
      } catch {
        toast.error(editingGoal ? 'Error al actualizar el objetivo' : 'Error al crear el objetivo')
      }
      setIsSaving(false)
    },
    [editingGoal, createGoal, updateGoal]
  )

  const submitDeposit = useCallback(
    async (values: GoalDepositValues) => {
      if (!depositTarget) return
      setIsDepositing(true)
      try {
        await depositGoal({ id: depositTarget, amount: values.amount })
        toast.success('Ahorro registrado')
        closeDeposit()
      } catch {
        toast.error('Error al registrar el ahorro')
      }
      setIsDepositing(false)
    },
    [depositTarget, depositGoal]
  )

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await deleteGoal({ id: deleteTarget })
      toast.success('Objetivo eliminado')
      closeDelete()
    } catch {
      toast.error('Error al eliminar el objetivo')
    }
  }, [deleteTarget, deleteGoal])

  return {
    goals,
    isLoading: goals === undefined,
    formOpen,
    editingGoal: editingData,
    isSaving,
    depositOpen,
    isDepositing,
    deleteDialogOpen,
    isDeleting: false,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    openDeposit,
    closeDeposit,
    submitDeposit,
    openDelete,
    closeDelete,
    confirmDelete,
  }
}

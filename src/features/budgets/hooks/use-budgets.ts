import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/api'
import { toast } from 'sonner'
import type { BudgetFormValues } from '../schemas/budget.schema'

function getMonthDates(month: number, year: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return { start, end }
}

export function useBudgets() {
  const today = new Date()
  const [currentMonth, setMonth] = useState(today.getMonth() + 1)
  const [currentYear, setYear] = useState(today.getFullYear())
  const [formOpen, setFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { start, end } = getMonthDates(currentMonth, currentYear)

  const budgetsRaw = useQuery(api.budgets.getByMonth, { month: currentMonth, year: currentYear }) ?? []
  const categories = useQuery(api.categories.getAll) ?? []
  const movementsForMonth = useQuery(api.movements.getByDateRange, { startDate: start, endDate: end }) ?? []

  const spentByCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const m of movementsForMonth) {
      if (m.type === 'expense') {
        map.set(m.categoryId, (map.get(m.categoryId) ?? 0) + m.amount)
      }
    }
    return map
  }, [movementsForMonth])

  const budgets = useMemo(
    () =>
      budgetsRaw.map((b) => ({
        ...b,
        spent: spentByCategory.get(b.categoryId) ?? 0,
      })),
    [budgetsRaw, spentByCategory]
  )

  const budgetedCategoryIds = useMemo(
    () => new Set(budgetsRaw.map((b) => b.categoryId)),
    [budgetsRaw]
  )

  const unbudgetedCategories = useMemo(
    () => categories.filter((c) => c.active && !budgetedCategoryIds.has(c._id)),
    [categories, budgetedCategoryIds]
  )

  const createBudget = useMutation(api.budgets.create)
  const updateBudget = useMutation(api.budgets.update)
  const deleteBudget = useMutation(api.budgets.remove)

  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 1) {
      setMonth(12)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }, [currentMonth])

  const goToNextMonth = useCallback(() => {
    if (currentMonth === 12) {
      setMonth(1)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }, [currentMonth])

  const openCreate = useCallback(() => {
    setEditingBudget(null)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((id: string) => {
    setEditingBudget(id)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditingBudget(null)
  }, [])

  const openDelete = useCallback((id: string) => {
    setDeleteTarget(id)
    setDeleteDialogOpen(true)
  }, [])

  const closeDelete = useCallback(() => {
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }, [])

  const editingData = editingBudget
    ? budgetsRaw.find((b) => b._id === editingBudget) ?? null
    : null

  const submitForm = useCallback(
    async (values: BudgetFormValues) => {
      setIsSaving(true)
      try {
        if (editingBudget) {
          await updateBudget({
            id: editingBudget,
            categoryId: values.categoryId,
            month: currentMonth,
            year: currentYear,
            amount: values.amount,
          })
          toast.success('Presupuesto actualizado')
        } else {
          await createBudget({
            categoryId: values.categoryId,
            month: currentMonth,
            year: currentYear,
            amount: values.amount,
          })
          toast.success('Presupuesto creado')
        }
        closeForm()
      } catch {
        toast.error(editingBudget ? 'Error al actualizar el presupuesto' : 'Error al crear el presupuesto')
      }
      setIsSaving(false)
    },
    [editingBudget, currentMonth, currentYear, createBudget, updateBudget]
  )

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await deleteBudget({ id: deleteTarget })
      toast.success('Presupuesto eliminado')
      closeDelete()
    } catch {
      toast.error('Error al eliminar el presupuesto')
    }
  }, [deleteTarget, deleteBudget])

  return {
    budgets,
    unbudgetedCategories,
    categories,
    isLoading: budgetsRaw === undefined || categories === undefined,
    currentMonth,
    currentYear,
    formOpen,
    editingBudget: editingData,
    isSaving,
    deleteDialogOpen,
    deleteTarget,
    goToPrevMonth,
    goToNextMonth,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    openDelete,
    closeDelete,
    confirmDelete,
  }
}

import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/api'
import { toast } from 'sonner'
import type { MovementFilters, MovementType, MovementStatus } from '@/types'
import type { MovementFormValues } from '../schemas/movement.schema'

export type SortField = 'date' | 'description' | 'amount' | 'type' | 'status' | 'categoryId'

export interface MovementsState {
  search: string
  typeFilter: MovementType | 'all'
  statusFilter: MovementStatus | 'all'
  categoryFilter: string
  sortField: SortField
  sortOrder: 'asc' | 'desc'
  page: number
  pageSize: number
  selectedIds: string[]
  formOpen: boolean
  editingMovement: string | null
  deleteDialogOpen: boolean
  deleteTarget: string | null
}

export function useMovements() {
  const [state, setState] = useState<MovementsState>({
    search: '',
    typeFilter: 'all',
    statusFilter: 'all',
    categoryFilter: '',
    sortField: 'date',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10,
    selectedIds: [],
    formOpen: false,
    editingMovement: null,
    deleteDialogOpen: false,
    deleteTarget: null,
  })

  const filters: MovementFilters = useMemo(() => ({
    search: state.search || undefined,
    type: state.typeFilter !== 'all' ? state.typeFilter : undefined,
    status: state.statusFilter !== 'all' ? state.statusFilter : undefined,
    categoryId: state.categoryFilter || undefined,
    sortBy: state.sortField,
    sortOrder: state.sortOrder,
    page: state.page,
    limit: state.pageSize,
  }), [state.search, state.typeFilter, state.statusFilter, state.categoryFilter, state.sortField, state.sortOrder, state.page, state.pageSize])

  const movementsData = useQuery(api.movements.getAll, { filters })
  const categories = useQuery(api.categories.getAll) ?? []
  const accounts = useQuery(api.accounts.getAll) ?? []
  const paymentMethods = useQuery(api.paymentMethods.getAll) ?? []

  const createMovement = useMutation(api.movements.create)
  const updateMovement = useMutation(api.movements.update)
  const deleteMovement = useMutation(api.movements.remove)
  const deleteManyMovements = useMutation(api.movements.deleteMany)

  const openCreate = useCallback(() => setState((s) => ({ ...s, formOpen: true, editingMovement: null })), [])
  const openEdit = useCallback((id: string) => setState((s) => ({ ...s, formOpen: true, editingMovement: id })), [])
  const closeForm = useCallback(() => setState((s) => ({ ...s, formOpen: false, editingMovement: null })), [])

  const openDelete = useCallback((id: string) => setState((s) => ({ ...s, deleteDialogOpen: true, deleteTarget: id })), [])
  const closeDelete = useCallback(() => setState((s) => ({ ...s, deleteDialogOpen: false, deleteTarget: null })), [])

  const editingMovementData = useMemo(() => {
    if (!state.editingMovement || !movementsData?.data) return null
    return movementsData.data.find((m) => m._id === state.editingMovement) ?? null
  }, [state.editingMovement, movementsData?.data])

  const submitForm = useCallback(
    async (values: MovementFormValues) => {
      if (state.editingMovement) {
        try {
          await updateMovement({
            id: state.editingMovement,
            date: values.date,
            type: values.type,
            description: values.description,
            amount: values.amount,
            categoryId: values.categoryId,
            subcategoryId: values.subcategoryId || undefined,
            accountId: values.accountId,
            destinationAccountId: values.destinationAccountId || undefined,
            paymentMethodId: values.paymentMethodId,
            status: values.status,
            notes: values.notes || undefined,
            tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
          })
          toast.success('Movimiento actualizado correctamente')
          setState((s) => ({ ...s, formOpen: false, editingMovement: null }))
        } catch {
          toast.error('Error al actualizar el movimiento')
        }
      } else {
        try {
          await createMovement({
            date: values.date,
            type: values.type,
            description: values.description,
            amount: values.amount,
            categoryId: values.categoryId,
            subcategoryId: values.subcategoryId || undefined,
            accountId: values.accountId,
            destinationAccountId: values.destinationAccountId || undefined,
            paymentMethodId: values.paymentMethodId,
            status: values.status,
            notes: values.notes || undefined,
            tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
          })
          toast.success('Movimiento creado correctamente')
          setState((s) => ({ ...s, formOpen: false }))
        } catch {
          toast.error('Error al crear el movimiento')
        }
      }
    },
    [state.editingMovement, createMovement, updateMovement]
  )

  const confirmDelete = useCallback(async () => {
    if (!state.deleteTarget) return
    try {
      await deleteMovement({ id: state.deleteTarget })
      toast.success('Movimiento eliminado')
      setState((s) => ({ ...s, deleteDialogOpen: false, deleteTarget: null }))
    } catch {
      toast.error('Error al eliminar el movimiento')
    }
  }, [state.deleteTarget, deleteMovement])

  const deleteSelected = useCallback(async () => {
    if (state.selectedIds.length === 0) return
    try {
      await deleteManyMovements({ ids: state.selectedIds })
      toast.success(`${state.selectedIds.length} movimientos eliminados`)
      setState((s) => ({ ...s, selectedIds: [] }))
    } catch {
      toast.error('Error al eliminar movimientos')
    }
  }, [state.selectedIds, deleteManyMovements])

  return {
    state,
    setState,
    movements: movementsData?.data ?? [],
    total: movementsData?.total ?? 0,
    isLoading: movementsData === undefined,
    categories,
    accounts,
    paymentMethods,
    editingMovementData,
    isSaving: false,
    submitForm,
    openCreate,
    openEdit,
    closeForm,
    openDelete,
    closeDelete,
    confirmDelete,
    deleteSelected,
  }
}

import { useState, useCallback } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@convex/api'
import { Plus, Trash2, Download, Upload, FileSpreadsheet, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useMovements,
  MovementForm,
  MovementFilters,
  MovementsTable,
  DeleteConfirmDialog,
} from '@/features/movements'
import { useExport, ImportDialog } from '@/features/import-export'
import type { CreateMovementDTO } from '@/types'

export default function MovementsPage() {
  const createMovement = useMutation(api.movements.create)
  const {
    state,
    setState,
    movements,
    total,
    isLoading,
    categories,
    accounts,
    paymentMethods,
    editingMovementData,
    isSaving,
    submitForm,
    openCreate,
    openEdit,
    closeForm,
    openDelete,
    closeDelete,
    confirmDelete,
    deleteSelected,
  } = useMovements()

  const { exportCSV, exportJSON } = useExport()
  const [importOpen, setImportOpen] = useState(false)

  const handleImport = useCallback(async (dtos: CreateMovementDTO[]) => {
    let success = 0
    const errors: string[] = []

    for (let i = 0; i < dtos.length; i++) {
      try {
        await createMovement(dtos[i])
        success++
      } catch {
        errors.push(`Fila ${i + 1}: error al crear movimiento`)
      }
    }

    return { success, errors }
  }, [createMovement])

  const hasFilters =
    state.search !== '' ||
    state.typeFilter !== 'all' ||
    state.statusFilter !== 'all' ||
    state.categoryFilter !== ''

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Movimientos</h1>
          <p className="text-sm text-muted-foreground">
            Todos tus movimientos financieros
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {state.selectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={deleteSelected}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar ({state.selectedIds.length})
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportCSV(movements)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportJSON(movements)}>
                <FileJson className="mr-2 h-4 w-4" />
                JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </div>
      </div>

      <MovementFilters
        search={state.search}
        onSearchChange={(v) => setState((s) => ({ ...s, search: v, page: 1 }))}
        typeFilter={state.typeFilter}
        onTypeFilterChange={(v) => setState((s) => ({ ...s, typeFilter: v, page: 1 }))}
        statusFilter={state.statusFilter}
        onStatusFilterChange={(v) => setState((s) => ({ ...s, statusFilter: v, page: 1 }))}
        categoryFilter={state.categoryFilter}
        onCategoryFilterChange={(v) => setState((s) => ({ ...s, categoryFilter: v, page: 1 }))}
        categories={categories}
        onClear={() =>
          setState((s) => ({
            ...s,
            search: '',
            typeFilter: 'all',
            statusFilter: 'all',
            categoryFilter: '',
            page: 1,
          }))
        }
        hasFilters={hasFilters}
      />

      <MovementsTable
        movements={movements}
        categories={categories}
        total={total}
        page={state.page}
        pageSize={state.pageSize}
        isLoading={isLoading}
        sortField={state.sortField}
        sortOrder={state.sortOrder}
        selectedIds={state.selectedIds}
        onSort={(field) =>
          setState((s) => ({
            ...s,
            sortField: field,
            sortOrder: s.sortField === field && s.sortOrder === 'asc' ? 'desc' : 'asc',
          }))
        }
        onSelect={(ids) => setState((s) => ({ ...s, selectedIds: ids }))}
        onEdit={openEdit}
        onDelete={openDelete}
        onPageChange={(page) => setState((s) => ({ ...s, page }))}
        onPageSizeChange={(pageSize) => setState((s) => ({ ...s, pageSize, page: 1 }))}
      />

      <MovementForm
        open={state.formOpen}
        onClose={closeForm}
        onSubmit={submitForm}
        editingMovement={editingMovementData}
        categories={categories}
        accounts={accounts}
        paymentMethods={paymentMethods}
        isSaving={isSaving}
      />

      <DeleteConfirmDialog
        open={state.deleteDialogOpen}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        isDeleting={false}
      />

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />
    </div>
  )
}

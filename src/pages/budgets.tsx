import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBudgets, BudgetCard, BudgetForm, BudgetDeleteDialog } from '@/features/budgets'
import { formatMonthYear } from '@/utils/format'
import { StaggerContainer, StaggerItem } from '@/features/animations'

export default function BudgetsPage() {
  const {
    budgets,
    unbudgetedCategories,
    categories,
    isLoading,
    currentMonth,
    currentYear,
    formOpen,
    editingBudget,
    isSaving,
    deleteDialogOpen,
    goToPrevMonth,
    goToNextMonth,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    openDelete,
    closeDelete,
    confirmDelete,
  } = useBudgets()

  const dateObj = new Date(currentYear, currentMonth - 1)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Presupuestos</h1>
          <p className="text-sm text-muted-foreground">
            Controlá tus límites de gasto por categoría
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo presupuesto
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[140px] text-center capitalize">
          {formatMonthYear(dateObj)}
        </span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <StaggerContainer className="grid gap-4 md:grid-cols-2">
        {budgets.map((budget) => {
          const cat = categories.find((c) => c.id === budget.categoryId)
          return (
            <StaggerItem key={budget.id}>
              <BudgetCard
                budget={budget}
                category={cat}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            </StaggerItem>
          )
        })}
      </StaggerContainer>

      {unbudgetedCategories.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Sin presupuesto este mes
          </h2>
          <div className="flex flex-wrap gap-2">
            {unbudgetedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  openCreate()
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
                <Plus className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      <BudgetForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={submitForm}
        editingBudget={editingBudget}
        categories={categories}
        isSaving={isSaving}
      />

      <BudgetDeleteDialog
        open={deleteDialogOpen}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        isDeleting={false}
      />
    </div>
  )
}

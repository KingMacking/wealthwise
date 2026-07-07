import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCategories,
  CategoryCard,
  CategoryForm,
  CategoryDeleteDialog,
} from '@/features/categories'
import { StaggerContainer, StaggerItem } from '@/features/animations'

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    formOpen,
    editingCategory,
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
  } = useCategories()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-60 mt-1" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const activeCategories = categories.filter((c) => c.active)
  const inactiveCategories = categories.filter((c) => !c.active)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categorías</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categorías · {activeCategories.length} activas
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      {activeCategories.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Activas</h2>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeCategories.map((cat) => (
              <StaggerItem key={cat.id}>
                <CategoryCard
                  category={cat}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}

      {inactiveCategories.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Inactivas</h2>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {inactiveCategories.map((cat) => (
              <StaggerItem key={cat.id}>
                <CategoryCard
                  category={cat}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}

      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-muted-foreground">No hay categorías</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Creá tu primera categoría para empezar</p>
        </div>
      )}

      <CategoryForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={submitForm}
        editingCategory={editingCategory}
        isSaving={isSaving}
      />

      <CategoryDeleteDialog
        open={deleteDialogOpen}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        isDeleting={false}
        categoryName={categories.find((c) => c.id === deleteTarget)?.name}
      />
    </div>
  )
}

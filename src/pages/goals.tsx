import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useGoals,
  GoalCard,
  GoalForm,
  GoalDepositDialog,
  GoalDeleteDialog,
} from '@/features/goals'
import { StaggerContainer, StaggerItem } from '@/features/animations'

export default function GoalsPage() {
  const {
    goals,
    isLoading,
    formOpen,
    editingGoal,
    isSaving,
    depositOpen,
    isDepositing,
    deleteDialogOpen,
    isDeleting,
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
  } = useGoals()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-60 mt-1" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Objetivos</h1>
          <p className="text-sm text-muted-foreground">
            Definí y seguí tus metas financieras
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo objetivo
        </Button>
      </div>

      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <StaggerItem key={goal.id}>
            <GoalCard
              goal={goal}
              onEdit={openEdit}
              onDeposit={openDeposit}
              onDelete={openDelete}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <GoalForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={submitForm}
        editingGoal={editingGoal}
        isSaving={isSaving}
      />

      <GoalDepositDialog
        open={depositOpen}
        onClose={closeDeposit}
        onSubmit={submitDeposit}
        isDepositing={isDepositing}
      />

      <GoalDeleteDialog
        open={deleteDialogOpen}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}

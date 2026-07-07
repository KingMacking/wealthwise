import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCreditCards,
  CreditCardCard,
  CreditCardForm,
  CreditCardDeleteDialog,
} from '@/features/credit-cards'
import { StaggerContainer, StaggerItem } from '@/features/animations'

export default function CreditCardsPage() {
  const {
    cards,
    isLoading,
    formOpen,
    editingCard,
    isSaving,
    deleteDialogOpen,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    openDelete,
    closeDelete,
    confirmDelete,
  } = useCreditCards()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tarjetas de Crédito</h1>
          <p className="text-sm text-muted-foreground">
            Administra tus tarjetas y controlá tu consumo
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva tarjeta
        </Button>
      </div>

      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <StaggerItem key={card.id}>
            <CreditCardCard
              card={card}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <CreditCardForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={submitForm}
        editingCard={editingCard}
        isSaving={isSaving}
      />

      <CreditCardDeleteDialog
        open={deleteDialogOpen}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        isDeleting={false}
      />
    </div>
  )
}

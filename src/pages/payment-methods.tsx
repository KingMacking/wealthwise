import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  usePaymentMethods,
  PaymentMethodCard,
  PaymentMethodForm,
  PaymentMethodDeleteDialog,
} from '@/features/payment-methods'
import { StaggerContainer, StaggerItem } from '@/features/animations'

export default function PaymentMethodsPage() {
  const {
    methods,
    isLoading,
    formOpen,
    editingMethod,
    isSaving,
    deleteDialogOpen,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    openDelete,
    closeDelete,
    confirmDelete,
  } = usePaymentMethods()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Métodos de Pago</h1>
          <p className="text-sm text-muted-foreground">
            Administra tus formas de pago
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo método
        </Button>
      </div>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {methods.map((method) => (
          <StaggerItem key={method.id}>
            <PaymentMethodCard
              method={method}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <PaymentMethodForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={submitForm}
        editingMethod={editingMethod}
        isSaving={isSaving}
      />

      <PaymentMethodDeleteDialog
        open={deleteDialogOpen}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        isDeleting={false}
      />
    </div>
  )
}

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAccounts,
  AccountCard,
  AccountForm,
  AccountDeleteDialog,
} from '@/features/accounts'
import { StaggerContainer, StaggerItem } from '@/features/animations'

export default function AccountsPage() {
  const {
    accounts,
    isLoading,
    formOpen,
    editingAccount,
    isSaving,
    deleteDialogOpen,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    openDelete,
    closeDelete,
    confirmDelete,
  } = useAccounts()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-60 mt-1" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cuentas</h1>
          <p className="text-sm text-muted-foreground">
            Administra tus cuentas bancarias y billeteras
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva cuenta
        </Button>
      </div>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <StaggerItem key={account.id}>
            <AccountCard
              account={account}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <AccountForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={submitForm}
        editingAccount={editingAccount}
        isSaving={isSaving}
      />

      <AccountDeleteDialog
        open={deleteDialogOpen}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        isDeleting={false}
      />
    </div>
  )
}

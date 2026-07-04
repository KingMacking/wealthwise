import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle } from 'lucide-react'

interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
  count?: number
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  isDeleting,
  count = 1,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                {count === 1
                  ? '¿Estás seguro de eliminar este movimiento? Esta acción no se puede deshacer.'
                  : `¿Estás seguro de eliminar ${count} movimientos? Esta acción no se puede deshacer.`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

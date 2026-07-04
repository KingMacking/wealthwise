import { useState } from 'react'
import { useQuery, useMutation, useConvex } from 'convex/react'
import { api } from '@convex/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Download, Upload, Trash2, Database, Loader2, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

export function DataSection() {
  const convex = useConvex()
  const [clearOpen, setClearOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)

  const movementsCount = useQuery(api.movements.getAll)?.length ?? 0
  const categoriesCount = useQuery(api.categories.getAll)?.length ?? 0
  const accountsCount = useQuery(api.accounts.getAll)?.length ?? 0
  const paymentMethodsCount = useQuery(api.paymentMethods.getAll)?.length ?? 0
  const budgetsCount = useQuery(api.budgets.getAll)?.length ?? 0
  const creditCardsCount = useQuery(api.creditCards.getAll)?.length ?? 0
  const goalsCount = useQuery(api.goals.getAll)?.length ?? 0

  const importAll = useMutation(api.exportImport.importAll)
  const deleteAllMovements = useMutation(api.movements.deleteAll)
  const deleteAllCategories = useMutation(api.categories.deleteAll)
  const deleteAllAccounts = useMutation(api.accounts.deleteAll)
  const deleteAllPaymentMethods = useMutation(api.paymentMethods.deleteAll)
  const deleteAllBudgets = useMutation(api.budgets.deleteAll)
  const deleteAllCreditCards = useMutation(api.creditCards.deleteAll)
  const deleteAllGoals = useMutation(api.goals.deleteAll)

  const stats = [
    { label: 'Movimientos', count: movementsCount },
    { label: 'Categorías', count: categoriesCount },
    { label: 'Cuentas', count: accountsCount },
    { label: 'Métodos de pago', count: paymentMethodsCount },
    { label: 'Presupuestos', count: budgetsCount },
    { label: 'Tarjetas', count: creditCardsCount },
    { label: 'Objetivos', count: goalsCount },
  ]

  const totalItems = stats.reduce((s, st) => s + st.count, 0)

  const handleExportAll = async () => {
    setExporting(true)
    try {
      const result = await convex.query(api.exportImport.getAllData)

      const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...result }, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `wealthwise-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Datos exportados correctamente')
    } catch {
      toast.error('Error al exportar datos')
    }
    setExporting(false)
  }

  const handleImportAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!data.version) {
        toast.error('Formato de backup no válido')
        setImporting(false)
        return
      }

      await importAll({
        movements: data.movements ?? [],
        categories: data.categories ?? [],
        accounts: data.accounts ?? [],
        paymentMethods: data.paymentMethods ?? [],
        budgets: data.budgets ?? [],
        creditCards: data.creditCards ?? [],
        goals: data.goals ?? [],
      })

      toast.success('Datos importados correctamente')
    } catch {
      toast.error('Error al importar datos')
    }

    setImporting(false)
    e.target.value = ''
  }

  const handleClearAll = async () => {
    try {
      await Promise.all([
        deleteAllMovements(),
        deleteAllCategories(),
        deleteAllAccounts(),
        deleteAllPaymentMethods(),
        deleteAllBudgets(),
        deleteAllCreditCards(),
        deleteAllGoals(),
      ])
      setClearOpen(false)
      toast.success('Todos los datos han sido eliminados')
    } catch {
      toast.error('Error al eliminar datos')
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Datos y almacenamiento</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Administrá tus datos: exportá, importá o eliminá todo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-2 rounded-lg bg-accent/50">
                <p className="text-lg font-semibold">{s.count}</p>
                <p className="text-[10px] text-muted-foreground truncate">{s.label}</p>
              </div>
            ))}
            <div className="text-center p-2 rounded-lg bg-accent/50">
              <p className="text-lg font-semibold">{totalItems}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExportAll} disabled={exporting}>
              {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Exportar todo
            </Button>
            <Button variant="outline" size="sm" disabled={importing} onClick={() => document.getElementById('settings-import-input')?.click()}>
              {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Importar backup
            </Button>
            <input
              id="settings-import-input"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportAll}
            />
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => setClearOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar datos
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <AlertDialogTitle>Limpiar todos los datos</AlertDialogTitle>
                <AlertDialogDescription>
                  Vas a eliminar TODOS los datos de la aplicación. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll} className="bg-destructive hover:bg-destructive/90">
              Eliminar todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

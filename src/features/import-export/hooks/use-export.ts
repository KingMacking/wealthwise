import { useCallback } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import type { Movement } from '@/types'

const CSV_HEADERS = [
  'date', 'type', 'description', 'amount', 'categoryId', 'subcategoryId',
  'accountId', 'paymentMethodId', 'status', 'notes', 'tags',
]

function movementToRow(m: Movement): string[] {
  return [
    format(new Date(m.date), 'yyyy-MM-dd'),
    m.type,
    m.description,
    String(m.amount),
    m.categoryId,
    m.subcategoryId ?? '',
    m.accountId,
    m.paymentMethodId,
    m.status,
    m.notes ?? '',
    m.tags.join('; '),
  ]
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function useExport() {
  const exportCSV = useCallback((movements: Movement[]) => {
    try {
      const rows = movements.map(movementToRow)
      const csv = [CSV_HEADERS.join(','), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n')
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
      downloadBlob(blob, `movimientos-${format(new Date(), 'yyyy-MM-dd')}.csv`)
      toast.success(`${movements.length} movimientos exportados`)
    } catch {
      toast.error('Error al exportar')
    }
  }, [])

  const exportJSON = useCallback((movements: Movement[]) => {
    try {
      const data = movements.map((m) => ({
        date: format(new Date(m.date), 'yyyy-MM-dd'),
        type: m.type,
        description: m.description,
        amount: m.amount,
        categoryId: m.categoryId,
        subcategoryId: m.subcategoryId,
        accountId: m.accountId,
        paymentMethodId: m.paymentMethodId,
        status: m.status,
        notes: m.notes,
        tags: m.tags,
      }))
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      downloadBlob(blob, `movimientos-${format(new Date(), 'yyyy-MM-dd')}.json`)
      toast.success(`${movements.length} movimientos exportados`)
    } catch {
      toast.error('Error al exportar')
    }
  }, [])

  return { exportCSV, exportJSON }
}

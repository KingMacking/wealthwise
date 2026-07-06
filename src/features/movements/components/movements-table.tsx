import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpDown,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/format'
import type { Movement, Category } from '@/types'
import type { SortField } from '../hooks/use-movements'

interface MovementsTableProps {
  movements: Movement[]
  categories: Category[]
  total: number
  page: number
  pageSize: number
  isLoading: boolean
  sortField: SortField
  sortOrder: 'asc' | 'desc'
  selectedIds: string[]
  onSort: (field: SortField) => void
  onSelect: (ids: string[]) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const COLUMNS: { key?: SortField; label?: string; className?: string }[] = [
  { key: 'date', label: 'Fecha', className: 'w-[110px]' },
  { key: 'description', label: 'Descripción' },
  { key: 'categoryId', label: 'Categoría', className: 'w-[130px] hidden md:table-cell' },
  { key: 'type', label: 'Tipo', className: 'w-[100px] hidden sm:table-cell' },
  { key: 'amount', label: 'Monto', className: 'w-[120px] text-right' },
  { key: 'status', label: 'Estado', className: 'w-[110px] hidden lg:table-cell' },
  { className: 'w-[50px]' },
]

function SortIcon({ field, currentField, order }: { field: SortField; currentField: SortField; order: 'asc' | 'desc' }) {
  if (field !== currentField) return <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
  return order === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
}

export function MovementsTable({
  movements,
  categories,
  total,
  page,
  pageSize,
  isLoading,
  sortField,
  sortOrder,
  selectedIds,
  onSort,
  onSelect,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}: MovementsTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const allSelected = useMemo(() => movements.length > 0 && selectedIds.length === movements.length, [movements, selectedIds])

  const toggleAll = () => {
    if (allSelected) {
      onSelect([])
    } else {
      onSelect(movements.map((m) => m.id))
    }
  }

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter((i) => i !== id))
    } else {
      onSelect([...selectedIds, id])
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-40 flex-1" />
                <Skeleton className="h-4 w-24 hidden md:block" />
                <Skeleton className="h-4 w-16 hidden sm:block" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (movements.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ArrowUpDown className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No hay movimientos</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Probá cambiando los filtros o creá uno nuevo</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="w-[40px] px-4 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key ?? 'actions'}
                    className={`${col.className ?? ''} px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                      col.key ? 'cursor-pointer select-none hover:text-foreground transition-colors' : ''
                    }`}
                    onClick={() => col.key && onSort(col.key)}
                  >
                    {col.key && (
                      <div className="flex items-center gap-1">
                        {col.label}
                        <SortIcon field={col.key} currentField={sortField} order={sortOrder} />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {movements.map((m) => {
                const cat = categories.find((c) => c.id === m.categoryId)
                return (
                  <tr
                    key={m.id}
                    className={`transition-colors hover:bg-accent/50 ${
                      selectedIds.includes(m.id) ? 'bg-accent/30' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                        checked={selectedIds.includes(m.id)}
                        onChange={() => toggleOne(m.id)}
                      />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-sm">{formatDate(m.date, 'dd/MM')}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat?.color ?? '#3b82f6' }}
                        />
                        <div>
                          <p className="text-sm font-medium truncate">{m.description}</p>
                          {cat && (
                            <p className="text-xs text-muted-foreground md:hidden">{cat.name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat?.color ?? '#3b82f6' }}
                        />
                        <span className="text-sm text-muted-foreground">{cat?.name ?? '-'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <Badge
                        variant={m.type === 'income' ? 'success' : m.type === 'expense' ? 'destructive' : 'secondary'}
                        className="text-[10px] font-medium"
                      >
                        {m.type === 'income' ? 'Ingreso' : m.type === 'expense' ? 'Gasto' : 'Transf.'}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <p
                        className={`text-sm font-semibold ${
                          m.type === 'income'
                            ? 'text-emerald-500'
                            : m.type === 'expense'
                            ? 'text-red-500'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {m.type === 'expense' ? '-' : '+'}
                        {formatCurrency(m.amount)}
                      </p>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        {m.status === 'confirmed' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {m.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem onClick={() => onEdit(m.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(m.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {total} movimiento{total !== 1 ? 's' : ''}
            </span>
            {selectedIds.length > 0 && (
              <span className="font-medium">
                · {selectedIds.length} seleccionado{selectedIds.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              className="h-8 rounded border bg-background px-2 text-xs"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>{n} por pág</option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <span className="text-xs text-muted-foreground min-w-[60px] text-center">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

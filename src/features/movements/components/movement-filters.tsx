import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import type { MovementType, MovementStatus, Category } from '@/types'

interface MovementFiltersProps {
  search: string
  onSearchChange: (v: string) => void
  typeFilter: MovementType | 'all'
  onTypeFilterChange: (v: MovementType | 'all') => void
  statusFilter: MovementStatus | 'all'
  onStatusFilterChange: (v: MovementStatus | 'all') => void
  categoryFilter: string
  onCategoryFilterChange: (v: string) => void
  categories: Category[]
  onClear: () => void
  hasFilters: boolean
}

export function MovementFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  onClear,
  hasFilters,
}: MovementFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar movimientos..."
          className="pl-9 h-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select
        value={typeFilter}
        onValueChange={(v: MovementType | 'all') => onTypeFilterChange(v)}
      >
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="expense">Gastos</SelectItem>
          <SelectItem value="income">Ingresos</SelectItem>
          <SelectItem value="transfer">Transferencias</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={(v: MovementStatus | 'all') => onStatusFilterChange(v)}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="confirmed">Confirmado</SelectItem>
          <SelectItem value="pending">Pendiente</SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={(v: string) => onCategoryFilterChange(v)}>
        <SelectTrigger className="w-[160px] h-9">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

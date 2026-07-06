import * as LucideIcons from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[category.icon] ?? LucideIcons.Folder

  return (
    <Card className="transition-all duration-200 hover:shadow-md group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${category.color}15` }}
          >
            <Icon className="h-5 w-5" style={{ color: category.color }} />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={category.active ? 'success' : 'secondary'} className="text-[10px]">
              {category.active ? 'Activa' : 'Inactiva'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => onEdit(category.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(category.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardTitle className="text-base mt-3">{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {category.subcategories.map((sub) => (
            <Badge key={sub.id} variant="secondary" className="text-[10px] font-normal">
              {sub.name}
            </Badge>
          ))}
        </div>
        {category.monthlyBudget != null && (
          <p className="text-xs text-muted-foreground mt-3">
            Presupuesto: ${category.monthlyBudget.toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

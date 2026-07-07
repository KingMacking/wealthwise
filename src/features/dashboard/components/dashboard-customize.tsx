import { GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { STAT_CARD_DEFS, INDICATOR_DEFS, getStatCardDef, getIndicatorDef } from '../widgets'
import type { DashboardPreferences, WidgetState } from '@/hooks/useDashboardPreferences'

interface DashboardCustomizeProps {
  open: boolean
  onClose: () => void
  prefs: DashboardPreferences
  toggleWidget: (section: 'statCards' | 'indicators', id: string) => void
  reorderWidgets: (section: 'statCards' | 'indicators', widgets: WidgetState[]) => void
}

function WidgetList({
  section,
  items,
  toggleWidget,
}: {
  section: 'statCards' | 'indicators'
  items: WidgetState[]
  toggleWidget: (section: 'statCards' | 'indicators', id: string) => void
}) {
  const sectionTitle = section === 'statCards' ? 'Tarjetas de resumen' : 'Indicadores'

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">{sectionTitle}</h4>
      <Droppable droppableId={section}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-1">
            {items.map((widget, index) => {
              const def = section === 'statCards'
                ? getStatCardDef(widget.id)
                : getIndicatorDef(widget.id)
              if (!def) return null

              return (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-2 rounded-md px-2 py-2 transition-colors ${
                        snapshot.isDragging ? 'bg-accent shadow-sm' : 'hover:bg-accent/50'
                      }`}
                    >
                      <span
                        {...provided.dragHandleProps}
                        className="flex items-center justify-center w-6 h-6 text-muted-foreground cursor-grab active:cursor-grabbing shrink-0"
                      >
                        <GripVertical className="h-4 w-4" />
                      </span>
                      <def.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-sm">{def.label}</span>
                      <Switch
                        checked={widget.enabled}
                        onCheckedChange={() => toggleWidget(section, widget.id)}
                      />
                    </div>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export function DashboardCustomize({ open, onClose, prefs, toggleWidget, reorderWidgets }: DashboardCustomizeProps) {
  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    if (result.source.index === result.destination.index) return

    const section = result.destination.droppableId as 'statCards' | 'indicators'
    const items = Array.from(prefs[section])
    const [removed] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, removed)
    reorderWidgets(section, items)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personalizar dashboard</DialogTitle>
          <DialogDescription>
            Arrastrá para reordenar. Usá los switches para mostrar u ocultar cada elemento.
          </DialogDescription>
        </DialogHeader>

        <DragDropContext onDragEnd={handleDragEnd}>
          <WidgetList section="statCards" items={prefs.statCards} toggleWidget={toggleWidget} />
          <Separator className="my-4" />
          <WidgetList section="indicators" items={prefs.indicators} toggleWidget={toggleWidget} />
        </DragDropContext>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import type { CreateMovementDTO } from '@/types'

interface ImportResult {
  success: number
  errors: string[]
}

interface ImportDialogProps {
  open: boolean
  onClose: () => void
  onImport: (movements: CreateMovementDTO[]) => Promise<ImportResult>
}

export function ImportDialog({ open, onClose, onImport }: ImportDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFile = async (file: File) => {
    setIsProcessing(true)
    setResult(null)

    try {
      const text = await file.text()
      let dtos: CreateMovementDTO[] = []

      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text)
        dtos = (Array.isArray(data) ? data : [data]).map(normalizeMovement)
      } else if (file.name.endsWith('.csv')) {
        dtos = parseCSV(text)
      } else {
        setResult({ success: 0, errors: ['Formato no soportado. Usá CSV o JSON.'] })
        setIsProcessing(false)
        return
      }

      if (dtos.length === 0) {
        setResult({ success: 0, errors: ['No se encontraron movimientos válidos en el archivo.'] })
        setIsProcessing(false)
        return
      }

      const r = await onImport(dtos)
      setResult(r)
    } catch {
      setResult({ success: 0, errors: ['Error al leer el archivo. Verificá el formato.'] })
    }

    setIsProcessing(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleReset = () => {
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          handleReset()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Importar movimientos</DialogTitle>
          <DialogDescription>
            Subí un archivo CSV o JSON con movimientos para importar
          </DialogDescription>
        </DialogHeader>

        {!result && !isProcessing && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed cursor-pointer hover:border-primary hover:bg-accent/30 transition-colors"
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Hacé clic o arrastrá un archivo</p>
            <p className="text-xs text-muted-foreground mt-1">CSV o JSON</p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </div>
        )}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Procesando archivo...</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
              {result.errors.length === 0 ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              ) : (
                <AlertCircle className="h-8 w-8 text-amber-500" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {result.success} movimientos importados
                </p>
                {result.errors.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {result.errors.length} errores
                  </p>
                )}
              </div>
            </div>

            {result.errors.length > 0 && (
              <ScrollArea className="max-h-[200px] rounded-lg border">
                <div className="p-3 space-y-1">
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-xs text-red-500 flex items-start gap-1">
                      <span>•</span>
                      <span>{err}</span>
                    </p>
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleReset}>
                Importar otro
              </Button>
              <Button onClick={onClose}>Cerrar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function normalizeMovement(item: Record<string, unknown>): CreateMovementDTO {
  return {
    date: String(item.date ?? new Date().toISOString().split('T')[0]),
    type: (item.type as CreateMovementDTO['type']) ?? 'expense',
    description: String(item.description ?? 'Importado'),
    amount: Number(item.amount) || 0,
    categoryId: String(item.categoryId ?? ''),
    subcategoryId: item.subcategoryId ? String(item.subcategoryId) : undefined,
    accountId: String(item.accountId ?? ''),
    paymentMethodId: String(item.paymentMethodId ?? ''),
    status: (item.status as CreateMovementDTO['status']) ?? 'confirmed',
    notes: item.notes ? String(item.notes) : undefined,
    tags: Array.isArray(item.tags) ? item.tags.map(String) : item.tags ? String(item.tags).split(';').map((t) => t.trim()) : undefined,
  }
}

function parseCSV(text: string): CreateMovementDTO[] {
  const lines = text.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  const results: CreateMovementDTO[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? ''
    })

    results.push({
      date: row.date || new Date().toISOString().split('T')[0],
      type: (row.type as CreateMovementDTO['type']) || 'expense',
      description: row.description || 'Importado',
      amount: Number(row.amount) || 0,
      categoryId: row.categoryId || '',
      subcategoryId: row.subcategoryId || undefined,
      accountId: row.accountId || '',
      paymentMethodId: row.paymentMethodId || '',
      status: (row.status as CreateMovementDTO['status']) || 'confirmed',
      notes: row.notes || undefined,
      tags: row.tags ? row.tags.split(';').map((t) => t.trim()) : undefined,
    })
  }

  return results
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  values.push(current.trim())
  return values
}

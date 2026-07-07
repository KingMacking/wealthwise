'use client'

const PRESETS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#d946ef', '#ec4899', '#64748b', '#78716c', '#1e293b',
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-lg border shadow-sm shrink-0"
          style={{ backgroundColor: value }}
        />
        <div className="flex-1 relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex h-9 w-full items-center rounded-md border bg-background px-3 text-sm text-muted-foreground pointer-events-none">
            {value}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            className={`h-6 w-6 rounded-full transition-all duration-200 ${
              value === color
                ? 'ring-2 ring-offset-1 ring-offset-background scale-110'
                : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  )
}

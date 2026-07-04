import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface YearSelectorProps {
  year: number
  onPrev: () => void
  onNext: () => void
}

export function YearSelector({ year, onPrev, onNext }: YearSelectorProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={onPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[80px] text-center">{year}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onNext}
        disabled={year >= currentYear}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

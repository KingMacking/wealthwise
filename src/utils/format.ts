import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date, pattern: string = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: es })
}

export function formatDateShort(date: string | Date): string {
  return formatDate(date, 'dd MMM')
}

export function formatMonthYear(date: string | Date): string {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMMM yyyy', { locale: es })
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(2)
}

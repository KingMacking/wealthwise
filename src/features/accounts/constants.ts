import { Banknote, Landmark, PiggyBank, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AccountType } from '@/types'

export const ACCOUNT_TYPE_ICONS: Record<AccountType, LucideIcon> = {
  cash: Banknote,
  checking: Landmark,
  savings: PiggyBank,
  investment: Wallet,
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: 'Efectivo',
  checking: 'Cuenta Corriente',
  savings: 'Caja de Ahorro',
  investment: 'Inversión',
}

export const ACCOUNT_TYPES = [
  { value: 'cash' as AccountType, label: 'Efectivo' },
  { value: 'checking' as AccountType, label: 'Cuenta Corriente' },
  { value: 'savings' as AccountType, label: 'Caja de Ahorro' },
  { value: 'investment' as AccountType, label: 'Inversión' },
]

export const ACCOUNT_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b', '#78716c', '#1e293b',
]

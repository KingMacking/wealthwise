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



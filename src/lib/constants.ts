export const APP_NAME = 'WealthWise'
export const APP_DESCRIPTION = 'Control financiero personal'
export const DEFAULT_CURRENCY = 'ARS'
export const DEFAULT_LOCALE = 'es-AR'
export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy'

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Movimientos', href: '/movements', icon: 'ArrowLeftRight' },
  { label: 'Categorías', href: '/categories', icon: 'Tags' },
  { label: 'Presupuestos', href: '/budgets', icon: 'Wallet' },
  { label: 'Cuentas', href: '/accounts', icon: 'Landmark' },
  { label: 'Tarjetas', href: '/credit-cards', icon: 'CreditCard' },
  { label: 'Objetivos', href: '/goals', icon: 'Target' },
  { label: 'Reportes', href: '/reports', icon: 'BarChart3' },
  { label: 'Calendario', href: '/calendar', icon: 'Calendar' },
  { label: 'Configuración', href: '/settings', icon: 'Settings' },
] as const

export const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
  '#84cc16', '#e11d48', '#0ea5e9', '#a855f7', '#d946ef',
] as const

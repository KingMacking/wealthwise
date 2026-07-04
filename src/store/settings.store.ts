import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const CURRENCIES = [
  { code: 'ARS', symbol: '$', name: 'Peso Argentino' },
  { code: 'USD', symbol: 'US$', name: 'Dólar Estadounidense' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileño' },
  { code: 'CLP', symbol: 'CLP$', name: 'Peso Chileno' },
  { code: 'UYU', symbol: '$U', name: 'Peso Uruguayo' },
  { code: 'MXN', symbol: 'MX$', name: 'Peso Mexicano' },
  { code: 'COP', symbol: 'COL$', name: 'Peso Colombiano' },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]['code']
export type Locale = 'es-AR' | 'es-ES' | 'en-US' | 'pt-BR'

interface SettingsState {
  currency: CurrencyCode
  locale: Locale
  setCurrency: (currency: CurrencyCode) => void
  setLocale: (locale: Locale) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'ARS',
      locale: 'es-AR',

      setCurrency: (currency: CurrencyCode) => set({ currency }),
      setLocale: (locale: Locale) => set({ locale }),
    }),
    { name: 'wealthwise-settings' }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  initTheme: () => void
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', resolved === 'dark' ? '#0a0a0b' : '#ffffff')
  }
}

const STORAGE_KEY = 'wealthwise-theme'

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolved: 'light',

      setTheme: (theme: Theme) => {
        const resolved = theme === 'system' ? getSystemTheme() : theme
        applyTheme(resolved)
        set({ theme, resolved })
      },

      initTheme: () => {
        const { theme } = get()
        const resolved = theme === 'system' ? getSystemTheme() : theme
        applyTheme(resolved)
        set({ resolved })

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', () => {
          const state = get()
          if (state.theme === 'system') {
            const newResolved = getSystemTheme()
            applyTheme(newResolved)
            set({ resolved: newResolved })
          }
        })
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme.store'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const initTheme = useThemeStore((s) => s.initTheme)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return <>{children}</>
}

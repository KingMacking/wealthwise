import { useState, useCallback, useEffect } from 'react'

export type DashboardSection = 'statsCards' | 'indicators' | 'charts' | 'recentMovements'

export interface DashboardPreferences {
  statsCards: boolean
  indicators: boolean
  charts: boolean
  recentMovements: boolean
}

const STORAGE_KEY = 'wealthwise-dashboard-preferences'

const defaults: DashboardPreferences = {
  statsCards: true,
  indicators: true,
  charts: true,
  recentMovements: true,
}

function loadPreferences(): DashboardPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaults, ...parsed }
    }
  } catch {}
  return defaults
}

export function useDashboardPreferences() {
  const [prefs, setPrefs] = useState<DashboardPreferences>(loadPreferences)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  }, [prefs])

  const toggle = useCallback((section: DashboardSection) => {
    setPrefs((prev) => ({ ...prev, [section]: !prev[section] }))
  }, [])

  const visibleCount = Object.values(prefs).filter(Boolean).length
  const allHidden = visibleCount === 0

  return { prefs, toggle, visibleCount, allHidden }
}

import { useState, useCallback, useEffect } from 'react'
import { STAT_CARD_IDS, INDICATOR_IDS } from '@/features/dashboard/widgets'

export type DashboardSection = 'charts' | 'recentMovements'

export interface WidgetState {
  id: string
  enabled: boolean
}

export interface DashboardPreferences {
  statCards: WidgetState[]
  indicators: WidgetState[]
  charts: boolean
  recentMovements: boolean
}

const STORAGE_KEY = 'wealthwise-dashboard-preferences'

function buildDefaultWidgets(ids: string[], enabled: boolean): WidgetState[] {
  return ids.map((id) => ({ id, enabled }))
}

function getDefaults(): DashboardPreferences {
  return {
    statCards: buildDefaultWidgets(STAT_CARD_IDS, true),
    indicators: buildDefaultWidgets(INDICATOR_IDS, true),
    charts: true,
    recentMovements: true,
  }
}

function isOldFormat(value: unknown): boolean {
  return typeof value === 'boolean'
}

function loadPreferences(): DashboardPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaults()

    const parsed = JSON.parse(raw)

    if (isOldFormat(parsed.statsCards)) {
      const statCards = buildDefaultWidgets(STAT_CARD_IDS, parsed.statsCards as boolean)
      const indicators = buildDefaultWidgets(INDICATOR_IDS, parsed.indicators as boolean)
      return {
        statCards,
        indicators,
        charts: parsed.charts ?? true,
        recentMovements: parsed.recentMovements ?? true,
      }
    }

    if (Array.isArray(parsed.statCards) && Array.isArray(parsed.indicators)) {
      return parsed as DashboardPreferences
    }

    return getDefaults()
  } catch {
    return getDefaults()
  }
}

export function useDashboardPreferences() {
  const [prefs, setPrefs] = useState<DashboardPreferences>(loadPreferences)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  }, [prefs])

  const toggleSection = useCallback((section: DashboardSection) => {
    setPrefs((prev) => ({ ...prev, [section]: !prev[section] }))
  }, [])

  const toggleWidget = useCallback((section: 'statCards' | 'indicators', id: string) => {
    setPrefs((prev) => ({
      ...prev,
      [section]: prev[section].map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)),
    }))
  }, [])

  const reorderWidgets = useCallback((section: 'statCards' | 'indicators', widgets: WidgetState[]) => {
    setPrefs((prev) => ({ ...prev, [section]: widgets }))
  }, [])

  return { prefs, toggleSection, toggleWidget, reorderWidgets }
}

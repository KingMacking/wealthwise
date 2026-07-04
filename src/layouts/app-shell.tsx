import { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { useMediaQuery } from '@/hooks/use-media-query'
import { CommandPalette } from '@/features/command-palette'
import { PageTransition, ScrollToTop } from '@/features/animations'

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (isDesktop) setSidebarOpen(false)
  }, [isDesktop])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleSearchClick = useCallback(() => setCommandOpen(true), [])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          onSearchClick={handleSearchClick}
        />
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <ScrollToTop />
    </div>
  )
}

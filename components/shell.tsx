'use client'

import { AppHeader } from '@/components/app-header'
import { Sidebar } from '@/components/sidebar'
import { useTheme } from '@/components/theme-provider'
import type { UserProfile } from '@/lib/api'
import { getUserProfile } from '@/lib/api'
import { useEffect, useState } from 'react'

interface ShellProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function Shell({ title, subtitle, children }: ShellProps) {
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    getUserProfile().then(setUser).catch(() => setUser(null))
  }, [])

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar user={user} />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full shadow-2xl">
            <Sidebar user={user} onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          title={title}
          subtitle={subtitle}
          onMenuOpen={() => setDrawerOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

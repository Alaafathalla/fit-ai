'use client'

import { Logo } from '@/components/logo'
import { NAV_ITEMS } from '@/components/sidebar'
import type { Theme } from '@/components/theme-provider'
import { Bell, Command, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

interface AppHeaderProps {
  title: string
  subtitle?: string
  onMenuOpen: () => void
  theme: Theme
  onToggleTheme: () => void
}

const notifications = [
  { title: 'Recovery check-in', body: 'Review sleep and hydration before your next hard session.', href: '/recovery' },
  { title: 'Weekly progress', body: 'Your latest training and activity trends are ready.', href: '/progress' },
  { title: 'Plan your week', body: 'Build a balanced schedule with training and recovery days.', href: '/planner' },
]

export function AppHeader({ title, subtitle, onMenuOpen, theme, onToggleTheme }: AppHeaderProps) {
  const router = useRouter()
  const searchInput = useRef<HTMLInputElement>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hasUnread, setHasUnread] = useState(true)

  useEffect(() => {
    setHasUnread(localStorage.getItem('fitai-notifications-seen') !== 'v1')
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setNotificationsOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    const timer = window.setTimeout(() => searchInput.current?.focus(), 40)
    return () => window.clearTimeout(timer)
  }, [searchOpen])

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return NAV_ITEMS
    return NAV_ITEMS.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(normalized))
  }, [query])

  const goTo = (href: string) => {
    setSearchOpen(false)
    setNotificationsOpen(false)
    setQuery('')
    router.push(href)
  }

  return (
    <>
      <header
        className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between px-5 sm:px-8"
        style={{
          background: 'color-mix(in srgb, var(--header) 92%, transparent)',
          borderBottom: '1px solid var(--header-border)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div className="flex items-center gap-4">
          <button className="btn-ghost lg:hidden" onClick={onMenuOpen} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div className="lg:hidden"><Logo /></div>

          {subtitle ? (
            <div className="hidden lg:block">
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{subtitle}</p>
              <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>{title}</h1>
            </div>
          ) : (
            <h1 className="hidden text-xl font-semibold tracking-tight lg:block" style={{ color: 'var(--foreground)' }}>
              {title}
            </h1>
          )}
        </div>

        <div className="relative flex items-center gap-1">
          <button
            className="btn-ghost hidden items-center gap-2 sm:flex"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-[18px]" />
            <span className="hidden text-xs xl:inline" style={{ color: 'var(--foreground-muted)' }}>Search</span>
            <kbd
              className="hidden items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] xl:flex"
              style={{ background: 'var(--background-alt)', border: '1px solid var(--border)' }}
            >
              <Command className="size-2.5" />K
            </kbd>
          </button>
          <button className="btn-ghost sm:hidden" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="size-[18px]" />
          </button>

          <button className="btn-ghost" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>

          <button
            className="btn-ghost relative"
            aria-label="Notifications"
            onClick={() => {
              setNotificationsOpen((open) => !open)
              setHasUnread(false)
              localStorage.setItem('fitai-notifications-seen', 'v1')
            }}
          >
            <Bell className="size-[18px]" />
            {hasUnread && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full" style={{ background: 'var(--danger)' }} />}
          </button>

          {notificationsOpen && (
            <div
              className="animate-scale-in absolute right-0 top-12 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl p-2 shadow-xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between px-3 py-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Notifications</p>
                  <p className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>Training reminders & insights</p>
                </div>
                <button className="btn-ghost" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications">
                  <X className="size-4" />
                </button>
              </div>
              {notifications.map((item) => (
                <button
                  key={item.title}
                  onClick={() => goTo(item.href)}
                  className="w-full rounded-xl px-3 py-3 text-left transition-colors hover:bg-[var(--background-alt)]"
                >
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{item.body}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          style={{ background: 'rgba(4, 8, 18, 0.48)', backdropFilter: 'blur(4px)' }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSearchOpen(false)
          }}
        >
          <div
            className="animate-scale-in w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <Search className="size-5" style={{ color: 'var(--foreground-muted)' }} />
              <input
                ref={searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, workouts, nutrition, recovery…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--foreground)' }}
              />
              <button className="btn-ghost" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  No matching page found.
                </div>
              ) : results.map(({ label, href, icon: Icon }) => (
                <button
                  key={href}
                  onClick={() => goTo(href)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-[var(--background-alt)]"
                >
                  <span className="grid size-9 place-items-center rounded-lg" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

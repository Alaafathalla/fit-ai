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
  { title: 'Recovery check-in', body: 'Review sleep and hydration before your next hard session.', href: '/recovery', color: 'var(--success)' },
  { title: 'Weekly progress ready', body: 'Your latest training trends and metrics are available.', href: '/progress', color: 'var(--primary)' },
  { title: 'Plan your week', body: 'Build a balanced schedule with training and recovery days.', href: '/planner', color: 'var(--accent)' },
]

export function AppHeader({ title, subtitle, onMenuOpen, theme, onToggleTheme }: AppHeaderProps) {
  const router = useRouter()
  const searchInput = useRef<HTMLInputElement>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hasUnread, setHasUnread] = useState(true)

  useEffect(() => {
    setHasUnread(localStorage.getItem('fitai-notifications-seen') !== 'v2')
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setSearchOpen(true)
      }
      if (e.key === 'Escape') { setSearchOpen(false); setNotificationsOpen(false) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    const t = window.setTimeout(() => searchInput.current?.focus(), 40)
    return () => window.clearTimeout(t)
  }, [searchOpen])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return NAV_ITEMS
    return NAV_ITEMS.filter((item) =>
      `${item.label} ${item.keywords}`.toLowerCase().includes(q),
    )
  }, [query])

  const goTo = (href: string) => {
    setSearchOpen(false); setNotificationsOpen(false); setQuery('')
    router.push(href)
  }

  return (
    <>
      <header
        className="sticky top-0 z-30 flex h-[68px] shrink-0 items-center justify-between px-5 sm:px-7"
        style={{
          background: 'var(--header)',
          borderBottom: '1px solid var(--header-border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <button className="btn-ghost lg:hidden" onClick={onMenuOpen} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div className="lg:hidden"><Logo /></div>

          {subtitle ? (
            <div className="hidden lg:block">
              <p className="text-[11px] font-medium" style={{ color: 'var(--foreground-muted)' }}>{subtitle}</p>
              <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>{title}</h1>
            </div>
          ) : (
            <h1 className="hidden text-lg font-bold tracking-tight lg:block" style={{ color: 'var(--foreground)' }}>
              {title}
            </h1>
          )}
        </div>

        {/* Right */}
        <div className="relative flex items-center gap-0.5">
          {/* Search */}
          <button
            className="btn-ghost hidden items-center gap-2 rounded-xl px-3 py-2 sm:flex"
            style={{ border: '1px solid var(--border)', background: 'var(--card)' }}
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" style={{ color: 'var(--foreground-muted)' }} />
            <span className="hidden text-xs xl:inline" style={{ color: 'var(--foreground-muted)' }}>Search…</span>
            <kbd
              className="hidden items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium xl:flex"
              style={{ background: 'var(--background-alt)', color: 'var(--foreground-muted)' }}
            >
              <Command className="size-2.5" />K
            </kbd>
          </button>
          <button className="btn-ghost sm:hidden" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="size-[18px]" />
          </button>

          {/* Theme toggle */}
          <button
            className="btn-ghost"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark'
              ? <Sun className="size-[18px]" />
              : <Moon className="size-[18px]" />}
          </button>

          {/* Notifications */}
          <button
            className="btn-ghost relative"
            aria-label="Notifications"
            onClick={() => {
              setNotificationsOpen((o) => !o)
              setHasUnread(false)
              localStorage.setItem('fitai-notifications-seen', 'v2')
            }}
          >
            <Bell className="size-[18px]" />
            {hasUnread && (
              <span
                className="absolute right-1.5 top-1.5 size-2 rounded-full border-2"
                style={{ background: 'var(--danger)', borderColor: 'var(--header)' }}
              />
            )}
          </button>

          {notificationsOpen && (
            <div
              className="animate-scale-in absolute right-0 top-12 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-2xl shadow-2xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', zIndex: 50 }}
            >
              <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Notifications</p>
                  <p className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>Training reminders & insights</p>
                </div>
                <button className="btn-ghost" onClick={() => setNotificationsOpen(false)} aria-label="Close">
                  <X className="size-4" />
                </button>
              </div>
              <div className="p-2">
                {notifications.map((item, i) => (
                  <button
                    key={item.title}
                    onClick={() => goTo(item.href)}
                    className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-[var(--background-alt)]"
                  >
                    <span
                      className="mt-0.5 size-2 shrink-0 rounded-full"
                      style={{ background: item.color, marginTop: 6 }}
                    />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{item.body}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]"
          style={{ background: 'rgba(4, 8, 20, 0.6)', backdropFilter: 'blur(6px)' }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) setSearchOpen(false) }}
        >
          <div
            className="animate-scale-in w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {/* Input row */}
            <div
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <Search className="size-5 shrink-0" style={{ color: 'var(--foreground-muted)' }} />
              <input
                ref={searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--foreground)' }}
              />
              <button className="btn-ghost" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X className="size-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[55vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  No pages match "<strong>{query}</strong>"
                </div>
              ) : (
                <>
                  <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--foreground-muted)' }}>
                    Pages
                  </p>
                  {results.map(({ label, href, icon: Icon }) => (
                    <button
                      key={href}
                      onClick={() => goTo(href)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--background-alt)]"
                    >
                      <span
                        className="icon-box size-9 shrink-0"
                        style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{label}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

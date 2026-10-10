'use client'

import { Logo } from '@/components/logo'
import { getNavItemsForRole, type NavItem } from '@/components/sidebar'
import type { UserProfile } from '@/lib/api'
import { logout, type AuthRole } from '@/lib/auth'
import {
  Bell,
  Bot,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  Command,
  Dumbbell,
  HeartPulse,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  UserCheck,
  Utensils,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

interface AppHeaderProps {
  title: string
  subtitle?: string
  onMenuOpen: () => void
  role?: AuthRole
  user?: UserProfile | null
}

interface NotificationItem {
  id: string
  title: string
  body: string
  href: string
  category: 'Training' | 'Nutrition' | 'Recovery'
  time: string
  unread: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Recovery check-in',
    body: 'Review sleep and hydration readiness before your next hard session.',
    href: '/recovery',
    category: 'Recovery',
    time: '12m ago',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Weekly progress ready',
    body: 'Your latest bodyweight and training consistency trends are updated.',
    href: '/progress',
    category: 'Training',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Plan your upcoming week',
    body: 'Build a balanced schedule with workouts and designated recovery days.',
    href: '/planner',
    category: 'Training',
    time: '3h ago',
    unread: true,
  },
]

export function AppHeader({ title, subtitle, onMenuOpen, role, user }: AppHeaderProps) {
  const router = useRouter()
  const searchInput = useRef<HTMLInputElement>(null)

  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [actionsOpen, setActionsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications])

  // Global keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotificationsOpen(false)
        setActionsOpen(false)
        setProfileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Auto-focus search input
  useEffect(() => {
    if (!searchOpen) return
    const t = window.setTimeout(() => searchInput.current?.focus(), 40)
    return () => window.clearTimeout(t)
  }, [searchOpen])

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-popover]')) {
        setNotificationsOpen(false)
        setActionsOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const navItems: NavItem[] = useMemo(() => getNavItemsForRole(role), [role])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return navItems
    return navItems.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(q))
  }, [query, navItems])

  const goTo = (href: string) => {
    setSearchOpen(false)
    setNotificationsOpen(false)
    setActionsOpen(false)
    setProfileOpen(false)
    setQuery('')
    router.push(href)
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const markItemRead = (id: string, href: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
    goTo(href)
  }

  const handleSignOut = () => {
    logout()
    router.replace('/auth/login')
  }

  const handleSwitchWorkspace = () => {
    if (role === 'COACH') {
      router.push('/dashboard')
    } else {
      router.push('/coach-portal')
    }
    setProfileOpen(false)
  }

  return (
    <>
      <header
        className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between px-4 sm:px-8"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        {/* Left Section */}
        <div className="flex items-center gap-3.5">
          <button
            className="btn-ghost lg:hidden -ml-1.5 p-2 rounded-xl text-foreground hover:bg-background-alt"
            onClick={onMenuOpen}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </button>

          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="hidden lg:block">
            {subtitle ? (
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{subtitle}</p>
                  {role === 'COACH' ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 border border-slate-200">
                      Coach Workspace
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      <span className="size-1.5 rounded-full bg-emerald-500" /> Athlete Mode
                    </span>
                  )}
                </div>
                <h1 className="mt-0.5 text-lg font-black tracking-tight text-foreground">{title}</h1>
              </div>
            ) : (
              <h1 className="text-lg font-black tracking-tight text-foreground">{title}</h1>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="relative flex items-center gap-2 sm:gap-3" data-popover>
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground-muted shadow-xs transition hover:border-primary/40 hover:bg-background-alt hover:text-foreground"
            aria-label="Search"
          >
            <Search className="size-4 text-foreground-muted" />
            <span className="hidden sm:inline">Search anything…</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border bg-background-alt px-1.5 py-0.5 text-[10px] font-bold text-foreground-muted">
              <Command className="size-2.5" />K
            </kbd>
          </button>

          {/* Quick Action Button */}
          <div className="relative">
            <button
              onClick={() => {
                setActionsOpen((prev) => !prev)
                setNotificationsOpen(false)
                setProfileOpen(false)
              }}
              className="btn-primary !h-9 !px-3 sm:!px-3.5 !text-xs !font-bold flex items-center gap-1.5 shadow-sm"
              aria-label="Quick Actions"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">Action</span>
            </button>

            {actionsOpen && (
              <div
                className="animate-scale-in absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-2xl"
                style={{ background: 'var(--card)' }}
              >
                <div className="px-3 py-2 border-b border-border/70">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">Quick Actions</p>
                </div>
                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => goTo('/workouts')}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-foreground transition hover:bg-background-alt"
                  >
                    <span className="grid size-7 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Dumbbell className="size-4" />
                    </span>
                    <div>
                      <p className="font-bold">Start Workout</p>
                      <p className="text-[10px] text-foreground-muted">Explore & log training session</p>
                    </div>
                  </button>

                  <button
                    onClick={() => goTo('/nutrition')}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-foreground transition hover:bg-background-alt"
                  >
                    <span className="grid size-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
                      <Utensils className="size-4" />
                    </span>
                    <div>
                      <p className="font-bold">Log Meal</p>
                      <p className="text-[10px] text-foreground-muted">Track calories & macros</p>
                    </div>
                  </button>

                  <button
                    onClick={() => goTo('/recovery')}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-foreground transition hover:bg-background-alt"
                  >
                    <span className="grid size-7 place-items-center rounded-lg bg-cyan-50 text-cyan-600">
                      <HeartPulse className="size-4" />
                    </span>
                    <div>
                      <p className="font-bold">Track Hydration & Sleep</p>
                      <p className="text-[10px] text-foreground-muted">Check readiness indicators</p>
                    </div>
                  </button>

                  <button
                    onClick={() => goTo('/coach')}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-foreground transition hover:bg-background-alt"
                  >
                    <span className="grid size-7 place-items-center rounded-lg bg-slate-100 text-slate-800">
                      <Bot className="size-4" />
                    </span>
                    <div>
                      <p className="font-bold">Training Advisor</p>
                      <p className="text-[10px] text-foreground-muted">Consult personalized programming</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen((prev) => !prev)
                setActionsOpen(false)
                setProfileOpen(false)
              }}
              className="relative grid size-9 place-items-center rounded-xl border border-border bg-card text-foreground-muted transition hover:border-primary/40 hover:bg-background-alt hover:text-foreground shadow-xs"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-danger text-[9px] font-black text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div
                className="animate-scale-in absolute right-0 top-12 z-50 w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                style={{ background: 'var(--card)' }}
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                    >
                      <CheckCheck className="size-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[380px] divide-y divide-border/60 overflow-y-auto p-1.5">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <div className="mx-auto grid size-10 place-items-center rounded-full bg-success-light text-success mb-2">
                        <Check className="size-5" />
                      </div>
                      <p className="text-xs font-bold text-foreground">You are all caught up!</p>
                      <p className="text-[11px] text-foreground-muted mt-0.5">No unread alerts at this time.</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => markItemRead(item.id, item.href)}
                        className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                          item.unread ? 'bg-primary-light/40 hover:bg-primary-light/70' : 'hover:bg-background-alt'
                        }`}
                      >
                        <span
                          className={`mt-1 size-2 shrink-0 rounded-full ${
                            item.unread ? 'bg-primary' : 'bg-foreground-muted/40'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-foreground truncate">{item.title}</p>
                            <span className="text-[10px] text-foreground-muted shrink-0">{item.time}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-foreground-muted line-clamp-2">
                            {item.body}
                          </p>
                          <span className="mt-1.5 inline-block rounded-md bg-background-alt px-1.5 py-0.5 text-[9px] font-bold text-foreground-muted">
                            {item.category}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen((prev) => !prev)
                  setNotificationsOpen(false)
                  setActionsOpen(false)
                }}
                className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-background-alt"
                aria-label="User profile menu"
              >
                <div
                  className="relative grid size-8 place-items-center rounded-xl text-xs font-black text-white shadow-xs"
                  style={{ background: 'var(--gradient-hero)' }}
                >
                  {user.avatarInitials}
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div className="hidden text-left xl:block">
                  <p className="max-w-[100px] truncate text-xs font-bold text-foreground leading-tight">{user.name}</p>
                  <p className="text-[10px] font-semibold text-foreground-muted">
                    {role === 'COACH' ? 'Coach' : 'Athlete'}
                  </p>
                </div>
                <ChevronDown className="hidden size-3.5 text-foreground-muted xl:block" />
              </button>

              {profileOpen && (
                <div
                  className="animate-scale-in absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-2xl"
                  style={{ background: 'var(--card)' }}
                >
                  <div className="rounded-xl bg-background-alt/80 p-3">
                    <p className="text-xs font-bold text-foreground">{user.name}</p>
                    <p className="text-[11px] text-foreground-muted truncate">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between border-t border-border/80 pt-2 text-[10px]">
                      <span className="font-semibold text-foreground-muted">Current Role</span>
                      <span className="rounded-md bg-primary-light px-2 py-0.5 font-bold text-primary">
                        {role === 'COACH' ? 'Coach' : 'Athlete'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 space-y-0.5">
                    <button
                      onClick={handleSwitchWorkspace}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-foreground transition hover:bg-background-alt"
                    >
                      <UserCheck className="size-4 text-primary" />
                      <span>{role === 'COACH' ? 'Switch to Athlete Dashboard' : 'Open Coach Workspace'}</span>
                    </button>

                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-foreground transition hover:bg-background-alt"
                    >
                      <Settings className="size-4 text-foreground-muted" />
                      <span>Account Settings</span>
                    </Link>

                    <Link
                      href="/coach"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-foreground transition hover:bg-background-alt"
                    >
                      <Bot className="size-4 text-foreground-muted" />
                      <span>AI Coach Assistant</span>
                    </Link>

                    <div className="my-1 border-t border-border/70" />

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-danger transition hover:bg-danger-light"
                    >
                      <LogOut className="size-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Global Command Palette / Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]"
          style={{ background: 'rgba(10,15,30,0.5)', backdropFilter: 'blur(8px)' }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false)
          }}
        >
          <div
            className="animate-scale-in w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            style={{ background: 'var(--card)' }}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search className="size-5 shrink-0 text-primary" />
              <input
                ref={searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search pages, workouts, or tools…"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none"
              />
              <button
                className="btn-ghost !p-1 text-foreground-muted hover:text-foreground"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-foreground-muted">
                  No matching results for "<strong>{query}</strong>"
                </div>
              ) : (
                <>
                  <div className="px-3 pb-1 pt-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                    <span>Navigation & Tools</span>
                    <span>{results.length} results</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {results.map(({ label, href, icon: Icon }) => (
                      <button
                        key={href}
                        onClick={() => goTo(href)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-background-alt group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid size-8 place-items-center rounded-lg bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition">
                            <Icon className="size-4" />
                          </span>
                          <span className="text-xs font-bold text-foreground">{label}</span>
                        </div>
                        <span className="text-[10px] text-foreground-muted font-mono">{href}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border bg-background-alt/50 px-4 py-2 text-[11px] text-foreground-muted">
              <span>FitAI Command Palette</span>
              <span>Press ESC to exit</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

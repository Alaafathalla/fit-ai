'use client'

import { Logo } from '@/components/logo'
import type { UserProfile } from '@/lib/api'
import {
  Activity,
  Bot,
  CalendarDays,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Utensils,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, keywords: 'home overview stats' },
      { label: 'Planner',   href: '/planner',   icon: CalendarDays,    keywords: 'week schedule routine plan' },
    ],
  },
  {
    label: 'Training',
    items: [
      { label: 'Workouts',   href: '/workouts',   icon: Dumbbell,   keywords: 'exercise strength cardio hiit mobility' },
      { label: 'Nutrition',  href: '/nutrition',  icon: Utensils,   keywords: 'meals calories macros food hydration' },
      { label: 'Recovery',   href: '/recovery',   icon: HeartPulse, keywords: 'sleep readiness hydration rest' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Progress',  href: '/progress',  icon: TrendingUp, keywords: 'charts weight metrics performance' },
      { label: 'Activity',  href: '/activity',  icon: Activity,   keywords: 'history timeline sessions meals' },
      { label: 'AI Coach',  href: '/coach',     icon: Bot,        keywords: 'assistant advice coach ai help' },
    ],
  },
] as const

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items)

interface SidebarProps {
  user: UserProfile | null
  onClose?: () => void
}

export function Sidebar({ user, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="flex h-full w-[260px] flex-col"
      style={{ background: 'var(--sidebar)', borderRight: '1px solid var(--sidebar-border)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5">
        <Logo />
        {onClose && (
          <button onClick={onClose} className="btn-ghost lg:hidden" aria-label="Close menu">
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="section-label mb-2 px-3">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`sidebar-nav-item ${active ? 'active' : ''}`}
                  >
                    <span
                      className="icon-box size-7 shrink-0"
                      style={{
                        background: active ? 'var(--primary)' : 'var(--background-alt)',
                        color: active ? '#fff' : 'var(--foreground-muted)',
                        transition: 'background 150ms, color 150ms',
                      }}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <Link
          href="/settings"
          onClick={onClose}
          className={`sidebar-nav-item ${pathname === '/settings' ? 'active' : ''}`}
        >
          <span
            className="icon-box size-7 shrink-0"
            style={{
              background: pathname === '/settings' ? 'var(--primary)' : 'var(--background-alt)',
              color: pathname === '/settings' ? '#fff' : 'var(--foreground-muted)',
              transition: 'background 150ms, color 150ms',
            }}
          >
            <Settings className="size-3.5" />
          </span>
          Settings
        </Link>

        {user && (
          <Link
            href="/settings"
            onClick={onClose}
            className="mt-3 flex items-center gap-3 rounded-xl p-3 transition-colors"
            style={{ background: 'var(--background-alt)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--background-alt)' }}
          >
            {/* Avatar */}
            <div
              className="grid size-9 shrink-0 place-items-center rounded-xl text-xs font-bold"
              style={{ background: 'var(--gradient-hero)', color: '#fff' }}
            >
              {user.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {user.name}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>
                {user.plan} plan
              </p>
            </div>
            <ChevronRight className="size-3.5 shrink-0" style={{ color: 'var(--foreground-muted)' }} />
          </Link>
        )}
      </div>
    </aside>
  )
}

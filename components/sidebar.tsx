'use client'

import { Logo } from '@/components/logo'
import type { UserProfile } from '@/lib/api'
import {
  Activity,
  Bot,
  CalendarDays,
  ChevronDown,
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
      { label: 'Planner', href: '/planner', icon: CalendarDays, keywords: 'week schedule routine plan' },
    ],
  },
  {
    label: 'Training',
    items: [
      { label: 'Workouts', href: '/workouts', icon: Dumbbell, keywords: 'exercise strength cardio hiit mobility' },
      { label: 'Nutrition', href: '/nutrition', icon: Utensils, keywords: 'meals calories macros food hydration' },
      { label: 'Recovery', href: '/recovery', icon: HeartPulse, keywords: 'sleep readiness hydration rest' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Progress', href: '/progress', icon: TrendingUp, keywords: 'charts weight metrics performance' },
      { label: 'Activity', href: '/activity', icon: Activity, keywords: 'history timeline sessions meals' },
      { label: 'AI Coach', href: '/coach', icon: Bot, keywords: 'assistant advice coach ai help' },
    ],
  },
] as const

export const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items)

interface SidebarProps {
  user: UserProfile | null
  onClose?: () => void
}

export function Sidebar({ user, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="flex h-full w-[252px] flex-col px-4 py-6"
      style={{ background: 'var(--sidebar)', borderRight: '1px solid var(--sidebar-border)' }}
    >
      <div className="flex items-center justify-between px-1">
        <Logo />
        {onClose && (
          <button onClick={onClose} className="btn-ghost lg:hidden" aria-label="Close menu">
            <X className="size-4" />
          </button>
        )}
      </div>

      <nav className="mt-8 flex-1 space-y-6 overflow-y-auto pr-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p
              className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--foreground-muted)', opacity: 0.72 }}
            >
              {group.label}
            </p>
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
                    <Icon className="size-[18px] shrink-0" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-0.5 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
        <Link
          href="/settings"
          onClick={onClose}
          className={`sidebar-nav-item ${pathname === '/settings' ? 'active' : ''}`}
        >
          <Settings className="size-[18px] shrink-0" />
          Settings
        </Link>

        {user && (
          <Link
            href="/settings"
            onClick={onClose}
            className="mt-3 flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-[var(--card-hover)]"
            style={{ background: 'var(--background-alt)' }}
          >
            <div
              className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold"
              style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
            >
              {user.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {user.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                {user.plan} plan
              </p>
            </div>
            <ChevronDown className="size-4 shrink-0 -rotate-90" style={{ color: 'var(--foreground-muted)' }} />
          </Link>
        )}
      </div>
    </aside>
  )
}

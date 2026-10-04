'use client'

import { Logo } from '@/components/logo'
import { logout, type AuthRole } from '@/lib/auth'
import type { UserProfile } from '@/lib/api'
import type React from 'react'
import {
  Activity,
  Bot,
  CalendarDays,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
  UsersRound,
  Utensils,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  keywords: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const USER_NAV_GROUPS: NavGroup[] = [
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
]

export const COACH_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Coaching',
    items: [
      { label: 'Coach Workspace', href: '/coach-portal', icon: UsersRound, keywords: 'coach clients roster checkins workspace' },
      { label: 'Planner', href: '/planner', icon: CalendarDays, keywords: 'week schedule routine plan' },
    ],
  },
  {
    label: 'Programming',
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
      { label: 'AI Assistant', href: '/coach', icon: Bot, keywords: 'assistant advice coach ai help' },
    ],
  },
]

const allItems = [...USER_NAV_GROUPS, ...COACH_NAV_GROUPS].flatMap((group) => group.items)
export const NAV_ITEMS: NavItem[] = Array.from(new Map(allItems.map((item) => [item.href, item])).values())

export function getNavGroupsForRole(role?: AuthRole): NavGroup[] {
  return role === 'COACH' ? COACH_NAV_GROUPS : USER_NAV_GROUPS
}

export function getNavItemsForRole(role?: AuthRole): NavItem[] {
  return getNavGroupsForRole(role).flatMap((group) => group.items)
}

interface SidebarProps {
  user: UserProfile | null
  onClose?: () => void
}

function roleFromUser(user: UserProfile | null): AuthRole {
  return user?.role === 'COACH' ? 'COACH' : 'USER'
}

export function Sidebar({ user, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const role = roleFromUser(user)
  const groups = getNavGroupsForRole(role)

  const signOut = () => {
    logout()
    onClose?.()
    router.replace('/auth/login')
  }

  return (
    <aside className="flex h-full w-[260px] flex-col" style={{ background: 'var(--sidebar)', borderRight: '1px solid var(--sidebar-border)' }}>
      <div className="flex items-center justify-between px-5 py-5">
        <Logo />
        {onClose && (
          <button onClick={onClose} className="btn-ghost lg:hidden" aria-label="Close menu"><X className="size-4" /></button>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="section-label mb-2 px-3">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <Link key={href} href={href} onClick={onClose} className={`sidebar-nav-item ${active ? 'active' : ''}`}>
                    <span className="icon-box size-7 shrink-0" style={{ background: active ? 'var(--primary)' : 'var(--background-alt)', color: active ? '#fff' : 'var(--foreground-muted)', transition: 'background 150ms, color 150ms' }}>
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

      <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <Link href="/settings" onClick={onClose} className={`sidebar-nav-item ${pathname === '/settings' ? 'active' : ''}`}>
          <span className="icon-box size-7 shrink-0" style={{ background: pathname === '/settings' ? 'var(--primary)' : 'var(--background-alt)', color: pathname === '/settings' ? '#fff' : 'var(--foreground-muted)' }}>
            <Settings className="size-3.5" />
          </span>
          Settings
        </Link>

        {user && (
          <div className="mt-3 rounded-xl p-3" style={{ background: 'var(--background-alt)' }}>
            <div className="flex items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl text-xs font-bold" style={{ background: 'var(--gradient-hero)', color: '#fff' }}>
                {user.avatarInitials}
              </div>
              <Link href="/settings" onClick={onClose} className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{user.name}</p>
                <p className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>{role === 'COACH' ? 'Coach account' : `${user.plan} plan`}</p>
              </Link>
              <ChevronRight className="size-3.5 shrink-0" style={{ color: 'var(--foreground-muted)' }} />
            </div>
            <button onClick={signOut} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-foreground-muted transition hover:bg-white hover:text-danger">
              <LogOut className="size-3.5" /> Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

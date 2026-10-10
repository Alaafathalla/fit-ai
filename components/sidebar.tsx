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
  RefreshCw,
  Settings,
  Sparkles,
  TrendingUp,
  UserCheck,
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
  badge?: string
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
    label: 'Training & Fuel',
    items: [
      { label: 'Workouts', href: '/workouts', icon: Dumbbell, keywords: 'exercise strength cardio hiit mobility' },
      { label: 'Nutrition', href: '/nutrition', icon: Utensils, keywords: 'meals calories macros food hydration' },
      { label: 'Recovery', href: '/recovery', icon: HeartPulse, keywords: 'sleep readiness hydration rest' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Progress', href: '/progress', icon: TrendingUp, keywords: 'charts weight metrics performance' },
      { label: 'Activity', href: '/activity', icon: Activity, keywords: 'history timeline sessions meals' },
      { label: 'AI Coach', href: '/coach', icon: Bot, keywords: 'assistant advice coach ai help', badge: 'AI' },
    ],
  },
]

export const COACH_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Coaching Operations',
    items: [
      { label: 'Coach Workspace', href: '/coach-portal', icon: UsersRound, keywords: 'coach clients roster checkins workspace', badge: 'Live' },
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
    label: 'Intelligence',
    items: [
      { label: 'Progress', href: '/progress', icon: TrendingUp, keywords: 'charts weight metrics performance' },
      { label: 'Activity', href: '/activity', icon: Activity, keywords: 'history timeline sessions meals' },
      { label: 'AI Assistant', href: '/coach', icon: Bot, keywords: 'assistant advice coach ai help', badge: 'AI' },
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

  const switchRole = () => {
    onClose?.()
    if (role === 'COACH') {
      router.push('/dashboard')
    } else {
      router.push('/coach-portal')
    }
  }

  return (
    <aside
      className="flex h-full w-[268px] flex-col"
      style={{ background: 'var(--sidebar)', borderRight: '1px solid var(--sidebar-border)' }}
    >
      {/* Brand Logo */}
      <div className="flex items-center justify-between px-6 py-5">
        <Logo />
        {onClose && (
          <button
            onClick={onClose}
            className="btn-ghost lg:hidden -mr-2 p-1.5 rounded-xl text-foreground hover:bg-background-alt"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3.5 pb-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[11px] font-extrabold uppercase tracking-widest text-foreground-muted/80 mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map(({ label, href, icon: Icon, badge }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`sidebar-nav-item flex items-center justify-between group ${active ? 'active' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-lg transition"
                        style={{
                          background: active ? 'var(--primary)' : 'var(--background-alt)',
                          color: active ? '#fff' : 'var(--foreground-muted)',
                        }}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <span className="truncate text-xs font-bold">{label}</span>
                    </div>

                    {badge && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                          active
                            ? 'bg-white/20 text-white'
                            : badge === 'AI'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Account section */}
      <div className="px-3.5 pb-5 pt-3 border-t border-border/80">
        <Link
          href="/settings"
          onClick={onClose}
          className={`sidebar-nav-item ${pathname === '/settings' ? 'active' : ''}`}
        >
          <span
            className="grid size-7 shrink-0 place-items-center rounded-lg transition"
            style={{
              background: pathname === '/settings' ? 'var(--primary)' : 'var(--background-alt)',
              color: pathname === '/settings' ? '#fff' : 'var(--foreground-muted)',
            }}
          >
            <Settings className="size-3.5" />
          </span>
          <span className="text-xs font-bold">Settings & Preferences</span>
        </Link>

        {user && (
          <div className="mt-3 rounded-2xl p-3 border border-border/70 bg-background-alt/60">
            <div className="flex items-center gap-3">
              <div
                className="grid size-9 shrink-0 place-items-center rounded-xl text-xs font-black text-white shadow-xs"
                style={{ background: 'var(--gradient-hero)' }}
              >
                {user.avatarInitials}
              </div>
              <Link href="/settings" onClick={onClose} className="min-w-0 flex-1 group">
                <p className="truncate text-xs font-extrabold text-foreground group-hover:text-primary transition">
                  {user.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-bold text-foreground-muted">
                    {role === 'COACH' ? 'Coach Workspace' : `${user.plan} Athlete`}
                  </p>
                </div>
              </Link>
              <ChevronRight className="size-3.5 shrink-0 text-foreground-muted" />
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between gap-1 text-[11px]">
              <button
                onClick={switchRole}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-bold text-primary hover:bg-primary-light transition"
                title={role === 'COACH' ? 'Switch to Athlete Dashboard' : 'Switch to Coach Workspace'}
              >
                <RefreshCw className="size-3" />
                <span>{role === 'COACH' ? 'Athlete View' : 'Coach View'}</span>
              </button>

              <button
                onClick={signOut}
                className="flex items-center gap-1 rounded-lg px-2 py-1 font-bold text-foreground-muted hover:text-danger hover:bg-danger-light transition"
                title="Sign out"
              >
                <LogOut className="size-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

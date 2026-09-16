'use client'

import { Logo } from '@/components/logo'
import type { UserProfile } from '@/lib/api'
import {
  Bot,
  ChevronDown,
  Dumbbell,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Utensils,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Workouts',  href: '/workouts',  icon: Dumbbell },
  { label: 'Nutrition', href: '/nutrition', icon: Utensils },
  { label: 'Progress',  href: '/progress',  icon: TrendingUp },
  { label: 'AI Coach',  href: '/coach',     icon: Bot },
]

interface SidebarProps {
  user: UserProfile | null
  onClose?: () => void
}

export function Sidebar({ user, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="flex h-full w-[238px] flex-col px-4 py-6"
      style={{
        background: 'var(--sidebar)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {/* Logo row */}
      <div className="flex items-center justify-between px-1">
        <Logo />
        {onClose && (
          <button
            onClick={onClose}
            className="btn-ghost lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="mt-10 flex-1 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
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
      </nav>

      {/* Bottom: settings + user card */}
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
          <div
            className="mt-3 flex items-center gap-3 rounded-xl p-2.5"
            style={{ background: 'var(--background-alt)' }}
          >
            <div
              className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold"
              style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
            >
              {user.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {user.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                {user.plan} plan
              </p>
            </div>
            <ChevronDown
              className="size-4 shrink-0"
              style={{ color: 'var(--foreground-muted)' }}
            />
          </div>
        )}
      </div>
    </aside>
  )
}

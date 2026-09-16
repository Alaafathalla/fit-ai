'use client'

import {
  Bot,
  ChevronDown,
  Dumbbell,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Utensils,
} from 'lucide-react'
import { Logo } from './Logo'
import type { UserProfile } from '@/lib/api'

export type AppPage = 'Dashboard' | 'Workouts' | 'Nutrition' | 'Progress' | 'AI Coach' | 'Settings'

const navItems: { label: AppPage; icon: React.ElementType }[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Workouts',  icon: Dumbbell },
  { label: 'Nutrition', icon: Utensils },
  { label: 'Progress',  icon: TrendingUp },
  { label: 'AI Coach',  icon: Bot },
]

interface SidebarProps {
  activePage: AppPage
  onNavigate: (page: AppPage) => void
  user: UserProfile | null
}

export function Sidebar({ activePage, onNavigate, user }: SidebarProps) {
  return (
    <aside className="hidden w-[238px] shrink-0 flex-col border-r border-slate-200/80 bg-white px-5 py-7 lg:flex">
      <Logo />

      <nav className="mt-12 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = activePage === item.label
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#eef1ff] text-[#5264eb]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto space-y-1">
        <button
          onClick={() => onNavigate('Settings')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"
        >
          <Settings className="size-[18px]" />
          Settings
        </button>

        {user && (
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-5">
            <div
              className={`grid size-9 place-items-center rounded-full text-sm font-semibold ${user.avatarColor}`}
            >
              {user.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-400">{user.plan} plan</p>
            </div>
            <ChevronDown className="size-4 shrink-0 text-slate-400" />
          </div>
        )}
      </div>
    </aside>
  )
}

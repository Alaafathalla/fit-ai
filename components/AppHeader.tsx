'use client'

import { Bell, Menu, Search } from 'lucide-react'
import { Logo } from './Logo'
import type { AppPage } from './Sidebar'

interface AppHeaderProps {
  title: string
  subtitle?: string
  onMenuOpen?: () => void
  onNavigate: (page: AppPage) => void
}

export function AppHeader({ title, subtitle, onMenuOpen, onNavigate }: AppHeaderProps) {
  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-5 sm:px-8">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden"
          aria-label="Open menu"
          onClick={onMenuOpen}
        >
          <Menu className="size-5" />
        </button>
        <button className="lg:hidden" onClick={() => onNavigate('Dashboard')}>
          <Logo />
        </button>
        <div className="hidden lg:block">
          {subtitle && <p className="text-sm font-medium text-slate-500">{subtitle}</p>}
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label="Search"
          className="grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
        >
          <Search className="size-[18px]" />
        </button>
        <button
          aria-label="Notifications"
          className="relative grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
        >
          <Bell className="size-[18px]" />
          <i className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#ff725c]" />
        </button>
      </div>
    </header>
  )
}

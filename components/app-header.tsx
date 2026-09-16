'use client'

import { Logo } from '@/components/logo'
import type { Theme } from '@/components/theme-provider'
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'

interface AppHeaderProps {
  title: string
  subtitle?: string
  onMenuOpen: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function AppHeader({
  title,
  subtitle,
  onMenuOpen,
  theme,
  onToggleTheme,
}: AppHeaderProps) {
  return (
    <header
      className="flex h-[72px] shrink-0 items-center justify-between px-5 sm:px-8"
      style={{
        background: 'var(--header)',
        borderBottom: '1px solid var(--header-border)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="btn-ghost lg:hidden"
          onClick={onMenuOpen}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Mobile logo */}
        <div className="lg:hidden">
          <Logo />
        </div>

        {/* Desktop title */}
        {subtitle ? (
          <div className="hidden lg:block">
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              {subtitle}
            </p>
            <h1
              className="text-xl font-semibold tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              {title}
            </h1>
          </div>
        ) : (
          <h1
            className="hidden text-xl font-semibold tracking-tight lg:block"
            style={{ color: 'var(--foreground)' }}
          >
            {title}
          </h1>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button className="btn-ghost" aria-label="Search">
          <Search className="size-[18px]" />
        </button>

        <button
          className="btn-ghost"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="size-[18px]" />
          ) : (
            <Moon className="size-[18px]" />
          )}
        </button>

        <button className="btn-ghost relative" aria-label="Notifications">
          <Bell className="size-[18px]" />
          <span
            className="absolute right-1.5 top-1.5 size-1.5 rounded-full"
            style={{ background: 'var(--danger)' }}
          />
        </button>
      </div>
    </header>
  )
}

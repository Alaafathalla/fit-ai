'use client'

import { Logo } from '@/components/logo'
import { getCurrentAuthUser, getRoleHome, type AuthUser } from '@/lib/auth'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/for-coaches', label: 'Coaches' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    setUser(getCurrentAuthUser())
  }, [pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const accountHref = user ? getRoleHome(user.role) : '/auth/login'
  const accountLabel = user ? 'Open workspace' : 'Sign in'

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="FitAI home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active ? 'bg-primary-light text-primary' : 'text-foreground-muted hover:bg-background-alt hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-1.5 xl:gap-2 lg:flex">
          <Link href="/help" className="btn-ghost !px-2.5 text-sm font-semibold">
            Help
          </Link>
          <Link href="/contact" className="btn-ghost !px-2.5 text-sm font-semibold">
            Contact
          </Link>
          {!user && (
            <Link href="/auth/register" className="btn-ghost !px-2.5 text-sm font-semibold">
              Register
            </Link>
          )}
          <Link href={accountHref} className="btn-primary !h-9 !px-4 !text-xs !font-bold">
            {accountLabel}
          </Link>
        </div>

        <button
          className="btn-ghost lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 py-4 lg:hidden">
          <nav className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2.5 text-sm font-bold text-foreground hover:bg-background-alt"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="rounded-xl px-3 py-2.5 text-sm font-bold text-foreground hover:bg-background-alt">
              Contact
            </Link>
            <Link href="/help" className="rounded-xl px-3 py-2.5 text-sm font-bold text-foreground hover:bg-background-alt">
              Help Center
            </Link>
          </nav>
          <div className="mt-4 grid gap-2">
            {!user && (
              <Link href="/auth/register" className="btn-outline w-full">
                Create account
              </Link>
            )}
            <Link href={accountHref} className="btn-primary w-full">
              {accountLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

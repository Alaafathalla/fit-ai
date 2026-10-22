import { Logo } from '@/components/logo'
import Link from 'next/link'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/for-coaches', label: 'Coach workspace' },
      { href: '/plans', label: 'Membership plans' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/resources', label: 'Resources' },
      { href: '/contact', label: 'Contact' },
      { href: '/security', label: 'Security' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/help', label: 'Help Center' },
      { href: '/auth/login', label: 'Sign in' },
      { href: '/auth/register', label: 'Create account' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-[#090d16] text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="inline-flex" aria-label="FitAI home">
            <Logo light />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            FitAI is a training workspace for athletes and coaches. Track load, nutrition, and recovery in one place.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm font-semibold text-slate-300 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} FitAI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-slate-300">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/security" className="hover:text-slate-300">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { MarketingShell } from '@/components/marketing/marketing-shell'
import { KeyRound, Lock, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Security — FitAI',
  description: 'How FitAI protects athlete and coach workspaces.',
}

const ITEMS = [
  {
    icon: Lock,
    title: 'Session control',
    text: 'Sign-in creates a browser session with an expiry. Remember me extends it. Sign out clears it immediately.',
  },
  {
    icon: KeyRound,
    title: 'Role isolation',
    text: 'Athlete and coach routes are gated. Opening the wrong workspace redirects you to the home for your role.',
  },
  {
    icon: ShieldCheck,
    title: 'Least data by default',
    text: 'We collect what the workspace needs to render training, nutrition, and recovery — not a social graph.',
  },
]

export default function SecurityPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="section-label">Trust</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight">Security practices you can inspect.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-muted">
          FitAI is a training product, not a hospital system. We still treat logs, bodyweight, and coach notes as sensitive.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {ITEMS.map((item) => (
            <article key={item.title} className="card p-6">
              <span className="icon-box size-10 bg-primary-light text-primary">
                <item.icon className="size-4" />
              </span>
              <h2 className="mt-4 font-bold">{item.title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-foreground-muted">{item.text}</p>
            </article>
          ))}
        </div>
        <Link href="/privacy" className="btn-outline mt-10">
          Read the privacy policy
        </Link>
      </section>
    </MarketingShell>
  )
}

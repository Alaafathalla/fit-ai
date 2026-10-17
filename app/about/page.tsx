import { MarketingShell } from '@/components/marketing/marketing-shell'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — FitAI',
  description: 'FitAI is a performance workspace for athletes and coaches who want training, nutrition, and recovery in one system.',
}

const VALUES = [
  {
    title: 'Clarity over noise',
    text: 'Dashboards should answer whether the week is on track. We avoid feeds, streaks theater, and empty gamification.',
  },
  {
    title: 'Coaches stay in control',
    text: 'AI can draft a suggestion. Programming decisions belong to the coach and the athlete, not an opaque model.',
  },
  {
    title: 'Recovery is training',
    text: 'Sleep, hydration, and rest days are first-class data. A plan that ignores them is incomplete.',
  },
]

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="section-label">Company</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">A cockpit for athletic work.</h1>
        <p className="mt-4 text-sm leading-7 text-foreground-muted">
          FitAI started from a simple failure: athletes trained in one app, logged food in another, and sent screenshots to coaches in a third. Nobody had a single view of load, fuel, and recovery.
        </p>
        <p className="mt-3 text-sm leading-7 text-foreground-muted">
          We built one workspace with two roles. Athletes get a planner they can follow. Coaches get a roster they can actually review in ten minutes.
        </p>

        <div className="mt-10 grid gap-4">
          {VALUES.map((value) => (
            <article key={value.title} className="card p-5">
              <h2 className="font-bold">{value.title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-foreground-muted">{value.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary">
            Talk to us
          </Link>
          <Link href="/careers" className="btn-outline">
            Open roles
          </Link>
        </div>
      </section>
    </MarketingShell>
  )
}

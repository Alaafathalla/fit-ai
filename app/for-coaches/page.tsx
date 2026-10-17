import { MarketingShell } from '@/components/marketing/marketing-shell'
import { CalendarCheck2, Flag, MessageCircle, UsersRound } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'For Coaches — FitAI',
  description: 'A coach workspace for roster reviews, weekly plans, nutrition targets, and athlete check-ins.',
}

const POINTS = [
  { icon: UsersRound, title: 'Roster first', text: 'See who is on track, who needs review, and who is slipping before you open a single chat.' },
  { icon: CalendarCheck2, title: 'Edit the plan, not a spreadsheet', text: 'Update session days, meals, and recovery blocks inside the athlete’s weekly calendar.' },
  { icon: Flag, title: 'Status flags that mean something', text: 'On track, review, and needs attention are tied to adherence — not vanity metrics.' },
  { icon: MessageCircle, title: 'Notes that stay with the athlete', text: 'Check-in notes live on the client record so the next session starts with context.' },
]

export default function ForCoachesPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="section-label">Coaches</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight">Review a roster in the time it takes to drink coffee.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-muted">
          FitAI’s coach portal is built for weekly triage: adherence, readiness, and one programming change per athlete. Sign in with a coach account to open the workspace.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {POINTS.map((point) => (
            <article key={point.title} className="card p-6">
              <span className="icon-box size-10 bg-primary-light text-primary">
                <point.icon className="size-4" />
              </span>
              <h2 className="mt-4 font-bold">{point.title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-foreground-muted">{point.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/auth/login?role=coach" className="btn-primary">
            Coach sign in
          </Link>
          <Link href="/auth/register?role=coach" className="btn-outline">
            Create coach account
          </Link>
        </div>
      </section>
    </MarketingShell>
  )
}

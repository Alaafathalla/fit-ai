import { MarketingShell } from '@/components/marketing/marketing-shell'
import { Activity, Bot, CalendarDays, Dumbbell, HeartPulse, TrendingUp, UsersRound, Utensils } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Features — FitAI',
  description: 'Training, nutrition, recovery, planner, analytics, and coach collaboration in one athletic workspace.',
}

const GROUPS = [
  {
    title: 'Athlete workspace',
    items: [
      { icon: Dumbbell, title: 'Workouts', text: 'Session library with completion tracking, detail views, and load you can actually finish.' },
      { icon: Utensils, title: 'Nutrition', text: 'Daily calories, macros, and meal logging tied to the same week as training.' },
      { icon: HeartPulse, title: 'Recovery', text: 'Sleep, hydration, and readiness so rest days are measured, not guessed.' },
      { icon: CalendarDays, title: 'Planner', text: 'A weekly view that mixes training, fueling, and recovery into one schedule.' },
    ],
  },
  {
    title: 'Insight & support',
    items: [
      { icon: TrendingUp, title: 'Progress', text: 'Weight, consistency, and performance trends across 7, 30, and 90 days.' },
      { icon: Activity, title: 'Activity', text: 'A timeline of sessions and meals so nothing important disappears in chat history.' },
      { icon: Bot, title: 'Coach assistant', text: 'In-app guidance for programming questions, recovery flags, and next actions.' },
      { icon: UsersRound, title: 'Coach portal', text: 'Roster, check-ins, status flags, and plan edits for every athlete you coach.' },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="section-label">Product</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight">Everything needed to run a serious training week.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-muted">
          FitAI combines the athlete dashboard and the coach workspace so programming, logging, and review stay in the same system.
        </p>

        {GROUPS.map((group) => (
          <div key={group.title} className="mt-12">
            <h2 className="text-xl font-black">{group.title}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {group.items.map((item) => (
                <article key={item.title} className="card p-6">
                  <span className="icon-box size-10 bg-primary-light text-primary">
                    <item.icon className="size-4" />
                  </span>
                  <h3 className="mt-4 font-bold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-foreground-muted">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/pricing" className="btn-primary">
            View pricing
          </Link>
          <Link href="/auth/register" className="btn-outline">
            Create an account
          </Link>
        </div>
      </section>
    </MarketingShell>
  )
}

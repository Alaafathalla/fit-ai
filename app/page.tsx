'use client'

import { MarketingShell } from '@/components/marketing/marketing-shell'
import { getCurrentAuthUser, getRoleHome } from '@/lib/auth'
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  Utensils,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const FEATURES = [
  {
    icon: Dumbbell,
    title: 'Training library',
    text: 'Strength, cardio, HIIT, and mobility sessions with clear structure and completion tracking.',
  },
  {
    icon: Utensils,
    title: 'Nutrition targets',
    text: 'Calories, macros, and hydration in one log so fueling stays aligned with the week’s load.',
  },
  {
    icon: HeartPulse,
    title: 'Recovery telemetry',
    text: 'Sleep, readiness, and rest days treated as part of the plan — not an afterthought.',
  },
  {
    icon: CalendarDays,
    title: 'Weekly planner',
    text: 'Build a balanced week with workouts, meals, and recovery blocks athletes can actually follow.',
  },
  {
    icon: TrendingUp,
    title: 'Progress analytics',
    text: 'Weight, consistency, and training trends that show whether the program is working.',
  },
  {
    icon: UsersRound,
    title: 'Coach roster',
    text: 'Client check-ins, status flags, and programming updates from a dedicated coach workspace.',
  },
]

const STEPS = [
  { step: '01', title: 'Choose your role', text: 'Sign in as an athlete or a coach. Each workspace is built around a different job.' },
  { step: '02', title: 'Set the week', text: 'Pick sessions, nutrition targets, and recovery days. Keep the plan visible, not buried in notes.' },
  { step: '03', title: 'Review the signal', text: 'Log work, watch trends, and adjust before small misses turn into a stalled block.' },
]

export default function HomePage() {
  const [workspaceHref, setWorkspaceHref] = useState('/auth/register')
  const [primaryLabel, setPrimaryLabel] = useState('Start free')

  useEffect(() => {
    const user = getCurrentAuthUser()
    if (user) {
      setWorkspaceHref(getRoleHome(user.role))
      setPrimaryLabel('Open workspace')
    }
  }, [])

  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-[#090d16] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-200">
              <Activity className="size-3.5 text-purple-400" />
              Athletic performance platform
            </p>
            <h1 className="mt-6 max-w-xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Training, fuel, and recovery in one workspace.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
              FitAI helps athletes stay consistent and gives coaches a clear view of load, nutrition, and readiness — without spreading the work across five apps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={workspaceHref} className="btn-primary !px-5 !py-3 !text-sm">
                {primaryLabel} <ArrowRight className="size-4" />
              </Link>
              <Link href="/features" className="btn-outline !border-slate-700 !bg-transparent !px-5 !py-3 !text-sm !text-white hover:!bg-slate-800">
                See product
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-xs font-semibold text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400" /> Athlete and coach modes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-sky-400" /> Private by default
              </span>
            </div>
          </div>

          <div className="grid gap-3 self-center">
            {[
              { label: 'Weekly adherence', value: '92%', meta: 'Sessions completed' },
              { label: 'Readiness', value: 'Good', meta: 'Sleep + hydration' },
              { label: 'Coach flags', value: '3', meta: 'Athletes to review' },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{card.label}</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-3xl font-black text-white">{card.value}</p>
                  <p className="text-xs text-slate-400">{card.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="section-label">Platform</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Built for the work coaches already do.</h2>
          <p className="mt-3 text-sm leading-7 text-foreground-muted">
            FitAI is not a social feed. It is a cockpit for programming, logging, and reviewing the signals that actually change training.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="card p-5">
              <span className="icon-box size-10 bg-primary-light text-primary">
                <feature.icon className="size-4" />
              </span>
              <h3 className="mt-4 text-base font-bold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-foreground-muted">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-background-alt">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3">
          {STEPS.map((item) => (
            <div key={item.step}>
              <p className="text-xs font-black tracking-[0.2em] text-primary">{item.step}</p>
              <h3 className="mt-3 text-xl font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="card overflow-hidden p-8 sm:p-10" style={{ background: 'var(--gradient-hero)' }}>
          <div className="max-w-xl text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">AI assistant</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Ask the coach when the plan needs a second opinion.</h2>
            <p className="mt-3 text-sm leading-7 text-white/80">
              The in-app assistant helps athletes interpret readiness and helps coaches draft the next programming change — still under human control.
            </p>
            <Link href="/coach" className="btn-primary mt-6 !bg-white !text-primary hover:!bg-slate-100">
              <Bot className="size-4" /> Meet the assistant
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}

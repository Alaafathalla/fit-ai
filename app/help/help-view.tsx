'use client'

import { MarketingShell } from '@/components/marketing/marketing-shell'
import { Shell } from '@/components/shell'
import { getCurrentAuthUser } from '@/lib/auth'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const FAQS = [
  {
    q: 'What’s the difference between athlete and coach accounts?',
    a: 'Athletes land on the dashboard, planner, workouts, nutrition, and recovery tools. Coaches land on the client roster, where they review adherence and edit weekly plans.',
  },
  {
    q: 'Can I try FitAI without creating a new account?',
    a: 'Yes. On the sign-in page, choose a role and use Fill demo credentials. Athlete is athlete@fitai.app and coach is coach@fitai.app.',
  },
  {
    q: 'Where do I log a workout or a meal?',
    a: 'Use Workouts to start or complete a session and Nutrition to log meals. The header Action menu also jumps to those flows.',
  },
  {
    q: 'Why was I redirected away from a page?',
    a: 'Some routes are role-specific. If a coach opens the athlete dashboard, FitAI sends them to the coach portal, and the reverse is also true.',
  },
  {
    q: 'How do plans work?',
    a: 'Free, Pro, and Elite change history depth and coaching tools. Public pricing is on /pricing. Signed-in members can also review /plans.',
  },
]

function HelpBody() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <p className="section-label">Support</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Help Center</h1>
      <p className="mt-3 text-sm leading-7 text-foreground-muted">
        Short answers for the flows people actually get stuck on. If you still need a person, use the contact form.
      </p>
      <div className="mt-8 space-y-3">
        {FAQS.map((item) => (
          <details key={item.q} className="card group p-5">
            <summary className="cursor-pointer list-none font-bold">{item.q}</summary>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">{item.a}</p>
          </details>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/contact" className="btn-primary">
          Contact support
        </Link>
        <Link href="/auth/login" className="btn-outline">
          Sign in
        </Link>
      </div>
    </div>
  )
}

export function HelpView() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    setAuthed(Boolean(getCurrentAuthUser()))
  }, [])

  if (authed === null) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <span className="size-7 animate-spin rounded-full border-[3px] border-primary/15 border-t-primary" />
      </div>
    )
  }

  if (authed) {
    return (
      <Shell title="Help Center" subtitle="Support">
        <HelpBody />
      </Shell>
    )
  }

  return (
    <MarketingShell>
      <HelpBody />
    </MarketingShell>
  )
}

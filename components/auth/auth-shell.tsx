'use client'

import { Logo } from '@/components/logo'
import { Activity, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface AuthShellProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

const highlights = [
  { icon: Activity, label: 'Performance Analytics', text: 'Workouts, macro splits, and bio-readiness in unified telemetry.' },
  { icon: Zap, label: 'Adaptive Programming', text: 'Progressive training volumes calibrated to actual performance.' },
  { icon: ShieldCheck, label: 'Client & Coach Collaboration', text: 'Direct accountability pipelines with zero fluff.' },
]

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#090d16] text-white lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14 border-r border-slate-800">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10">
          <Link href="/" aria-label="FitAI home" className="inline-flex rounded-xl bg-slate-900/90 border border-slate-700 px-4 py-2.5 shadow-lg backdrop-blur">
            <Logo />
          </Link>
        </div>

        <div className="relative z-10 max-w-xl py-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/90 px-3 py-1 text-xs font-semibold text-slate-200">
            <Activity className="size-3.5 text-blue-400" />
            <span>High-Performance Training Cockpit</span>
          </div>
          <h2 className="max-w-lg text-4xl font-black tracking-[-0.04em] text-white xl:text-5xl">
            Engineered for athletes. Built for coaches.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
            A precision workspace designed to track training loads, recovery metrics, and client progression without noise.
          </p>

          <div className="mt-9 grid gap-3">
            {highlights.map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-sm">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{label}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-400" /> Pro Athlete & Coach Telemetry</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-blue-400" /> Enterprise-Grade Privacy</span>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-8 sm:px-7 lg:px-10">
        <div className="absolute left-5 top-5 lg:hidden">
          <Link href="/" className="inline-flex rounded-2xl bg-white px-3 py-2.5 shadow-sm"><Logo /></Link>
        </div>

        <div className="w-full max-w-[480px] pt-16 lg:pt-0">
          <div className="animate-fade-up">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
            <h1 className="text-3xl font-black tracking-[-0.035em] text-foreground sm:text-[36px]">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-foreground-muted">{description}</p>
          </div>

          <div className="animate-fade-up mt-7 rounded-[28px] border border-border bg-white p-5 shadow-[0_20px_60px_rgba(33,42,90,0.10)] sm:p-7" style={{ animationDelay: '60ms' }}>
            {children}
          </div>

          {footer && <div className="animate-fade-up mt-5 text-center text-sm text-foreground-muted" style={{ animationDelay: '120ms' }}>{footer}</div>}

          <p className="mt-7 text-center text-[11px] leading-5 text-foreground-muted/75">
            By continuing, you agree to FitAI's Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  )
}

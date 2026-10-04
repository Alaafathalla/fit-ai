'use client'

import { Logo } from '@/components/logo'
import { Activity, BrainCircuit, CheckCircle2, ShieldCheck, Sparkles, Zap } from 'lucide-react'
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
  { icon: BrainCircuit, label: 'Adaptive coaching', text: 'Plans that evolve with every session.' },
  { icon: Activity, label: 'Progress intelligence', text: 'Training, nutrition, and recovery in one view.' },
  { icon: ShieldCheck, label: 'Private by design', text: 'Your fitness journey stays under your control.' },
]

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg,#121a4e 0%,#4f5fed 52%,#7c3aed 100%)' }} />
        <div className="absolute -left-24 top-20 size-80 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="absolute -right-20 bottom-10 size-96 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10">
          <Link href="/" aria-label="FitAI home" className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-xl shadow-black/10">
            <Logo />
          </Link>
        </div>

        <div className="relative z-10 max-w-xl py-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
            <Sparkles className="size-3.5" /> AI-powered wellness platform
          </div>
          <h2 className="max-w-lg text-4xl font-black tracking-[-0.04em] text-white xl:text-5xl">
            Train smarter. Coach better. Keep momentum visible.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/72">
            A focused workspace for athletes and coaches to turn daily actions into measurable progress.
          </p>

          <div className="mt-9 grid gap-3">
            {highlights.map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/14 text-white">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{label}</p>
                  <p className="mt-0.5 text-xs text-white/65">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-5 text-xs text-white/65">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5" /> Athlete & coach access</span>
          <span className="inline-flex items-center gap-1.5"><Zap className="size-3.5" /> Fast onboarding</span>
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

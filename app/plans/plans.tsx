'use client'

import { Shell } from '@/components/shell'
import { getUserProfile, type UserProfile } from '@/lib/api'
import { Check, Crown, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const PLANS = [
  {
    name: 'Free',
    description: 'Build consistent habits with the essentials.',
    price: '$0',
    suffix: '/month',
    icon: Zap,
    gradient: 'linear-gradient(135deg,#5a6482,#8b99b5)',
    features: [
      'Workout library (6 sessions)',
      'Basic nutrition tracking',
      '7-day progress history',
      'Daily hydration tracking',
    ],
  },
  {
    name: 'Pro',
    description: 'Smarter planning and deeper insights for regular training.',
    price: '$12',
    suffix: '/month',
    icon: Sparkles,
    featured: true,
    gradient: 'linear-gradient(135deg,#4f5fed,#7c3aed)',
    features: [
      'Everything in Free',
      'AI Coach conversations',
      'Weekly smart planner',
      'Recovery & readiness score',
      'Full activity history',
      '90-day progress history',
    ],
  },
  {
    name: 'Elite',
    description: 'Advanced coaching tools for ambitious goals.',
    price: '$24',
    suffix: '/month',
    icon: Crown,
    gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    features: [
      'Everything in Pro',
      'Advanced training analytics',
      'Priority AI coaching',
      'Custom goal cycles',
      'Exportable health reports',
      'Early access to features',
    ],
  },
]

export function PlansPage() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    getUserProfile().then(setUser).catch(() => {})
  }, [])

  return (
    <Shell title="Plans">
      <div className="mx-auto max-w-6xl p-5 sm:p-8">

        {/* Hero */}
        <div className="animate-fade-up mx-auto mb-10 max-w-2xl text-center">
          <span className="badge badge-primary">FitAI membership</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl" style={{ color: 'var(--foreground)' }}>
            Choose the coaching depth you need
          </h2>
          <p className="mt-3 text-sm leading-7" style={{ color: 'var(--foreground-muted)' }}>
            Your fitness data stays in one place. Upgrade or change plans anytime as your training evolves.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon
            const isCurrent = user?.plan === plan.name
            return (
              <article
                key={plan.name}
                className="animate-fade-up relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--card)',
                  border: `1.5px solid ${plan.featured ? 'var(--primary)' : 'var(--border)'}`,
                  boxShadow: plan.featured
                    ? '0 8px 40px rgba(79,95,237,0.25), var(--shadow-lg)'
                    : 'var(--shadow-md)',
                  animationDelay: `${i * 70}ms`,
                }}
              >
                {/* Featured banner */}
                {plan.featured && (
                  <div className="py-2.5 text-center text-xs font-black tracking-widest uppercase text-white" style={{ background: plan.gradient }}>
                    Most popular
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  {/* Icon + name */}
                  <div className="flex items-center gap-3">
                    <div className="icon-box size-11" style={{ background: plan.gradient, color: '#fff' }}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black" style={{ color: 'var(--foreground)' }}>{plan.name}</h3>
                      {isCurrent && <span className="badge badge-success text-[10px]">Current plan</span>}
                    </div>
                  </div>

                  <p className="mt-3 min-h-10 text-sm leading-6" style={{ color: 'var(--foreground-muted)' }}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-5 flex items-end gap-1">
                    <strong className="text-5xl font-black" style={{ color: 'var(--foreground)' }}>{plan.price}</strong>
                    <span className="mb-1.5 text-sm" style={{ color: 'var(--foreground-muted)' }}>{plan.suffix}</span>
                  </div>

                  <div className="my-5 h-px" style={{ background: 'var(--border)' }} />

                  {/* Features */}
                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                        <div
                          className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full"
                          style={{ background: `color-mix(in srgb, var(--success) 15%, transparent)` }}
                        >
                          <Check className="size-2.5" style={{ color: 'var(--success)' }} />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    disabled
                    className="mt-6 w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-all disabled:cursor-default disabled:opacity-55"
                    style={{ background: isCurrent ? 'var(--success)' : plan.gradient }}
                    title="Connect this button to your billing provider when payments are enabled."
                  >
                    {isCurrent ? '✓ Current plan' : 'Billing not connected'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {/* Disclaimer */}
        <div
          className="animate-fade-up mt-8 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-xs"
          style={{ background: 'var(--background-alt)', color: 'var(--foreground-muted)', animationDelay: '250ms' }}
        >
          <ShieldCheck className="size-4 shrink-0" style={{ color: 'var(--success)' }} />
          Billing actions are intentionally disabled until a payment provider is connected.
        </div>
      </div>
    </Shell>
  )
}

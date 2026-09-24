'use client'

import { Shell } from '@/components/shell'
import { getUserProfile, type UserProfile } from '@/lib/api'
import { Check, Crown, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const plans = [
  {
    name: 'Free',
    description: 'Build consistent habits with the essentials.',
    price: '$0',
    suffix: '/month',
    icon: Zap,
    features: ['Workout library', 'Basic nutrition tracking', '7-day progress history', 'Daily hydration tracking'],
  },
  {
    name: 'Pro',
    description: 'Smarter planning and deeper insights for regular training.',
    price: '$12',
    suffix: '/month',
    icon: Sparkles,
    featured: true,
    features: ['Everything in Free', 'AI Coach conversations', 'Weekly smart planner', 'Recovery & readiness', 'Full activity history'],
  },
  {
    name: 'Elite',
    description: 'Advanced coaching tools for ambitious goals.',
    price: '$24',
    suffix: '/month',
    icon: Crown,
    features: ['Everything in Pro', 'Advanced training insights', 'Priority AI coaching', 'Custom goal cycles', 'Exportable reports'],
  },
]

export default function PlansPage() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    getUserProfile().then(setUser).catch(() => {})
  }, [])

  return (
    <Shell title="Plans">
      <div className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="animate-fade-up mx-auto mb-9 max-w-2xl text-center">
          <span className="badge badge-primary">FitAI membership</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: 'var(--foreground)' }}>
            Choose the coaching depth you need
          </h2>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--foreground-muted)' }}>
            Your fitness data stays in one place. Change plans as your training needs evolve.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const current = user?.plan === plan.name
            return (
              <article
                key={plan.name}
                className="animate-fade-up relative flex flex-col rounded-2xl p-6"
                style={{
                  background: 'var(--card)',
                  border: `1px solid ${plan.featured ? 'var(--primary)' : 'var(--border)'}`,
                  boxShadow: plan.featured ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  animationDelay: `${index * 70}ms`,
                }}
              >
                {plan.featured && <span className="badge badge-primary absolute right-5 top-5">Most popular</span>}
                <span className="grid size-11 place-items-center rounded-xl" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>{plan.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-5" style={{ color: 'var(--foreground-muted)' }}>{plan.description}</p>
                <div className="mt-6 flex items-end gap-1">
                  <strong className="text-4xl font-semibold" style={{ color: 'var(--foreground)' }}>{plan.price}</strong>
                  <span className="mb-1 text-xs" style={{ color: 'var(--foreground-muted)' }}>{plan.suffix}</span>
                </div>
                <div className="my-6 h-px" style={{ background: 'var(--border)' }} />
                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      <Check className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--success)' }} /> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className={`mt-7 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-opacity ${plan.featured ? 'btn-primary' : ''} disabled:cursor-default disabled:opacity-60`}
                  style={!plan.featured ? { border: '1px solid var(--border)', color: 'var(--foreground)', background: 'var(--background-alt)' } : undefined}
                  title={!current ? 'Connect this button to your billing provider when payments are enabled.' : undefined}
                >
                  {current ? 'Current plan' : 'Billing not connected'}
                </button>
              </article>
            )
          })}
        </div>

        <div className="animate-fade-up mt-6 flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--foreground-muted)', animationDelay: '220ms' }}>
          <ShieldCheck className="size-4" /> Billing actions are intentionally disabled until a payment provider is connected.
        </div>
      </div>
    </Shell>
  )
}

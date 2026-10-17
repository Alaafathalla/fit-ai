import { MarketingShell } from '@/components/marketing/marketing-shell'
import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing — FitAI',
  description: 'Free, Pro, and Elite plans for athletes and coaches using FitAI.',
}

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    audience: 'Getting started',
    features: ['Workout library (6 sessions)', 'Basic nutrition tracking', '7-day progress history', 'Daily hydration tracking'],
  },
  {
    name: 'Pro',
    price: '$12',
    featured: true,
    audience: 'Serious weekly training',
    features: [
      'Everything in Free',
      'Training advisor sessions',
      'Weekly smart planner',
      'Recovery & readiness score',
      'Full activity history',
      '90-day progress history',
    ],
  },
  {
    name: 'Elite',
    price: '$24',
    audience: 'Athletes plus coach review',
    features: [
      'Everything in Pro',
      'Advanced training analytics',
      'Dedicated coach review pipeline',
      'Custom goal cycles',
      'Exportable health reports',
      'Early access to features',
    ],
  },
]

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Pricing</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Simple plans. Same workspace.</h1>
          <p className="mt-3 text-sm leading-7 text-foreground-muted">
            Start free. Upgrade when you need deeper history, planner intelligence, or a coach review pipeline.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className="card flex flex-col p-6"
              style={plan.featured ? { borderColor: 'var(--primary)', boxShadow: '0 12px 30px rgba(124,58,237,0.12)' } : undefined}
            >
              {plan.featured && (
                <span className="badge badge-primary mb-4 w-fit">Most used</span>
              )}
              <h2 className="text-lg font-black">{plan.name}</h2>
              <p className="mt-1 text-xs font-semibold text-foreground-muted">{plan.audience}</p>
              <p className="mt-5 text-4xl font-black tracking-tight">
                {plan.price}
                <span className="text-sm font-semibold text-foreground-muted"> /month</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className={plan.featured ? 'btn-primary mt-8 w-full' : 'btn-outline mt-8 w-full'}>
                Get {plan.name}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-foreground-muted">
          Already using FitAI? Manage membership in{' '}
          <Link href="/plans" className="font-bold text-primary hover:underline">
            account plans
          </Link>
          .
        </p>
      </section>
    </MarketingShell>
  )
}

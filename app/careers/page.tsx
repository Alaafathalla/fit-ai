import { MarketingShell } from '@/components/marketing/marketing-shell'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Careers — FitAI',
  description: 'Open roles at FitAI for product, coaching operations, and engineering.',
}

const ROLES = [
  {
    title: 'Product designer',
    type: 'Remote · Full-time',
    text: 'Own the athlete dashboard and coach roster. Preference for people who have designed dense operational tools, not only marketing sites.',
  },
  {
    title: 'Full-stack engineer',
    type: 'Remote · Full-time',
    text: 'Ship Next.js surfaces, Prisma models, and the APIs behind workouts, meals, and coach plans.',
  },
  {
    title: 'Coaching operations',
    type: 'Remote · Contract',
    text: 'Turn real coach workflows into product requirements. You should have programmed athletes, not only used fitness apps.',
  },
]

export default function CareersPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="section-label">Company</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Build the workspace coaches actually open.</h1>
        <p className="mt-4 text-sm leading-7 text-foreground-muted">
          FitAI is small on purpose. We hire people who care about training quality and product craft in equal measure.
        </p>
        <div className="mt-8 space-y-4">
          {ROLES.map((role) => (
            <article key={role.title} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-black">{role.title}</h2>
                <span className="badge badge-neutral">{role.type}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">{role.text}</p>
            </article>
          ))}
        </div>
        <Link href="/contact" className="btn-primary mt-8">
          Apply via contact
        </Link>
      </section>
    </MarketingShell>
  )
}

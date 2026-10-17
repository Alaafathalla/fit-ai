import { MarketingShell } from '@/components/marketing/marketing-shell'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — FitAI',
  description: 'Terms for using the FitAI athlete and coach workspaces.',
}

const SECTIONS = [
  {
    title: 'The service',
    body: 'FitAI provides planning, logging, and review tools for training, nutrition, and recovery. It is not medical advice. Athletes with injuries or clinical conditions should work with a qualified professional.',
  },
  {
    title: 'Accounts',
    body: 'You are responsible for the credentials you use. Demo accounts are shared for exploration and should not be used to store private health information.',
  },
  {
    title: 'Acceptable use',
    body: 'Do not attempt to access another user’s workspace, scrape the product, or upload content you do not have the right to share. Coaches may only manage athletes they are assigned.',
  },
  {
    title: 'Plans and availability',
    body: 'Free, Pro, and Elite features are described on the pricing page. This demo may change feature gates without notice. We may suspend access if the service is abused.',
  },
]

export default function TermsPage() {
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="section-label">Legal</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-foreground-muted">Last updated October 17, 2026</p>
        <div className="mt-8 space-y-6">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-black">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-foreground-muted">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </MarketingShell>
  )
}

import { MarketingShell } from '@/components/marketing/marketing-shell'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — FitAI',
  description: 'How FitAI handles account, training, and nutrition data in this product.',
}

const SECTIONS = [
  {
    title: 'What we collect',
    body: 'Account details (name, email, role), training logs, nutrition entries, recovery metrics, and preference settings such as theme. Demo accounts are provided so you can explore without using personal data.',
  },
  {
    title: 'How it is used',
    body: 'Data is used to render your workspace, calculate progress, and support coach reviews. We do not sell athlete or coach data. AI assistant replies are generated from the context you send in the chat.',
  },
  {
    title: 'Where it lives in this demo',
    body: 'This build stores session and local demo state in the browser. If a database is configured, profile and log records may also persist on the server you control.',
  },
  {
    title: 'Your choices',
    body: 'You can update profile fields in Settings, sign out at any time, and request deletion of an account by contacting support. Coaches only see athletes assigned to their roster.',
  },
]

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="section-label">Legal</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Privacy Policy</h1>
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

import { MarketingShell } from '@/components/marketing/marketing-shell'
import { RESOURCE_ARTICLES } from '@/lib/resources'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resources — FitAI',
  description: 'Guides on training load, nutrition targets, and coach check-ins from the FitAI team.',
}

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="section-label">Library</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Resources for athletes and coaches.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground-muted">
          Short field notes on programming, fueling, and weekly review. Written the way we build the product: practical, not theatrical.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {RESOURCE_ARTICLES.map((article) => (
            <Link key={article.slug} href={`/resources/${article.slug}`} className="card block p-6 hover:-translate-y-0.5">
              <span className="badge badge-primary">{article.category}</span>
              <h2 className="mt-4 text-lg font-black leading-snug">{article.title}</h2>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">{article.excerpt}</p>
              <p className="mt-4 text-xs font-bold text-foreground-muted">
                {article.published} · {article.readTime}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  )
}

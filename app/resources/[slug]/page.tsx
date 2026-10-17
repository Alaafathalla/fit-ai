import { MarketingShell } from '@/components/marketing/marketing-shell'
import { getResource, RESOURCE_ARTICLES } from '@/lib/resources'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return RESOURCE_ARTICLES.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getResource(slug)
  if (!article) return { title: 'Article — FitAI' }
  return { title: `${article.title} — FitAI`, description: article.excerpt }
}

export default async function ResourceArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getResource(slug)
  if (!article) notFound()

  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/resources" className="text-xs font-bold text-primary hover:underline">
          ← All resources
        </Link>
        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-primary">{article.category}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">{article.title}</h1>
        <p className="mt-3 text-sm text-foreground-muted">
          {article.published} · {article.readTime}
        </p>
        <div className="mt-8 space-y-4">
          {article.body.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-7 text-foreground-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </MarketingShell>
  )
}

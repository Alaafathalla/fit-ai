import { Logo } from '@/components/logo'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6" style={{ background: 'var(--background)' }}>
      <div className="max-w-md text-center">
        <div className="flex justify-center"><Logo /></div>
        <p className="mt-10 text-sm font-semibold" style={{ color: 'var(--primary)' }}>404</p>
        <h1 className="mt-2 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>Page not found</h1>
        <p className="mt-3 text-sm leading-6" style={{ color: 'var(--foreground-muted)' }}>
          The page may have moved, or the link is no longer available.
        </p>
        <Link href="/dashboard" className="btn-primary mt-6 gap-2">
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>
      </div>
    </main>
  )
}

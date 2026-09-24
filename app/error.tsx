'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center p-6" style={{ background: 'var(--background)' }}>
      <div className="card max-w-md p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
          <AlertTriangle className="size-5" />
        </span>
        <h1 className="mt-5 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Something went wrong</h1>
        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--foreground-muted)' }}>
          The page could not finish loading. You can retry without losing the rest of the app.
        </p>
        <button onClick={reset} className="btn-primary mt-6 gap-2">
          <RotateCcw className="size-4" /> Try again
        </button>
      </div>
    </main>
  )
}

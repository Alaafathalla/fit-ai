'use client'

import { AuthShell } from '@/components/auth/auth-shell'
import { requestPasswordReset } from '@/lib/auth'
import { AlertCircle, ArrowLeft, ArrowRight, Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const reset = await requestPasswordReset(email)
      setSent(true)
      window.setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(reset.email)}&token=${encodeURIComponent(reset.token)}`)
      }, 900)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start password reset.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email connected to your FitAI account and we’ll start a secure password reset."
      footer={<Link href="/auth/login" className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"><ArrowLeft className="size-3.5" /> Back to sign in</Link>}
    >
      {sent ? (
        <div className="py-5 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-success-light text-success"><ShieldCheck className="size-6" /></div>
          <h2 className="mt-4 text-lg font-bold text-foreground">Reset request confirmed</h2>
          <p className="mt-2 text-sm text-foreground-muted">Preparing your secure reset page…</p>
          <div className="mx-auto mt-5 size-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" /><span>{error}</span>
            </div>
          )}

          <div className="rounded-xl border border-primary/10 bg-primary-light px-4 py-3 text-xs leading-5 text-foreground-muted">
            For your privacy, we use the same response whether or not an email is registered.
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-foreground">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className="input-base h-12 w-full pl-10 pr-4" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary h-12 w-full">
            {loading ? <><span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" /> Sending…</> : <>Continue <ArrowRight className="size-4" /></>}
          </button>
        </form>
      )}
    </AuthShell>
  )
}

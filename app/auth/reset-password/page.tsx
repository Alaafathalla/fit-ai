'use client'

import { AuthShell } from '@/components/auth/auth-shell'
import { PasswordField } from '@/components/auth/password-field'
import { resetPassword } from '@/lib/auth'
import { AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useState } from 'react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get('email') || '')
    setToken(params.get('token') || '')
  }, [])

  const strongEnough = useMemo(
    () => password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password),
    [password]
  )

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (!email || !token) {
      setError('This reset link is incomplete. Request a new password reset.')
      return
    }
    if (!strongEnough) {
      setError('Use at least 8 characters with uppercase, lowercase, and a number.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await resetPassword({ email, token, password })
      setSuccess(true)
      window.setTimeout(() => router.replace('/auth/login'), 1200)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to reset your password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Secure reset"
      title="Choose a new password"
      description="Create a strong password you haven’t used for this account before."
      footer={<Link href="/auth/login" className="font-bold text-primary hover:underline">Return to sign in</Link>}
    >
      {success ? (
        <div className="py-5 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-success-light text-success"><CheckCircle2 className="size-6" /></div>
          <h2 className="mt-4 text-lg font-bold text-foreground">Password updated</h2>
          <p className="mt-2 text-sm text-foreground-muted">Redirecting you to sign in…</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" /><span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-xl bg-background-alt px-4 py-3">
            <div className="grid size-9 place-items-center rounded-lg bg-primary-light text-primary"><ShieldCheck className="size-4" /></div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">Resetting password for</p>
              <p className="truncate text-sm font-bold text-foreground">{email || 'your FitAI account'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-foreground">New password</label>
            <PasswordField value={password} onChange={setPassword} placeholder="Create a new password" autoComplete="new-password" />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-semibold text-foreground">Confirm new password</label>
            <PasswordField id="confirm-password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat new password" autoComplete="new-password" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary h-12 w-full">
            {loading ? <><span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" /> Updating…</> : <>Update password <ArrowRight className="size-4" /></>}
          </button>
        </form>
      )}
    </AuthShell>
  )
}

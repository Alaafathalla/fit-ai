'use client'

import { AuthShell } from '@/components/auth/auth-shell'
import { PasswordField } from '@/components/auth/password-field'
import { RoleSelector } from '@/components/auth/role-selector'
import { getCurrentAuthUser, getRoleHome, registerAccount, type AuthRole } from '@/lib/auth'
import { AlertCircle, ArrowRight, CheckCircle2, Mail, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<AuthRole>('USER')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const current = getCurrentAuthUser()
    if (current) router.replace(getRoleHome(current.role))
  }, [router])

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 8,
      mixed: /[a-z]/.test(password) && /[A-Z]/.test(password),
      number: /\d/.test(password),
    }),
    [password]
  )

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!acceptedTerms) {
      setError('Please accept the Terms and Privacy Policy to continue.')
      return
    }

    setLoading(true)
    try {
      const user = await registerAccount({ name, email, password, role, remember: true })
      router.replace(getRoleHome(user.role))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Start your journey"
      title="Create your FitAI account"
      description="Set up the right workspace for your goals. You can personalize everything after signup."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-primary hover:underline">Sign in</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <RoleSelector value={role} onChange={(nextRole) => { setRole(nextRole); setError('') }} />

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-foreground">Full name</label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
            <input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" autoComplete="name" className="input-base h-12 w-full pl-10 pr-4" required />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-foreground">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className="input-base h-12 w-full pl-10 pr-4" required />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-foreground">Password</label>
            <PasswordField value={password} onChange={setPassword} autoComplete="new-password" />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-semibold text-foreground">Confirm password</label>
            <PasswordField id="confirm-password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat password" autoComplete="new-password" />
          </div>
        </div>

        {password && (
          <div className="grid gap-2 rounded-xl bg-background-alt p-3 sm:grid-cols-3">
            {[
              ['8+ characters', passwordChecks.length],
              ['Upper & lower', passwordChecks.mixed],
              ['At least 1 number', passwordChecks.number],
            ].map(([label, ok]) => (
              <span key={String(label)} className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: ok ? 'var(--success)' : 'var(--foreground-muted)' }}>
                <CheckCircle2 className="size-3.5" /> {String(label)}
              </span>
            ))}
          </div>
        )}

        <label className="flex items-start gap-2.5 text-xs leading-5 text-foreground-muted">
          <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-0.5 size-4 rounded border-border accent-primary" />
          <span>I agree to the Terms of Service and acknowledge the Privacy Policy.</span>
        </label>

        <button type="submit" disabled={loading} className="btn-primary h-12 w-full">
          {loading ? (
            <><span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" /> Creating account…</>
          ) : (
            <>Create {role === 'COACH' ? 'coach' : 'athlete'} account <ArrowRight className="size-4" /></>
          )}
        </button>
      </form>
    </AuthShell>
  )
}

'use client'

import { AuthShell } from '@/components/auth/auth-shell'
import { PasswordField } from '@/components/auth/password-field'
import { RoleSelector } from '@/components/auth/role-selector'
import {
  getCurrentAuthUser,
  getDemoCredentials,
  getRoleHome,
  loginWithPassword,
  type AuthRole,
} from '@/lib/auth'
import { AlertCircle, ArrowRight, KeyRound, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<AuthRole>('USER')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [nextPath, setNextPath] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setNextPath(params.get('next') || '')
    if (params.get('role')?.toLowerCase() === 'coach') setRole('COACH')
    if (params.get('role')?.toLowerCase() === 'user') setRole('USER')

    const current = getCurrentAuthUser()
    if (current) router.replace(getRoleHome(current.role))
  }, [router])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await loginWithPassword({ email, password, role, remember })
      const safeNext = nextPath.startsWith('/') && !nextPath.startsWith('/auth/') ? nextPath : ''
      router.replace(safeNext || getRoleHome(user.role))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    const demo = getDemoCredentials(role)
    setEmail(demo.email)
    setPassword(demo.password)
    setError('')
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to FitAI"
      description="Choose how you use FitAI, then continue to your personalized workspace."
      footer={
        <>
          New to FitAI?{' '}
          <Link href="/auth/register" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
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
          <label htmlFor="email" className="text-sm font-semibold text-foreground">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={role === 'COACH' ? 'coach@example.com' : 'you@example.com'}
              autoComplete="email"
              className="input-base h-12 w-full pl-10 pr-4"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="password" className="text-sm font-semibold text-foreground">Password</label>
            <Link href="/auth/forgot-password" className="text-xs font-bold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordField value={password} onChange={setPassword} />
        </div>

        <label className="flex items-center gap-2.5 text-sm text-foreground-muted">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="size-4 rounded border-border accent-primary"
          />
          Keep me signed in on this device
        </label>

        <button type="submit" disabled={loading} className="btn-primary h-12 w-full text-sm">
          {loading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              Signing in…
            </>
          ) : (
            <>
              Continue as {role === 'COACH' ? 'coach' : 'athlete'}
              <ArrowRight className="size-4" />
            </>
          )}
        </button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">Demo access</span></div>
        </div>

        <button
          type="button"
          onClick={fillDemo}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background-alt px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-primary-light"
        >
          <KeyRound className="size-4 text-primary" />
          Use {role === 'COACH' ? 'coach' : 'athlete'} demo credentials
        </button>
      </form>
    </AuthShell>
  )
}

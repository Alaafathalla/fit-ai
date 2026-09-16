'use client'

import { Shell } from '@/components/shell'
import { useTheme } from '@/components/theme-provider'
import { getUserProfile, updateUserProfile, type UserProfile } from '@/lib/api'
import { Check, Loader2, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()

  const [user, setUser]     = useState<UserProfile | null>(null)
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [goal, setGoal]     = useState('')
  const [saved, setSaved]   = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const [notifications, setNotifications] = useState({
    workouts:  true,
    nutrition: true,
    coach:     false,
  })

  useEffect(() => {
    getUserProfile().then((u) => {
      setUser(u)
      setName(u.name)
      setEmail(u.email)
      setGoal(u.goal)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await updateUserProfile({ name, email, goal })
      setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const NOTIFICATION_LABELS: Record<
    keyof typeof notifications,
    { title: string; desc: string }
  > = {
    workouts:  { title: 'Workout reminders', desc: "Get reminded when it's time to train" },
    nutrition: { title: 'Meal logging',      desc: 'Reminders to log your meals'         },
    coach:     { title: 'AI Coach tips',     desc: 'Weekly insights from your AI coach'  },
  }

  return (
    <Shell title="Settings">
      <div className="mx-auto max-w-2xl space-y-6 p-5 sm:p-8">

        {/* Hero */}
        <div className="animate-fade-up">
          <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            Your account
          </p>
          <h2
            className="mt-1.5 text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Settings
          </h2>
        </div>

        {/* Profile */}
        <section className="animate-fade-up card space-y-5 p-6" style={{ animationDelay: '60ms' }}>
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Profile</h3>

          {user && (
            <div className="flex items-center gap-4">
              <div
                className="grid size-16 place-items-center rounded-full text-xl font-bold"
                style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
              >
                {user.avatarInitials}
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{user.name}</p>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>{user.email}</p>
                <span className="badge badge-primary mt-1">{user.plan} plan</span>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Display name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-base w-full px-3.5 py-2.5"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base w-full px-3.5 py-2.5"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Fitness goal
              </label>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="input-base w-full px-3.5 py-2.5"
              />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="animate-fade-up card space-y-4 p-6" style={{ animationDelay: '120ms' }}>
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Theme</p>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                Currently {theme === 'dark' ? 'dark' : 'light'} mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors active:scale-95"
              style={{
                background: 'var(--background-alt)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              }}
            >
              {theme === 'dark'
                ? <Sun  className="size-4" />
                : <Moon className="size-4" />}
              Switch to {theme === 'dark' ? 'light' : 'dark'}
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="animate-fade-up card space-y-4 p-6" style={{ animationDelay: '160ms' }}>
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Notifications</h3>
          {(Object.keys(notifications) as (keyof typeof notifications)[]).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  {NOTIFICATION_LABELS[key].title}
                </p>
                <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                  {NOTIFICATION_LABELS[key].desc}
                </p>
              </div>
              <button
                role="switch"
                aria-checked={notifications[key]}
                onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                className="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors active:scale-95"
                style={{ background: notifications[key] ? 'var(--primary)' : 'var(--border)' }}
              >
                <span
                  className="pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm transition-transform"
                  style={{ transform: notifications[key] ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          ))}
        </section>

        {/* Plan */}
        <section className="animate-fade-up card space-y-4 p-6" style={{ animationDelay: '200ms' }}>
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Your plan</h3>
          <div
            className="flex items-center justify-between rounded-xl p-4"
            style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}
          >
            <div>
              <p className="font-semibold" style={{ color: 'var(--primary)' }}>
                {user?.plan ?? 'Pro'} Plan
              </p>
              <p className="text-xs" style={{ color: 'var(--primary)', opacity: 0.75 }}>
                All features unlocked
              </p>
            </div>
            <button
              className="rounded-xl px-4 py-2 text-sm font-semibold active:scale-95"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Upgrade to Elite
            </button>
          </div>
        </section>

        {/* Save */}
        {error && (
          <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary gap-2 disabled:opacity-60"
          >
            {saving
              ? <><Loader2 className="size-4 animate-spin" /> Saving…</>
              : saved
                ? <><Check className="size-4" /> Saved!</>
                : 'Save changes'}
          </button>
        </div>
      </div>
    </Shell>
  )
}

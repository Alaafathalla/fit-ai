'use client'

import { Shell } from '@/components/shell'
import { useTheme } from '@/components/theme-provider'
import { getUserProfile, updateUserProfile, type UserProfile } from '@/lib/api'
import { Check, Loader2, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const NOTIFICATION_LABELS = {
  workouts:  { title: 'Workout reminders',  desc: "Get reminded when it's time to train"   },
  nutrition: { title: 'Meal logging',        desc: 'Reminders to log your meals'            },
  coach:     { title: 'AI Coach tips',       desc: 'Weekly insights from your AI coach'    },
} as const

type NotifKey = keyof typeof NOTIFICATION_LABELS

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()

  const [user,          setUser]          = useState<UserProfile | null>(null)
  const [name,          setName]          = useState('')
  const [email,         setEmail]         = useState('')
  const [goal,          setGoal]          = useState('')
  const [currentWeight, setCurrentWeight] = useState('')
  const [targetWeight,  setTargetWeight]  = useState('')
  const [saved,         setSaved]         = useState(false)
  const [saving,        setSaving]        = useState(false)
  const [error,         setError]         = useState('')

  const [notifications, setNotifications] = useState<Record<NotifKey, boolean>>({
    workouts: true, nutrition: true, coach: false,
  })
  const [notifReady, setNotifReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('fitai-notifications')
    if (stored) {
      try { setNotifications((c) => ({ ...c, ...JSON.parse(stored) })) } catch {}
    }
    setNotifReady(true)
  }, [])

  useEffect(() => {
    if (!notifReady) return
    localStorage.setItem('fitai-notifications', JSON.stringify(notifications))
  }, [notifications, notifReady])

  useEffect(() => {
    getUserProfile().then((u) => {
      setUser(u); setName(u.name); setEmail(u.email); setGoal(u.goal)
      setCurrentWeight(String(u.currentWeight || '')); setTargetWeight(String(u.targetWeight || ''))
    }).catch(() => setError('Failed to load profile.'))
  }, [])

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const cw = Number(currentWeight); const tw = Number(targetWeight)
      await updateUserProfile({
        name, email, goal,
        currentWeight: Number.isFinite(cw) && cw > 0 ? cw : undefined,
        targetWeight:  Number.isFinite(tw) && tw > 0 ? tw : undefined,
      })
      setSaved(true)
      setUser((u) => u ? { ...u, name, email, goal,
        currentWeight: cw > 0 ? cw : u.currentWeight,
        targetWeight:  tw > 0 ? tw : u.targetWeight,
      } : u)
      setTimeout(() => setSaved(false), 2200)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.')
    } finally { setSaving(false) }
  }

  const FIELD_CLS = 'input-base w-full px-4 py-2.5'

  return (
    <Shell title="Settings">
      <div className="mx-auto max-w-2xl space-y-5 p-5 sm:p-8">

        {/* Hero */}
        <div className="animate-fade-up">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
            Your account
          </p>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>Settings</h2>
        </div>

        {/* Profile */}
        <section className="animate-fade-up card space-y-5 p-6" style={{ animationDelay: '60ms' }}>
          <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Profile</h3>

          {user && (
            <div className="flex items-center gap-4">
              <div
                className="grid size-16 shrink-0 place-items-center rounded-2xl text-xl font-black"
                style={{ background: 'var(--gradient-hero)', color: '#fff' }}
              >
                {user.avatarInitials}
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--foreground)' }}>{user.name}</p>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>{user.email}</p>
                <span className="badge badge-primary mt-1.5">{user.plan} plan</span>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Display name', value: name, setter: setName, type: 'text', autoComplete: 'name' },
              { label: 'Email', value: email, setter: setEmail, type: 'email', autoComplete: 'email' },
            ].map(({ label, value, setter, type, autoComplete }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{label}</label>
                <input
                  type={type}
                  autoComplete={autoComplete}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className={FIELD_CLS}
                />
              </div>
            ))}

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Fitness goal</label>
              <input value={goal} onChange={(e) => setGoal(e.target.value)} className={FIELD_CLS} />
            </div>

            {[
              { label: 'Current weight (kg)', value: currentWeight, setter: setCurrentWeight },
              { label: 'Target weight (kg)',  value: targetWeight,  setter: setTargetWeight  },
            ].map(({ label, value, setter }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{label}</label>
                <input
                  type="number" min="20" max="500" step="0.1"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className={FIELD_CLS}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Appearance */}
        <section className="animate-fade-up card space-y-4 p-6" style={{ animationDelay: '100ms' }}>
          <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Theme</p>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                Currently {theme === 'dark' ? 'dark' : 'light'} mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95"
              style={{ background: 'var(--background-alt)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              Switch to {theme === 'dark' ? 'light' : 'dark'}
            </button>
          </div>

          {/* Theme preview swatches */}
          <div className="flex gap-2">
            {['var(--primary)', 'var(--accent)', 'var(--success)', 'var(--warning)', 'var(--danger)'].map((c) => (
              <div key={c} className="size-6 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="animate-fade-up card space-y-4 p-6" style={{ animationDelay: '140ms' }}>
          <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Notifications</h3>
          {(Object.keys(notifications) as NotifKey[]).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
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
                className="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-all duration-200 active:scale-95"
                style={{
                  background: notifications[key] ? 'var(--gradient-hero)' : 'var(--border)',
                  boxShadow: notifications[key] ? '0 2px 8px rgba(79,95,237,0.4)' : 'none',
                }}
              >
                <span
                  className="pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                  style={{ transform: notifications[key] ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          ))}
        </section>

        {/* Plan */}
        <section className="animate-fade-up card space-y-4 p-6" style={{ animationDelay: '180ms' }}>
          <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Your plan</h3>
          <div
            className="flex items-center justify-between rounded-2xl p-4"
            style={{
              background: 'color-mix(in srgb, var(--primary) 8%, var(--background-alt))',
              border: '1px solid color-mix(in srgb, var(--primary) 30%, var(--border))',
            }}
          >
            <div>
              <p className="font-bold" style={{ color: 'var(--primary)' }}>{user?.plan ?? 'Pro'} Plan</p>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>All features unlocked</p>
            </div>
            <Link
              href="/plans"
              className="rounded-xl px-4 py-2 text-sm font-bold text-white"
              style={{ background: 'var(--gradient-hero)' }}
            >
              View plans
            </Link>
          </div>
        </section>

        {/* Save */}
        {error && (
          <p className="rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
            {error}
          </p>
        )}
        <div className="flex justify-end pb-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary gap-2 px-6 py-3 disabled:opacity-60"
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

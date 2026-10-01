'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getDailyStats, type DailyStats } from '@/lib/api'
import {
  Activity,
  BatteryCharging,
  BedDouble,
  Droplets,
  HeartPulse,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

function clamp(v: number) { return Math.max(0, Math.min(100, Math.round(v))) }
function avg(arr: number[]) { return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0 }

export function RecoveryPage() {
  const [stats,   setStats]   = useState<DailyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getDailyStats(14)
      .then(setStats)
      .catch(() => setError('Could not load recovery data.'))
      .finally(() => setLoading(false))
  }, [])

  const recovery = useMemo(() => {
    if (!stats.length) return null
    const latest = stats[stats.length - 1]
    const recent = stats.slice(-7)

    const sleepScore     = clamp((latest.sleepHours / 8) * 100)
    const hydrationScore = clamp((latest.hydration / 2500) * 100)
    const loadScore      = latest.workoutMinutes <= 60 ? 100 : clamp(130 - latest.workoutMinutes * 0.7)
    const readiness      = clamp(sleepScore * 0.45 + hydrationScore * 0.35 + loadScore * 0.2)

    return {
      latest,
      avgSleep:      avg(recent.map((s) => s.sleepHours)),
      avgHydration:  avg(recent.map((s) => s.hydration)),
      avgLoad:       avg(recent.map((s) => s.workoutMinutes)),
      sleepScore, hydrationScore, loadScore, readiness,
    }
  }, [stats])

  const readinessColor = recovery
    ? recovery.readiness >= 80 ? 'var(--success)'
    : recovery.readiness >= 60 ? 'var(--warning)'
    : 'var(--danger)'
    : 'var(--primary)'

  const readinessLabel = recovery
    ? recovery.readiness >= 80 ? 'Ready to train'
    : recovery.readiness >= 60 ? 'Moderate'
    : 'Prioritise recovery'
    : ''

  const recommendation = recovery
    ? recovery.readiness >= 80
      ? 'Your body is primed. A full-intensity session is appropriate today — stay focused and execute.'
      : recovery.readiness >= 60
        ? 'You are moderately recovered. Keep intensity moderate, extend your warm-up, and monitor how you feel.'
        : 'Recovery is the priority. Choose mobility, easy cardio, focus on hydration, and aim for an earlier bedtime.'
    : ''

  return (
    <Shell title="Recovery">
      <div className="p-5 sm:p-8">

        {/* Hero */}
        <div className="animate-fade-up mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
            Train smarter
          </p>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Recovery &amp; readiness
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Balance training load with sleep and hydration before deciding how hard to push.
          </p>
        </div>

        {loading ? <Spinner label="Calculating readiness…" /> : error ? (
          <div className="card p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : recovery ? (
          <>
            {/* Top row */}
            <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">

              {/* Readiness score card */}
              <section
                className="animate-fade-up relative overflow-hidden rounded-2xl p-6 sm:p-8"
                style={{
                  background: `linear-gradient(145deg, color-mix(in srgb, ${readinessColor} 12%, var(--card)), var(--card))`,
                  border: `1px solid color-mix(in srgb, ${readinessColor} 30%, var(--border))`,
                  boxShadow: `var(--shadow-lg), 0 0 40px color-mix(in srgb, ${readinessColor} 12%, transparent)`,
                }}
              >
                {/* Background glow */}
                <div
                  className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-20"
                  style={{ background: `radial-gradient(circle, ${readinessColor}, transparent)` }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div
                      className="icon-box size-12"
                      style={{ background: `color-mix(in srgb, ${readinessColor} 18%, var(--background-alt))`, color: readinessColor }}
                    >
                      <BatteryCharging className="size-5" />
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: `color-mix(in srgb, ${readinessColor} 15%, transparent)`,
                        color: readinessColor,
                      }}
                    >
                      {readinessLabel}
                    </span>
                  </div>

                  <p className="mt-8 text-sm font-semibold" style={{ color: 'var(--foreground-muted)' }}>Readiness score</p>
                  <div className="mt-1 flex items-end gap-2">
                    <strong className="text-7xl font-black tracking-tight" style={{ color: readinessColor }}>
                      {recovery.readiness}
                    </strong>
                    <span className="mb-2 text-xl font-semibold" style={{ color: 'var(--foreground-muted)' }}>/100</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 h-3 overflow-hidden rounded-full" style={{ background: 'var(--background-alt)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${recovery.readiness}%`,
                        background: `linear-gradient(90deg, ${readinessColor}, color-mix(in srgb, ${readinessColor} 60%, #fff))`,
                        boxShadow: `0 0 10px ${readinessColor}`,
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* Sub-metric cards */}
              <section className="animate-fade-up grid gap-4 sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
                {[
                  {
                    label: 'Sleep',
                    value: `${recovery.latest.sleepHours} h`,
                    meta: `${recovery.avgSleep.toFixed(1)} h weekly avg`,
                    score: recovery.sleepScore,
                    icon: BedDouble,
                    color: '#7c3aed',
                  },
                  {
                    label: 'Hydration',
                    value: `${recovery.latest.hydration.toLocaleString()} ml`,
                    meta: `${Math.round(recovery.avgHydration).toLocaleString()} ml avg`,
                    score: recovery.hydrationScore,
                    icon: Droplets,
                    color: '#06b6d4',
                  },
                  {
                    label: 'Training load',
                    value: `${recovery.latest.workoutMinutes} min`,
                    meta: `${Math.round(recovery.avgLoad)} min/day avg`,
                    score: recovery.loadScore,
                    icon: Activity,
                    color: '#4f5fed',
                  },
                ].map(({ label, value, meta, score, icon: Icon, color }) => (
                  <div key={label} className="card p-5">
                    <div
                      className="icon-box size-10"
                      style={{ background: `color-mix(in srgb, ${color} 15%, var(--background-alt))`, color }}
                    >
                      <Icon className="size-4" />
                    </div>
                    <p className="mt-4 text-xs font-semibold" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                    <p className="mt-0.5 text-xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
                    <p className="mt-0.5 text-[11px]" style={{ color: 'var(--foreground-muted)' }}>{meta}</p>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--background-alt)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${score}%`, background: color }}
                      />
                    </div>
                    <p className="mt-1 text-right text-[11px] font-bold" style={{ color }}>{score}%</p>
                  </div>
                ))}
              </section>
            </div>

            {/* Recommendation + targets */}
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="animate-fade-up card p-6" style={{ animationDelay: '120ms' }}>
                <div className="flex items-start gap-4">
                  <div className="icon-box size-11 shrink-0" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Today's recommendation</h3>
                    <p className="mt-2 text-sm leading-7" style={{ color: 'var(--foreground-muted)' }}>{recommendation}</p>
                  </div>
                </div>
              </section>

              <section className="animate-fade-up card p-6" style={{ animationDelay: '160ms' }}>
                <div className="flex items-center gap-3 mb-5">
                  <HeartPulse className="size-5" style={{ color: 'var(--primary)' }} />
                  <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Recovery targets</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Sleep',    target: '7.5–9 hours',   icon: BedDouble, color: '#7c3aed' },
                    { label: 'Water',    target: '2.5 L or more', icon: Droplets,  color: '#06b6d4' },
                    { label: 'Rest',     target: '1–2 days/week', icon: Activity,  color: '#4f5fed' },
                  ].map(({ label, target, icon: Icon, color }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--background-alt)' }}>
                      <div
                        className="icon-box size-8 shrink-0"
                        style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
                      >
                        <Icon className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{target}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="card p-12 text-center text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Add daily stats to see your recovery score.
          </div>
        )}
      </div>
    </Shell>
  )
}

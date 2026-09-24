'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getDailyStats, type DailyStats } from '@/lib/api'
import { Activity, BatteryCharging, BedDouble, Droplets, HeartPulse, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
}

export default function RecoveryPage() {
  const [stats, setStats] = useState<DailyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    const avgSleep = average(recent.map((item) => item.sleepHours))
    const avgHydration = average(recent.map((item) => item.hydration))
    const avgLoad = average(recent.map((item) => item.workoutMinutes))

    const sleepScore = clamp((latest.sleepHours / 8) * 100)
    const hydrationScore = clamp((latest.hydration / 2500) * 100)
    const loadScore = latest.workoutMinutes <= 60 ? 100 : clamp(130 - latest.workoutMinutes * 0.7)
    const readiness = clamp(sleepScore * 0.45 + hydrationScore * 0.35 + loadScore * 0.2)

    return { latest, avgSleep, avgHydration, avgLoad, sleepScore, hydrationScore, loadScore, readiness }
  }, [stats])

  const recommendation = recovery
    ? recovery.readiness >= 80
      ? 'You are well recovered. A normal or higher-intensity training session fits today.'
      : recovery.readiness >= 60
        ? 'You are moderately recovered. Keep intensity controlled and add a longer warm-up.'
        : 'Recovery is the priority today. Choose mobility, easy cardio, hydration, and an earlier bedtime.'
    : ''

  return (
    <Shell title="Recovery">
      <div className="p-5 sm:p-8">
        <div className="animate-fade-up mb-8">
          <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Train smarter</p>
          <h2 className="mt-1.5 text-3xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Recovery & readiness
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Balance training load with sleep and hydration before deciding how hard to push.
          </p>
        </div>

        {loading ? <Spinner label="Calculating recovery…" /> : error ? (
          <div className="card p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : recovery ? (
          <>
            <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
              <section className="animate-fade-up card relative overflow-hidden p-6 sm:p-7">
                <div className="absolute -right-12 -top-12 size-44 rounded-full" style={{ background: 'var(--primary-light)', filter: 'blur(2px)' }} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl" style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
                      <BatteryCharging className="size-5" />
                    </span>
                    <span className={`badge ${recovery.readiness >= 80 ? 'badge-success' : recovery.readiness >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                      {recovery.readiness >= 80 ? 'Ready' : recovery.readiness >= 60 ? 'Moderate' : 'Recover'}
                    </span>
                  </div>
                  <p className="mt-8 text-sm font-medium" style={{ color: 'var(--foreground-muted)' }}>Readiness score</p>
                  <div className="mt-1 flex items-end gap-2">
                    <strong className="text-6xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>{recovery.readiness}</strong>
                    <span className="mb-2 text-lg" style={{ color: 'var(--foreground-muted)' }}>/100</span>
                  </div>
                  <div className="mt-6 h-2.5 overflow-hidden rounded-full" style={{ background: 'var(--background-alt)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${recovery.readiness}%`, background: 'var(--primary)' }} />
                  </div>
                </div>
              </section>

              <section className="animate-fade-up grid gap-4 sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
                {[
                  { label: 'Sleep', value: `${recovery.latest.sleepHours} h`, meta: `${recovery.avgSleep.toFixed(1)} h weekly avg`, score: recovery.sleepScore, icon: BedDouble },
                  { label: 'Hydration', value: `${recovery.latest.hydration.toLocaleString()} ml`, meta: `${Math.round(recovery.avgHydration).toLocaleString()} ml avg`, score: recovery.hydrationScore, icon: Droplets },
                  { label: 'Training load', value: `${recovery.latest.workoutMinutes} min`, meta: `${Math.round(recovery.avgLoad)} min/day avg`, score: recovery.loadScore, icon: Activity },
                ].map(({ label, value, meta, score, icon: Icon }) => (
                  <div key={label} className="card p-5">
                    <span className="grid size-10 place-items-center rounded-xl" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      <Icon className="size-4" />
                    </span>
                    <p className="mt-5 text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                    <p className="mt-1 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>{value}</p>
                    <p className="mt-1 text-[11px]" style={{ color: 'var(--foreground-muted)' }}>{meta}</p>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--background-alt)' }}>
                      <div className="h-full rounded-full" style={{ width: `${score}%`, background: 'var(--primary)' }} />
                    </div>
                  </div>
                ))}
              </section>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="animate-fade-up card p-6" style={{ animationDelay: '120ms' }}>
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    <Sparkles className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Today’s recommendation</h3>
                    <p className="mt-2 text-sm leading-6" style={{ color: 'var(--foreground-muted)' }}>{recommendation}</p>
                  </div>
                </div>
              </section>

              <section className="animate-fade-up card p-6" style={{ animationDelay: '160ms' }}>
                <div className="flex items-center gap-3">
                  <HeartPulse className="size-5" style={{ color: 'var(--primary)' }} />
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Recovery targets</h3>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    ['Sleep', '7.5–9h'],
                    ['Water', '2.5L+'],
                    ['Rest', '1–2 days'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl p-3" style={{ background: 'var(--background-alt)' }}>
                      <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                      <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="card p-10 text-center text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Add daily stats to see your recovery score.
          </div>
        )}
      </div>
    </Shell>
  )
}

'use client'

import { Shell } from '@/components/shell'
import { CardSkeleton } from '@/components/ui/skeleton'
import { getDailyStats, getProgressMetrics, getUserProfile, type DailyStats, type ProgressMetric, type UserProfile } from '@/lib/api'
import { Download, FileBarChart, Moon, Footprints, Flame } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export function ReportsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<DailyStats[]>([])
  const [metrics, setMetrics] = useState<ProgressMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getUserProfile(), getDailyStats(14), getProgressMetrics(14)])
      .then(([profile, daily, progress]) => {
        setUser(profile)
        setStats(daily)
        setMetrics(progress)
      })
      .catch(() => setError('Could not load this week’s report.'))
      .finally(() => setLoading(false))
  }, [])

  const summary = useMemo(() => {
    if (!stats.length) {
      return { minutes: 0, steps: 0, sleep: 0, calories: 0 }
    }
    const minutes = stats.reduce((sum, day) => sum + day.workoutMinutes, 0)
    const steps = stats.reduce((sum, day) => sum + day.steps, 0)
    const sleep = stats.reduce((sum, day) => sum + day.sleepHours, 0) / stats.length
    const calories = stats.reduce((sum, day) => sum + day.calories, 0) / stats.length
    return { minutes, steps, sleep, calories }
  }, [stats])

  return (
    <Shell title="Weekly report" subtitle="Analytics">
      <div className="mx-auto max-w-5xl space-y-5 p-5 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Performance summary</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight">Last 14 days</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              {user ? `${user.name} · ${user.plan} plan` : 'Loading athlete profile'}
            </p>
          </div>
          <button
            type="button"
            className="btn-outline !text-xs !font-bold"
            onClick={() => window.print()}
          >
            <Download className="size-3.5" /> Export / print
          </button>
        </div>

        {error && (
          <p className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">{error}</p>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Training minutes', value: `${summary.minutes}`, icon: FileBarChart },
              { label: 'Avg calories / day', value: `${Math.round(summary.calories)}`, icon: Flame },
              { label: 'Total steps', value: summary.steps.toLocaleString(), icon: Footprints },
              { label: 'Avg sleep', value: `${summary.sleep.toFixed(1)}h`, icon: Moon },
            ].map((item) => (
              <article key={item.label} className="card p-5">
                <span className="icon-box size-9 bg-primary-light text-primary">
                  <item.icon className="size-4" />
                </span>
                <p className="mt-4 text-xs font-semibold text-foreground-muted">{item.label}</p>
                <p className="mt-1 text-2xl font-black">{item.value}</p>
              </article>
            ))}
          </div>
        )}

        <section className="card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-bold">Daily log</h3>
            <p className="text-xs text-foreground-muted">Weight, training time, steps, sleep, and hydration.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-background-alt text-[11px] uppercase tracking-wider text-foreground-muted">
                <tr>
                  {['Date', 'Weight', 'Minutes', 'Steps', 'Sleep', 'Hydration'].map((h) => (
                    <th key={h} className="px-5 py-3 font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.map((day) => (
                  <tr key={day.date} className="border-t border-border/70">
                    <td className="px-5 py-3 font-semibold">{day.date}</td>
                    <td className="px-5 py-3">{day.weight} kg</td>
                    <td className="px-5 py-3">{day.workoutMinutes}</td>
                    <td className="px-5 py-3">{day.steps.toLocaleString()}</td>
                    <td className="px-5 py-3">{day.sleepHours}h</td>
                    <td className="px-5 py-3">{day.hydration}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {metrics.map((metric) => (
            <article key={metric.label} className="card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted">{metric.label}</p>
              <p className="mt-2 text-2xl font-black">{metric.current}</p>
              <p className={`mt-1 text-xs font-bold ${metric.positive ? 'text-success' : 'text-danger'}`}>
                {metric.change} vs {metric.previous}
              </p>
            </article>
          ))}
        </section>
      </div>
    </Shell>
  )
}

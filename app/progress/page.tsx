'use client'

import { ActivityHeatmap, WeightSparkline } from '@/components/charts'
import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import {
  getDailyStats,
  getProgressMetrics,
  getUserProfile,
  getWeeklyProgress,
  type DailyStats,
  type ProgressMetric,
  type UserProfile,
  type WeeklyProgress,
} from '@/lib/api'
import { Activity, Dumbbell, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ProgressPage() {
  const [user, setUser]         = useState<UserProfile | null>(null)
  const [metrics, setMetrics]   = useState<ProgressMetric[]>([])
  const [stats, setStats]       = useState<DailyStats[]>([])
  const [progress, setProgress] = useState<WeeklyProgress[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    Promise.all([getUserProfile(), getProgressMetrics(), getDailyStats(), getWeeklyProgress()])
      .then(([u, m, s, p]) => {
        setUser(u); setMetrics(m); setStats(s); setProgress(p)
      })
      .catch(() => setError('Could not load progress data. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const totalSteps      = progress.reduce((s, p) => s + p.steps, 0)
  const totalWorkoutMin = progress.reduce((s, p) => s + p.workoutMinutes, 0)
  const weightDelta     = stats.length > 1 ? stats[stats.length - 1].weight - stats[0].weight : 0
  const avgSleep        = stats.length
    ? (stats.reduce((s, d) => s + d.sleepHours, 0) / stats.length).toFixed(1)
    : '—'

  return (
    <Shell title="Progress">
      <div className="p-5 sm:p-8">

        {/* Hero */}
        <div className="mb-8">
          <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            Track your transformation
          </p>
          <h2
            className="mt-1.5 text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Your progress
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Data-driven insights to keep you moving forward.
          </p>
        </div>

        {loading ? <Spinner label="Crunching your data…" /> : error ? (
          <div className="card p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            {/* Weekly summary */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Steps this week',  value: totalSteps.toLocaleString(), icon: Activity, bg: 'var(--primary-light)', color: 'var(--primary)' },
                { label: 'Workout minutes',  value: `${totalWorkoutMin} min`,    icon: Dumbbell, bg: 'var(--success-light)', color: 'var(--success)' },
                { label: 'Avg sleep / night',value: `${avgSleep} hrs`,           icon: Zap,      bg: 'var(--accent-light)',  color: 'var(--accent)'  },
              ].map(({ label, value, icon: Icon, bg, color }) => (
                <div key={label} className="card flex items-center gap-4 p-5">
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-xl"
                    style={{ background: bg, color }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                    <p className="mt-0.5 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Weight trend chart */}
            <div className="mb-6 card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    Weight trend
                  </h3>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                    Last 7 days
                  </p>
                </div>
                {stats.length > 1 && (
                  <span className="text-sm font-semibold" style={{ color: weightDelta <= 0 ? 'var(--success)' : 'var(--warning)' }}>
                    {weightDelta < 0 ? '↓' : weightDelta > 0 ? '↑' : '→'} {Math.abs(weightDelta).toFixed(1)} kg
                  </span>
                )}
              </div>
              <WeightSparkline stats={stats} />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Start',   value: `${stats[0]?.weight ?? '—'} kg` },
                  { label: 'Current', value: `${stats[stats.length - 1]?.weight ?? '—'} kg` },
                  { label: 'Target',  value: `${user?.targetWeight ?? 75} kg` },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3 text-center"
                    style={{ background: 'var(--background-alt)' }}
                  >
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                    <p className="mt-1 font-semibold" style={{ color: 'var(--foreground)' }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step activity heatmap */}
            <div className="mb-6 card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    Step activity
                  </h3>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                    Daily step intensity
                  </p>
                </div>
                <Activity className="size-5" style={{ color: 'var(--primary)' }} />
              </div>
              <ActivityHeatmap progress={progress} />
            </div>

            {/* Body metrics grid */}
            <h3 className="mb-4 font-semibold" style={{ color: 'var(--foreground)' }}>
              Body metrics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((m) => (
                <div key={m.label} className="card p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      {m.label}
                    </p>
                    <span
                      className="badge"
                      style={
                        m.positive
                          ? { background: 'var(--success-light)', color: 'var(--success)' }
                          : { background: 'var(--danger-light)',  color: 'var(--danger)'  }
                      }
                    >
                      {m.positive
                        ? <TrendingUp   className="mr-1 inline size-3" />
                        : <TrendingDown className="mr-1 inline size-3" />}
                      {m.change}
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>
                    {m.current}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                    Previously: {m.previous}
                  </p>
                </div>
              ))}
            </div>

            {/* Daily log table */}
            <div className="mt-6 card overflow-hidden">
              <div
                className="flex items-center justify-between p-5"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  Daily log
                </h3>
                <span className="badge badge-primary">Last 7 days</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--background-alt)' }}>
                      {['Date', 'Weight', 'Calories', 'Steps', 'Workout', 'Sleep'].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-semibold"
                          style={{ color: 'var(--foreground-muted)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...stats].reverse().map((d, i) => (
                      <tr
                        key={d.date}
                        style={{
                          borderBottom: i < stats.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                          background: i === 0 ? 'var(--primary-light)' : 'transparent',
                        }}
                      >
                        <td className="px-5 py-3 font-medium" style={{ color: 'var(--foreground)' }}>
                          {i === 0 ? (
                            <span className="flex items-center gap-1.5">
                              {d.date.slice(5)}
                              <span className="badge badge-primary">Today</span>
                            </span>
                          ) : d.date.slice(5)}
                        </td>
                        <td className="px-5 py-3" style={{ color: 'var(--foreground)' }}>
                          {d.weight} kg
                        </td>
                        <td className="px-5 py-3">
                          <span
                            style={{
                              color: d.calories > d.calorieGoal
                                ? 'var(--warning)'
                                : 'var(--foreground)',
                            }}
                          >
                            {d.calories.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-5 py-3" style={{ color: 'var(--foreground)' }}>
                          {d.steps.toLocaleString()}
                        </td>
                        <td className="px-5 py-3">
                          {d.workoutMinutes > 0 ? (
                            <span className="badge badge-success">{d.workoutMinutes} min</span>
                          ) : (
                            <span style={{ color: 'var(--foreground-muted)' }}>Rest</span>
                          )}
                        </td>
                        <td className="px-5 py-3" style={{ color: 'var(--foreground)' }}>
                          {d.sleepHours}h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}

'use client'

import { ActivityHeatmap, WeightSparkline } from '@/components/charts'
import { EmptyState } from '@/components/empty-state'
import { Shell } from '@/components/shell'
import { CardSkeleton, ChartSkeleton } from '@/components/ui/skeleton'
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
import {
  Activity,
  BedDouble,
  Calendar,
  Dumbbell,
  Footprints,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const PERIODS = [
  { id: '7d', label: '7 Days', days: 7 },
  { id: '30d', label: '30 Days', days: 30 },
  { id: '90d', label: '90 Days', days: 90 },
  { id: 'all', label: 'All Time', days: 180 },
]

export function ProgressPage() {
  const [period, setPeriod] = useState('7d')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [metrics, setMetrics] = useState<ProgressMetric[]>([])
  const [stats, setStats] = useState<DailyStats[]>([])
  const [progress, setProgress] = useState<WeeklyProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [periodLoading, setPeriodLoading] = useState(false)
  const [error, setError] = useState('')

  const loadData = async (selectedPeriod: string, initial = false) => {
    if (initial) setLoading(true)
    else setPeriodLoading(true)
    setError('')

    const daysCount = PERIODS.find((p) => p.id === selectedPeriod)?.days || 7

    try {
      const [u, m, s, p] = await Promise.all([
        getUserProfile(),
        getProgressMetrics(daysCount),
        getDailyStats(daysCount),
        getWeeklyProgress(daysCount),
      ])
      setUser(u)
      setMetrics(m)
      setStats(s)
      setProgress(p)
    } catch {
      setError('Could not load progress data.')
    } finally {
      setLoading(false)
      setPeriodLoading(false)
    }
  }

  useEffect(() => {
    loadData('7d', true)
  }, [])

  const handlePeriodChange = (newPeriod: string) => {
    if (newPeriod === period) return
    setPeriod(newPeriod)
    loadData(newPeriod, false)
  }

  const totalSteps = progress.reduce((s, p) => s + p.steps, 0)
  const totalWorkoutMin = progress.reduce((s, p) => s + p.workoutMinutes, 0)
  const avgSleep = stats.length
    ? (stats.reduce((s, d) => s + d.sleepHours, 0) / stats.length).toFixed(1)
    : '—'
  const weightDelta =
    stats.length > 1 ? stats[stats.length - 1].weight - stats[0].weight : 0

  const activePeriodObj = PERIODS.find((p) => p.id === period) || PERIODS[0]

  return (
    <Shell title="Progress">
      <div className="p-5 sm:p-8">
        {/* Hero & Period Tabs */}
        <div className="animate-fade-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
              Track your transformation
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Your progress
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              Data-driven insights to keep you moving forward.
            </p>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1 shadow-xs">
            <Calendar className="ml-2 size-4 text-foreground-muted" />
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePeriodChange(p.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  period === p.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-foreground-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <ChartSkeleton height="h-64" />
            <ChartSkeleton height="h-48" />
          </div>
        ) : error ? (
          <div className="card p-8 text-center text-sm text-danger">{error}</div>
        ) : (
          <div className={`transition-opacity duration-200 ${periodLoading ? 'opacity-50' : 'opacity-100'}`}>
            {/* Period summary */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: `Steps (${activePeriodObj.label})`,
                  value: totalSteps.toLocaleString(),
                  icon: Footprints,
                  gradient: '#2563eb',
                },
                {
                  label: 'Workout minutes',
                  value: `${totalWorkoutMin} min`,
                  icon: Dumbbell,
                  gradient: '#ea580c',
                },
                {
                  label: 'Avg sleep / night',
                  value: `${avgSleep} hrs`,
                  icon: BedDouble,
                  gradient: '#0284c7',
                },
              ].map(({ label, value, icon: Icon, gradient }, i) => (
                <div
                  key={label}
                  className="animate-fade-up card flex items-center gap-4 p-5"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className="icon-box size-12 shrink-0 rounded-2xl"
                    style={{ background: gradient, color: '#fff' }}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground-muted">{label}</p>
                    <p className="mt-0.5 text-2xl font-bold text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Weight trend */}
            <div className="mb-6 card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground">Weight trend</h3>
                  <p className="mt-0.5 text-xs text-foreground-muted">
                    Logged trend over {activePeriodObj.label.toLowerCase()}
                  </p>
                </div>
                {stats.length > 1 && (
                  <span
                    className={`text-sm font-bold ${
                      weightDelta <= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {weightDelta < 0 ? '↓' : weightDelta > 0 ? '↑' : '→'} {Math.abs(weightDelta).toFixed(1)} kg
                  </span>
                )}
              </div>
              <WeightSparkline stats={stats} />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Start', value: `${stats[0]?.weight ?? '—'} kg` },
                  { label: 'Current', value: `${stats[stats.length - 1]?.weight ?? '—'} kg` },
                  { label: 'Target', value: `${user?.targetWeight ?? 75} kg` },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3 text-center bg-slate-100/70 dark:bg-slate-800/60"
                  >
                    <p className="text-xs font-medium text-foreground-muted">{label}</p>
                    <p className="mt-1 font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step heatmap */}
            <div className="mb-6 card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground">Step activity</h3>
                  <p className="mt-0.5 text-xs text-foreground-muted">Daily step intensity this week</p>
                </div>
                <Activity className="size-5 text-primary" />
              </div>
              <ActivityHeatmap progress={progress} />
            </div>

            {/* Body metrics */}
            <h3 className="mb-4 font-bold text-foreground">Body metrics</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className="animate-fade-up card p-5"
                  style={{ animationDelay: `${i * 55}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-foreground-muted">{m.label}</p>
                    <span
                      className={`badge flex items-center gap-1 ${
                        m.positive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {m.positive ? (
                        <TrendingUp className="size-3" />
                      ) : (
                        <TrendingDown className="size-3" />
                      )}
                      {m.change}
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-foreground">{m.current}</p>
                  <p className="mt-0.5 text-xs text-foreground-muted">Period start: {m.previous}</p>
                </div>
              ))}
            </div>

            {/* Daily log table */}
            <div className="mt-6 card overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-bold text-foreground">Daily log</h3>
                <span className="badge badge-primary">{stats.length} entries ({activePeriodObj.label})</span>
              </div>
              {stats.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={Activity}
                    title="No activity recorded"
                    description="Complete a workout or log your meals to track your daily history here."
                    actionLabel="View Workouts"
                    actionHref="/workouts"
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-slate-50/70 dark:bg-slate-900/40">
                        {['Date', 'Weight', 'Calories', 'Steps', 'Workout', 'Sleep'].map((h) => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-bold text-foreground-muted">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...stats].reverse().map((d, i) => (
                        <tr
                          key={d.date}
                          className={`border-b border-border-subtle last:border-none ${
                            i === 0 ? 'bg-primary/5' : ''
                          }`}
                        >
                          <td className="px-5 py-3 font-semibold text-foreground">
                            {i === 0 ? (
                              <span className="flex items-center gap-2">
                                {d.date.slice(5)} <span className="badge badge-primary">Latest</span>
                              </span>
                            ) : (
                              d.date.slice(5)
                            )}
                          </td>
                          <td className="px-5 py-3 text-foreground">{d.weight} kg</td>
                          <td
                            className={`px-5 py-3 ${
                              d.calories > d.calorieGoal
                                ? 'text-amber-600 font-semibold'
                                : 'text-foreground'
                            }`}
                          >
                            {d.calories.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-foreground">{d.steps.toLocaleString()}</td>
                          <td className="px-5 py-3">
                            {d.workoutMinutes > 0 ? (
                              <span className="badge badge-success">{d.workoutMinutes} min</span>
                            ) : (
                              <span className="text-foreground-muted">Rest</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-foreground">{d.sleepHours}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}

'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getActivity, type ActivityItem } from '@/lib/api'
import { Activity, CalendarDays, Dumbbell, Flame, Utensils } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Filter = 'all' | ActivityItem['kind']

export function ActivityPage() {
  const [items,   setItems]   = useState<ActivityItem[]>([])
  const [filter,  setFilter]  = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getActivity(50)
      .then(setItems)
      .catch(() => setError('Could not load activity history.'))
      .finally(() => setLoading(false))
  }, [])

  const visible       = filter === 'all' ? items : items.filter((i) => i.kind === filter)
  const workoutCount  = items.filter((i) => i.kind === 'workout').length
  const mealCount     = items.filter((i) => i.kind === 'meal').length
  const totalCalories = items.reduce((s, i) => s + (i.calories ?? 0), 0)

  const groups = useMemo(() =>
    visible.reduce<Record<string, ActivityItem[]>>((acc, item) => {
      const label = new Date(item.timestamp).toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric',
      })
      ;(acc[label] ??= []).push(item)
      return acc
    }, {}),
  [visible])

  const FILTERS: [Filter, string][] = [['all', 'All'], ['workout', 'Workouts'], ['meal', 'Meals']]

  const KIND_GRADIENTS = {
    workout: '#2563eb',
    meal:    '#059669',
  }

  return (
    <Shell title="Activity">
      <div className="p-5 sm:p-8">

        {/* Hero */}
        <div className="animate-fade-up mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
              Your history
            </p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Training &amp; nutrition log
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              A unified timeline of completed workouts and logged meals.
            </p>
          </div>
          <div className="flex gap-2">
            {FILTERS.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95"
                style={filter === value
                  ? { background: 'var(--foreground)', color: '#fff', boxShadow: 'var(--shadow-sm)' }
                  : { background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Spinner label="Loading activity…" /> : error ? (
          <div className="card p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Completed workouts', value: workoutCount,                icon: Dumbbell, gradient: '#2563eb' },
                { label: 'Meals logged',        value: mealCount,                  icon: Utensils, gradient: '#059669' },
                { label: 'Tracked calories',    value: totalCalories.toLocaleString(), icon: Flame, gradient: '#ea580c' },
              ].map(({ label, value, icon: Icon, gradient }, i) => (
                <div
                  key={label}
                  className="animate-fade-up card flex items-center gap-4 p-5"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="icon-box size-11 shrink-0" style={{ background: gradient, color: '#fff' }}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {visible.length === 0 ? (
              <div className="card flex flex-col items-center justify-center p-14 text-center">
                <div className="icon-box size-16 mb-4" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Activity className="size-7" />
                </div>
                <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>No activity yet</h3>
                <p className="mt-1 max-w-sm text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  Complete a workout or log a meal and it will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groups).map(([date, dayItems]) => (
                  <section key={date} className="animate-fade-up">
                    <div className="mb-3 flex items-center gap-2">
                      <CalendarDays className="size-4" style={{ color: 'var(--foreground-muted)' }} />
                      <span className="text-xs font-bold" style={{ color: 'var(--foreground-muted)' }}>{date}</span>
                    </div>
                    <div
                      className="overflow-hidden rounded-2xl"
                      style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                    >
                      {dayItems.map((item, idx) => {
                        const IconFallback = item.kind === 'workout' ? Dumbbell : Utensils
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 sm:p-5 transition-colors hover:bg-[var(--background-alt)]"
                            style={{ borderTop: idx ? '1px solid var(--border-subtle)' : undefined }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt=""
                                className="size-14 shrink-0 rounded-xl object-cover sm:size-16"
                              />
                            ) : (
                              <div
                                className="icon-box size-14 shrink-0 sm:size-16"
                                style={{ background: KIND_GRADIENTS[item.kind], color: '#fff' }}
                              >
                                <IconFallback className="size-5" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-bold" style={{ color: 'var(--foreground)' }}>{item.title}</p>
                                <span
                                  className="badge"
                                  style={{
                                    background: item.kind === 'workout' ? 'var(--primary-light)' : 'var(--success-light)',
                                    color: item.kind === 'workout' ? 'var(--primary)' : 'var(--success)',
                                  }}
                                >
                                  {item.kind}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                                {item.subtitle} · {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </p>
                            </div>

                            <div className="hidden shrink-0 text-right sm:block">
                              {item.duration ? (
                                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{item.duration} min</p>
                              ) : null}
                              {item.calories ? (
                                <p className="text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>{item.calories} kcal</p>
                              ) : null}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Shell>
  )
}

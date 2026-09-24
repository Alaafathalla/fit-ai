'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getActivity, type ActivityItem } from '@/lib/api'
import { Activity, CalendarDays, Dumbbell, Flame, Utensils } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Filter = 'all' | ActivityItem['kind']

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getActivity(50)
      .then(setItems)
      .catch(() => setError('Could not load your activity history.'))
      .finally(() => setLoading(false))
  }, [])

  const visible = filter === 'all' ? items : items.filter((item) => item.kind === filter)
  const workoutCount = items.filter((item) => item.kind === 'workout').length
  const mealCount = items.filter((item) => item.kind === 'meal').length
  const calories = items.reduce((sum, item) => sum + (item.calories ?? 0), 0)

  const groups = useMemo(() => {
    return visible.reduce<Record<string, ActivityItem[]>>((acc, item) => {
      const label = new Date(item.timestamp).toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric',
      })
      ;(acc[label] ??= []).push(item)
      return acc
    }, {})
  }, [visible])

  return (
    <Shell title="Activity">
      <div className="p-5 sm:p-8">
        <div className="animate-fade-up mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Your history</p>
            <h2 className="mt-1.5 text-3xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Training & nutrition activity
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              A single timeline for completed workouts and logged meals.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {([
              ['all', 'All'],
              ['workout', 'Workouts'],
              ['meal', 'Meals'],
            ] as [Filter, string][]).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-95"
                style={filter === value
                  ? { background: 'var(--foreground)', color: 'var(--background)' }
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
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Completed workouts', value: workoutCount, icon: Dumbbell },
                { label: 'Meals logged', value: mealCount, icon: Utensils },
                { label: 'Tracked calories', value: calories.toLocaleString(), icon: Flame },
              ].map(({ label, value, icon: Icon }, index) => (
                <div key={label} className="animate-fade-up card flex items-center gap-4 p-5" style={{ animationDelay: `${index * 60}ms` }}>
                  <span className="grid size-11 place-items-center rounded-xl" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>{value}</p>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {visible.length === 0 ? (
              <div className="card flex flex-col items-center justify-center p-12 text-center">
                <span className="grid size-14 place-items-center rounded-2xl" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Activity className="size-6" />
                </span>
                <h3 className="mt-4 font-semibold" style={{ color: 'var(--foreground)' }}>No activity yet</h3>
                <p className="mt-1 max-w-sm text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  Complete a workout or log a meal and it will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groups).map(([date, dayItems]) => (
                  <section key={date} className="animate-fade-up">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--foreground-muted)' }}>
                      <CalendarDays className="size-4" /> {date}
                    </div>
                    <div className="card overflow-hidden">
                      {dayItems.map((item, index) => {
                        const Icon = item.kind === 'workout' ? Dumbbell : Utensils
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 sm:p-5"
                            style={{ borderTop: index ? '1px solid var(--border)' : undefined }}
                          >
                            {item.image ? (
                              <img src={item.image} alt="" className="size-14 rounded-xl object-cover sm:size-16" />
                            ) : (
                              <span className="grid size-14 place-items-center rounded-xl sm:size-16" style={{ background: 'var(--background-alt)' }}>
                                <Icon className="size-5" />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-semibold" style={{ color: 'var(--foreground)' }}>{item.title}</p>
                                <span className="badge badge-primary capitalize">{item.kind}</span>
                              </div>
                              <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                                {item.subtitle} · {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </p>
                            </div>
                            <div className="hidden text-right sm:block">
                              {item.duration ? <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.duration} min</p> : null}
                              {item.calories ? <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{item.calories} kcal</p> : null}
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

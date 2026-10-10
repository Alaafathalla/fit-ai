'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getMeals, getUserProfile, getWorkouts, type Meal, type UserProfile, type Workout } from '@/lib/api'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  RefreshCw,
  Utensils,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getWeekDates() {
  const now = new Date()
  const dayOfWeek = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + 1)
  return DAY_NAMES.map((name, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return { name, date }
  })
}

const TYPE_GRADIENTS: Record<string, string> = {
  Strength: '#2563eb',
  Cardio:   '#ea580c',
  HIIT:     '#dc2626',
  Mobility: '#059669',
}

export function PlannerPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [meals,    setMeals]    = useState<Meal[]>([])
  const [user,     setUser]     = useState<UserProfile | null>(null)
  const [variant,  setVariant]  = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    Promise.all([getWorkouts(), getMeals(), getUserProfile()])
      .then(([w, m, u]) => { setWorkouts(w); setMeals(m); setUser(u) })
      .catch(() => setError('Could not build your weekly plan.'))
      .finally(() => setLoading(false))
  }, [])

  const week = useMemo(() => {
    if (!workouts.length) return []
    const dates = getWeekDates()
    const trainingDays = [0, 1, 3, 4, 6]
    return dates.map((day, i) => {
      const tIdx = trainingDays.indexOf(i)
      const isRest = tIdx === -1
      const workout = isRest ? null : workouts[(tIdx + variant) % workouts.length]
      const meal = meals.length ? meals[(i + variant) % meals.length] : null
      return { ...day, workout, meal, isRest }
    })
  }, [workouts, meals, variant])

  const totalMinutes  = week.reduce((s, d) => s + (d.workout?.duration ?? 0), 0)
  const totalCalories = week.reduce((s, d) => s + (d.workout?.calories ?? 0), 0)
  const trainingCount = week.filter((d) => !d.isRest).length

  return (
    <Shell title="Weekly Planner">
      <div className="p-5 sm:p-8">

        {/* Hero */}
        <div className="animate-fade-up mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
              Smart scheduling
            </p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Your week, balanced automatically
            </h2>
            <p className="mt-1 max-w-xl text-sm" style={{ color: 'var(--foreground-muted)' }}>
              {user?.goal
                ? `Tailored to your goal: ${user.goal}`
                : 'Training and recovery days balanced for consistent progress.'}
            </p>
          </div>
          <button
            onClick={() => setVariant((v) => v + 1)}
            className="btn-primary gap-2"
            disabled={loading}
          >
            <RefreshCw className="size-4" /> Regenerate week
          </button>
        </div>

        {loading ? <Spinner label="Building your plan…" /> : error ? (
          <div className="card p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Training days',    value: `${trainingCount}/7`,                    icon: CalendarDays, gradient: '#2563eb' },
                { label: 'Planned volume',   value: `${totalMinutes} min`,                   icon: Clock3,       gradient: '#059669' },
                { label: 'Projected burn',   value: `${totalCalories.toLocaleString()} kcal`, icon: Zap,         gradient: '#ea580c' },
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
                    <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Day cards */}
            <div className="grid gap-4 xl:grid-cols-2">
              {week.map((item, i) => {
                const isToday = item.date.toDateString() === new Date().toDateString()
                const gradient = item.workout ? (TYPE_GRADIENTS[item.workout.type] ?? TYPE_GRADIENTS.Strength) : ''
                return (
                  <article
                    key={item.name}
                    className="animate-fade-up card overflow-hidden p-5 transition-all"
                    style={{
                      animationDelay: `${i * 45}ms`,
                      borderColor: isToday ? 'var(--primary)' : 'var(--border)',
                      boxShadow: isToday ? '0 0 0 1px var(--primary), var(--shadow-lg)' : 'var(--shadow-md)',
                    }}
                  >
                    {/* Day header */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>{item.name}</h3>
                          {isToday && <span className="badge badge-primary">Today</span>}
                        </div>
                        <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                          {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      {item.isRest
                        ? <span className="badge badge-success">Recovery</span>
                        : <span
                            className="badge text-white"
                            style={{ background: gradient }}
                          >{item.workout?.type}</span>}
                    </div>

                    {/* Content */}
                    {item.isRest ? (
                      <div className="mt-4 flex items-center gap-4 rounded-2xl p-4" style={{ background: 'var(--background-alt)' }}>
                        <div className="icon-box size-10 shrink-0" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                          <HeartPulse className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Active recovery</p>
                          <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                            20–30 min walk, mobility work, and hydration focus.
                          </p>
                        </div>
                      </div>
                    ) : item.workout ? (
                      <div className="mt-4 flex gap-4">
                        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl">
                          <img src={item.workout.image} alt="" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold" style={{ color: 'var(--foreground)' }}>{item.workout.title}</p>
                          <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                            {item.workout.duration} min · {item.workout.level} · {item.workout.calories} kcal
                          </p>
                          <div className="mt-3 progress-bar">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${Math.min((item.workout.duration / 60) * 100, 100)}%`, background: gradient }}
                            />
                          </div>
                          <Link
                            href={`/workouts/${item.workout.id}`}
                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold"
                            style={{ color: 'var(--primary)' }}
                          >
                            Open session <CheckCircle2 className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    ) : null}

                    {/* Nutrition focus */}
                    {item.meal && (
                      <div
                        className="mt-4 flex items-center gap-2 border-t pt-4 text-xs"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground-muted)' }}
                      >
                        <Utensils className="size-3.5 shrink-0" />
                        Nutrition focus:{' '}
                        <strong style={{ color: 'var(--foreground)' }}>{item.meal.name}</strong>
                        <span className="ml-auto">
                          {item.meal.calories} kcal
                        </span>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}

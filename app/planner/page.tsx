'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getMeals, getUserProfile, getWorkouts, type Meal, type UserProfile, type Workout } from '@/lib/api'
import { CalendarDays, CheckCircle2, Clock3, RefreshCw, Sparkles, Utensils, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getWeekDates() {
  const now = new Date()
  const currentDay = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - currentDay + 1)
  return DAY_NAMES.map((name, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return { name, date }
  })
}

export default function PlannerPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [meals, setMeals] = useState<Meal[]>([])
  const [user, setUser] = useState<UserProfile | null>(null)
  const [variant, setVariant] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getWorkouts(), getMeals(), getUserProfile()])
      .then(([workoutData, mealData, profile]) => {
        setWorkouts(workoutData)
        setMeals(mealData)
        setUser(profile)
      })
      .catch(() => setError('Could not build your weekly plan.'))
      .finally(() => setLoading(false))
  }, [])

  const week = useMemo(() => {
    const dates = getWeekDates()
    if (!workouts.length) return []

    const trainingDays = [0, 1, 3, 4, 6]
    return dates.map((day, index) => {
      const trainingIndex = trainingDays.indexOf(index)
      const isRest = trainingIndex === -1
      const workout = isRest ? null : workouts[(trainingIndex + variant) % workouts.length]
      const meal = meals.length ? meals[(index + variant) % meals.length] : null
      return { ...day, workout, meal, isRest }
    })
  }, [workouts, meals, variant])

  const totalMinutes = week.reduce((sum, item) => sum + (item.workout?.duration ?? 0), 0)
  const totalCalories = week.reduce((sum, item) => sum + (item.workout?.calories ?? 0), 0)

  return (
    <Shell title="Weekly Planner">
      <div className="p-5 sm:p-8">
        <div className="animate-fade-up mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Smart scheduling</p>
            <h2 className="mt-1.5 text-3xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Your week, balanced automatically
            </h2>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--foreground-muted)' }}>
              A practical mix of training and recovery built around {user?.goal ? `your goal: ${user.goal}` : 'your current fitness goal'}.
            </p>
          </div>
          <button onClick={() => setVariant((value) => value + 1)} className="btn-primary gap-2 active:scale-95" disabled={loading}>
            <RefreshCw className="size-4" /> Regenerate week
          </button>
        </div>

        {loading ? <Spinner label="Building your plan…" /> : error ? (
          <div className="card p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Training days', value: `${week.filter((item) => !item.isRest).length}/7`, icon: CalendarDays },
                { label: 'Planned volume', value: `${totalMinutes} min`, icon: Clock3 },
                { label: 'Projected burn', value: `${totalCalories.toLocaleString()} kcal`, icon: Zap },
              ].map(({ label, value, icon: Icon }, index) => (
                <div key={label} className="animate-fade-up card flex items-center gap-4 p-5" style={{ animationDelay: `${index * 60}ms` }}>
                  <span className="grid size-11 place-items-center rounded-xl" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>{value}</p>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {week.map((item, index) => {
                const isToday = item.date.toDateString() === new Date().toDateString()
                return (
                  <article
                    key={item.name}
                    className="animate-fade-up card overflow-hidden p-5"
                    style={{ animationDelay: `${index * 45}ms`, borderColor: isToday ? 'var(--primary)' : 'var(--border)' }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{item.name}</h3>
                          {isToday && <span className="badge badge-primary">Today</span>}
                        </div>
                        <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                          {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      {item.isRest ? (
                        <span className="badge badge-success">Recovery day</span>
                      ) : (
                        <span className="badge badge-primary">{item.workout?.type}</span>
                      )}
                    </div>

                    {item.isRest ? (
                      <div className="mt-5 flex items-center gap-4 rounded-xl p-4" style={{ background: 'var(--background-alt)' }}>
                        <span className="grid size-10 place-items-center rounded-xl" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                          <Sparkles className="size-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Active recovery</p>
                          <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>20–30 min walk, mobility, and hydration focus.</p>
                        </div>
                      </div>
                    ) : item.workout ? (
                      <div className="mt-5 flex gap-4">
                        <img src={item.workout.image} alt="" className="h-24 w-28 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{item.workout.title}</p>
                          <p className="mt-1 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                            {item.workout.duration} min · {item.workout.level} · {item.workout.calories} kcal
                          </p>
                          <Link href={`/workouts/${item.workout.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                            Open session <CheckCircle2 className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    ) : null}

                    {item.meal && (
                      <div className="mt-4 flex items-center gap-2 border-t pt-4 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--foreground-muted)' }}>
                        <Utensils className="size-3.5" />
                        Nutrition focus: <strong style={{ color: 'var(--foreground)' }}>{item.meal.name}</strong>
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

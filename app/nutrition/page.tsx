'use client'

import { CalorieRing, MacroBar } from '@/components/charts'
import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getDailyStats, getMeals, getTodayNutrition, logMeal, updateHydration, type Meal } from '@/lib/api'
import { Check, Droplets, Loader2, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

const MEAL_TYPES: (Meal['mealType'] | 'All')[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack']

const MEAL_BADGE_COLORS: Record<string, string> = {
  Breakfast: 'var(--warning)',
  Lunch:     'var(--success)',
  Dinner:    'var(--primary)',
  Snack:     'var(--accent)',
}

export default function NutritionPage() {
  const [meals, setMeals]           = useState<Meal[]>([])
  const [mealFilter, setMealFilter] = useState<Meal['mealType'] | 'All'>('All')
  const [nutrition, setNutrition]   = useState<{
    calories: number; calorieGoal: number
    protein: number; carbs: number; fat: number
  } | null>(null)
  const [hydration, setHydration]   = useState<number>(0)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [loggingMealId, setLoggingMealId] = useState<string | null>(null)
  const [loggedMealId, setLoggedMealId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getMeals(), getTodayNutrition(), getDailyStats(1)])
      .then(([m, n, s]) => {
        setMeals(m)
        setNutrition(n)
        setHydration(s[0]?.hydration ?? 0)
      })
      .catch(() => setError('Could not load nutrition data. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const visible = mealFilter === 'All' ? meals : meals.filter((m) => m.mealType === mealFilter)

  const refreshNutrition = async () => {
    const [nextNutrition, nextStats] = await Promise.all([getTodayNutrition(), getDailyStats(1)])
    setNutrition(nextNutrition)
    setHydration(nextStats[0]?.hydration ?? 0)
  }

  const handleLogMeal = async (mealId: string) => {
    if (loggingMealId) return
    setLoggingMealId(mealId)
    setError('')
    try {
      await logMeal(mealId)
      await refreshNutrition()
      setLoggedMealId(mealId)
      window.setTimeout(() => setLoggedMealId((current) => current === mealId ? null : current), 1800)
    } catch {
      setError('Could not log that meal. Please try again.')
    } finally {
      setLoggingMealId(null)
    }
  }

  const handleHydration = async (newValue: number) => {
    const previous = hydration
    setHydration(newValue)
    setError('')
    try {
      await updateHydration(newValue)
    } catch {
      setHydration(previous)
      setError('Could not update hydration. Please try again.')
    }
  }

  // hydration: goal is 2500 ml, split into 8 glasses of ~312 ml
  const HYDRATION_GOAL   = 2500
  const GLASS_SIZE       = Math.round(HYDRATION_GOAL / 8)
  const glassesConsumed  = Math.min(8, Math.round(hydration / GLASS_SIZE))

  return (
    <Shell title="Nutrition">
      <div className="p-5 sm:p-8">

        {/* Hero */}
        <div className="animate-fade-up mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
              Fuel your performance
            </p>
            <h2
              className="mt-1.5 text-3xl font-semibold tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              Today's nutrition log
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Track your meals and stay on target.
            </p>
          </div>
          <button
            className="btn-primary gap-2 active:scale-95"
            onClick={() => document.getElementById('meal-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            <Plus className="size-4" /> Log a meal
          </button>
        </div>

        {loading ? <Spinner label="Loading nutrition data…" /> : error && !nutrition ? (
          <div className="card p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            {/* Daily summary */}
            {nutrition && (
              <div
                className="animate-fade-up mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
                style={{ animationDelay: '60ms' }}
              >
                {/* Calorie ring */}
                <div className="card col-span-full flex flex-col items-center justify-center gap-3 p-5 xl:col-span-1">
                  <CalorieRing calories={nutrition.calories} goal={nutrition.calorieGoal} />
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {nutrition.calories <= nutrition.calorieGoal
                        ? `${(nutrition.calorieGoal - nutrition.calories).toLocaleString()} kcal remaining`
                        : `${(nutrition.calories - nutrition.calorieGoal).toLocaleString()} kcal over target`}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Goal: {nutrition.calorieGoal.toLocaleString()} kcal
                    </p>
                  </div>
                </div>

                {/* Macro cards */}
                {[
                  { label: 'Protein', current: nutrition.protein, goal: 160, color: 'var(--primary)' },
                  { label: 'Carbs',   current: nutrition.carbs,   goal: 200, color: 'var(--warning)' },
                  { label: 'Fat',     current: nutrition.fat,     goal: 65,  color: 'var(--accent)'  },
                ].map(({ label, current, goal, color }, i) => (
                  <div
                    key={label}
                    className="animate-fade-up card p-5"
                    style={{ animationDelay: `${(i + 1) * 80}ms` }}
                  >
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>
                      {label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {current}g
                    </p>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      of {goal}g goal
                    </p>
                    <div className="mt-3">
                      <MacroBar label="" current={current} goal={goal} color={color} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            {/* Meal type filter */}
            <div
              id="meal-library"
              className="animate-fade-up mb-5 flex scroll-mt-24 gap-2 overflow-x-auto pb-0.5"
              style={{ animationDelay: '120ms' }}
            >
              {MEAL_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setMealFilter(t)}
                  className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 active:scale-95"
                  style={
                    mealFilter === t
                      ? { background: 'var(--foreground)', color: 'var(--background)' }
                      : {
                          background: 'var(--card)',
                          border: '1px solid var(--border)',
                          color: 'var(--foreground-muted)',
                        }
                  }
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Meal cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((meal, i) => (
                <div
                  key={meal.id}
                  className="animate-fade-up overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1.5"
                  style={{
                    background:     'var(--card)',
                    border:         '1px solid var(--border)',
                    boxShadow:      'var(--shadow-md)',
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  {/* Real food image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    {/* subtle dark scrim for badge legibility */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 55%)' }} />
                    <span
                      className="absolute left-4 top-4 badge text-white"
                      style={{ background: MEAL_BADGE_COLORS[meal.mealType] }}
                    >
                      {meal.mealType}
                    </span>
                    <span
                      className="absolute right-4 top-4 badge"
                      style={{ background: 'rgba(255,255,255,0.9)', color: '#374151' }}
                    >
                      {meal.prepTime} min
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      {meal.name}
                    </h3>

                    <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'Cal',  value: meal.calories },
                        { label: 'Pro',  value: `${meal.protein}g` },
                        { label: 'Carb', value: `${meal.carbs}g` },
                        { label: 'Fat',  value: `${meal.fat}g` },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="rounded-lg py-2"
                          style={{ background: 'var(--background-alt)' }}
                        >
                          <p className="text-[10px]" style={{ color: 'var(--foreground-muted)' }}>
                            {label}
                          </p>
                          <p
                            className="mt-0.5 text-xs font-semibold"
                            style={{ color: 'var(--foreground)' }}
                          >
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {meal.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            background: 'var(--background-alt)',
                            color: 'var(--foreground-muted)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <button
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60"
                      style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                      onClick={() => handleLogMeal(meal.id)}
                      disabled={loggingMealId !== null}
                    >
                      {loggingMealId === meal.id
                        ? <><Loader2 className="size-4 animate-spin" /> Adding…</>
                        : loggedMealId === meal.id
                          ? <><Check className="size-4" /> Added</>
                          : '+ Add to log'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Hydration tracker — wired to API data */}
            <div
              className="animate-fade-up mt-6 card p-5"
              style={{ animationDelay: '160ms' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="size-5" style={{ color: 'var(--primary)' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      Hydration tracker
                    </h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Goal: {HYDRATION_GOAL.toLocaleString()} ml / day
                    </p>
                  </div>
                </div>
                <span className="badge badge-primary">{hydration.toLocaleString()} ml</span>
              </div>

              {/* Glass indicators */}
              <div className="mt-4 flex gap-2">
                {Array.from({ length: 8 }).map((_, i) => {
                  const filled = i < glassesConsumed
                  return (
                    <button
                      key={i}
                      title={`${(i + 1) * GLASS_SIZE} ml`}
                      onClick={() => {
                        const newVal = Math.min(HYDRATION_GOAL, (i + 1) * GLASS_SIZE)
                        handleHydration(newVal)
                      }}
                      className="flex-1 rounded-lg py-3 transition-all duration-200 hover:opacity-90 active:scale-95"
                      style={{
                        background: filled ? 'var(--primary)' : 'var(--border)',
                        opacity:    filled ? 1 : 0.45,
                      }}
                    />
                  )
                })}
              </div>

              <p className="mt-2 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                {glassesConsumed} of 8 glasses
                {hydration < HYDRATION_GOAL
                  ? ` · ${(HYDRATION_GOAL - hydration).toLocaleString()} ml to goal`
                  : ' · Goal reached 🎉'}
              </p>
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}

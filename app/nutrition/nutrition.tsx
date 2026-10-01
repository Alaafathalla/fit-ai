'use client'

import { CalorieRing, MacroBar } from '@/components/charts'
import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import {
  getDailyStats,
  getMeals,
  getTodayNutrition,
  logMeal,
  updateHydration,
  type Meal,
} from '@/lib/api'
import { Check, Droplets, Loader2, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

const MEAL_TYPES: (Meal['mealType'] | 'All')[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack']

const MEAL_GRADIENTS: Record<string, string> = {
  Breakfast: 'linear-gradient(135deg,#f59e0b,#ef4444)',
  Lunch:     'linear-gradient(135deg,#16a34a,#06b6d4)',
  Dinner:    'linear-gradient(135deg,#4f5fed,#7c3aed)',
  Snack:     'linear-gradient(135deg,#7c3aed,#06b6d4)',
}

const MACRO_CONFIG = [
  { label: 'Protein', key: 'protein' as const, goal: 160, color: 'var(--primary)' },
  { label: 'Carbs',   key: 'carbs'   as const, goal: 200, color: 'var(--warning)' },
  { label: 'Fat',     key: 'fat'     as const, goal: 65,  color: 'var(--accent)'  },
]

export function NutritionPage() {
  const [meals, setMeals]               = useState<Meal[]>([])
  const [mealFilter, setMealFilter]     = useState<Meal['mealType'] | 'All'>('All')
  const [nutrition, setNutrition]       = useState<{
    calories: number; calorieGoal: number
    protein: number; carbs: number; fat: number
  } | null>(null)
  const [hydration, setHydration]       = useState(0)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [loggingId, setLoggingId]       = useState<string | null>(null)
  const [loggedId,  setLoggedId]        = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getMeals(), getTodayNutrition(), getDailyStats(1)])
      .then(([m, n, s]) => { setMeals(m); setNutrition(n); setHydration(s[0]?.hydration ?? 0) })
      .catch(() => setError('Could not load nutrition data.'))
      .finally(() => setLoading(false))
  }, [])

  const visible = mealFilter === 'All' ? meals : meals.filter((m) => m.mealType === mealFilter)

  const refreshNutrition = async () => {
    const [n, s] = await Promise.all([getTodayNutrition(), getDailyStats(1)])
    setNutrition(n); setHydration(s[0]?.hydration ?? 0)
  }

  const handleLogMeal = async (id: string) => {
    if (loggingId) return
    setLoggingId(id); setError('')
    try {
      await logMeal(id)
      await refreshNutrition()
      setLoggedId(id)
      setTimeout(() => setLoggedId((c) => (c === id ? null : c)), 1800)
    } catch { setError('Could not log that meal.') }
    finally { setLoggingId(null) }
  }

  const handleHydration = async (ml: number) => {
    const prev = hydration
    setHydration(ml); setError('')
    try { await updateHydration(ml) }
    catch { setHydration(prev); setError('Could not update hydration.') }
  }

  const HYDRATION_GOAL = 2500
  const GLASS_SIZE     = Math.round(HYDRATION_GOAL / 8)
  const glassesConsumed = Math.min(8, Math.round(hydration / GLASS_SIZE))

  return (
    <Shell title="Nutrition">
      <div className="p-5 sm:p-8">

        {/* Hero */}
        <div className="animate-fade-up mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
              Fuel your performance
            </p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Today's nutrition log
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Track meals and stay on target.
            </p>
          </div>
          <button
            className="btn-primary gap-2"
            onClick={() => document.getElementById('meal-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            <Plus className="size-4" /> Log a meal
          </button>
        </div>

        {loading ? <Spinner label="Loading nutrition data…" /> : error && !nutrition ? (
          <div className="card p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            {/* Summary cards */}
            {nutrition && (
              <div className="animate-fade-up mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: '60ms' }}>
                {/* Calorie ring */}
                <div className="card col-span-full flex flex-col items-center justify-center gap-4 p-6 xl:col-span-1">
                  <CalorieRing calories={nutrition.calories} goal={nutrition.calorieGoal} />
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                      {nutrition.calories <= nutrition.calorieGoal
                        ? `${(nutrition.calorieGoal - nutrition.calories).toLocaleString()} kcal remaining`
                        : `${(nutrition.calories - nutrition.calorieGoal).toLocaleString()} kcal over`}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Goal: {nutrition.calorieGoal.toLocaleString()} kcal
                    </p>
                  </div>
                </div>

                {/* Macro cards */}
                {MACRO_CONFIG.map(({ label, key, goal, color }, i) => (
                  <div
                    key={label}
                    className="animate-fade-up card p-5"
                    style={{ animationDelay: `${(i + 1) * 80}ms` }}
                  >
                    <p className="text-xs font-semibold" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                    <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                      {nutrition[key]}g
                    </p>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>of {goal}g goal</p>
                    <div className="mt-3">
                      <MacroBar label="" current={nutrition[key]} goal={goal} color={color} />
                    </div>
                    {/* Mini percentage */}
                    <p className="mt-2 text-xs font-bold" style={{ color }}>
                      {Math.round((nutrition[key] / goal) * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            {/* Filter pills */}
            <div
              id="meal-library"
              className="animate-fade-up mb-5 flex scroll-mt-24 gap-2 overflow-x-auto pb-0.5"
              style={{ animationDelay: '120ms' }}
            >
              {MEAL_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setMealFilter(t)}
                  className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95"
                  style={mealFilter === t
                    ? { background: 'var(--gradient-hero)', color: '#fff', boxShadow: '0 2px 12px rgba(79,95,237,0.35)' }
                    : { background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Meal grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((meal, i) => (
                <div
                  key={meal.id}
                  className="animate-fade-up overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                    <span
                      className="absolute left-4 top-4 badge text-white text-[11px]"
                      style={{ background: MEAL_GRADIENTS[meal.mealType] }}
                    >
                      {meal.mealType}
                    </span>
                    <span
                      className="absolute right-4 top-4 badge"
                      style={{ background: 'rgba(255,255,255,0.93)', color: '#374151' }}
                    >
                      {meal.prepTime} min
                    </span>
                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-bold text-white drop-shadow">{meal.name}</h3>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Macro grid */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'Cal',  value: meal.calories },
                        { label: 'Pro',  value: `${meal.protein}g` },
                        { label: 'Carb', value: `${meal.carbs}g` },
                        { label: 'Fat',  value: `${meal.fat}g` },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-xl py-2.5" style={{ background: 'var(--background-alt)' }}>
                          <p className="text-[10px] font-semibold" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                          <p className="mt-0.5 text-xs font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {meal.tags.map((t) => <span key={t} className="badge badge-neutral">{t}</span>)}
                    </div>

                    <button
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 disabled:opacity-60"
                      style={{
                        background: loggedId === meal.id ? 'var(--success)' : 'color-mix(in srgb, var(--primary) 12%, transparent)',
                        color: loggedId === meal.id ? '#fff' : 'var(--primary)',
                      }}
                      onClick={() => handleLogMeal(meal.id)}
                      disabled={loggingId !== null}
                    >
                      {loggingId === meal.id
                        ? <><Loader2 className="size-4 animate-spin" /> Adding…</>
                        : loggedId === meal.id
                          ? <><Check className="size-4" /> Added to log</>
                          : <><Plus className="size-4" /> Add to log</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Hydration tracker */}
            <div className="animate-fade-up mt-6 card p-5 sm:p-6" style={{ animationDelay: '160ms' }}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="icon-box size-11" style={{ background: 'var(--gradient-cool)', color: '#fff' }}>
                    <Droplets className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Hydration tracker</h3>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Goal: {HYDRATION_GOAL.toLocaleString()} ml / day
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <strong className="text-2xl font-bold" style={{ color: 'var(--accent-2)' }}>
                    {hydration.toLocaleString()}
                  </strong>
                  <span className="ml-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>/ {HYDRATION_GOAL.toLocaleString()} ml</span>
                  <div className="progress-bar mt-2 w-40">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${Math.min((hydration / HYDRATION_GOAL) * 100, 100)}%`, background: 'var(--gradient-cool)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Glasses */}
              <div className="mt-5 flex gap-2">
                {Array.from({ length: 8 }).map((_, i) => {
                  const filled = i < glassesConsumed
                  return (
                    <button
                      key={i}
                      title={`${(i + 1) * GLASS_SIZE} ml`}
                      onClick={() => handleHydration(Math.min(HYDRATION_GOAL, (i + 1) * GLASS_SIZE))}
                      className="flex-1 rounded-xl py-3.5 transition-all duration-200 active:scale-95"
                      style={{
                        background: filled ? 'var(--gradient-cool)' : 'var(--border)',
                        opacity: filled ? 1 : 0.5,
                        boxShadow: filled ? '0 2px 8px rgba(6,182,212,0.3)' : 'none',
                      }}
                    />
                  )
                })}
              </div>

              <p className="mt-2 text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>
                {glassesConsumed} of 8 glasses
                {hydration < HYDRATION_GOAL
                  ? ` · ${(HYDRATION_GOAL - hydration).toLocaleString()} ml to goal`
                  : ' · Daily goal reached 🎉'}
              </p>
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}

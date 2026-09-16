'use client'

import { CalorieRing, MacroBar } from '@/components/charts'
import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getMeals, getTodayNutrition, type Meal } from '@/lib/api'
import { Plus, Utensils } from 'lucide-react'
import { useEffect, useState } from 'react'

const MEAL_TYPES: (Meal['mealType'] | 'All')[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack']

const MEAL_GRADIENTS: Record<string, string> = {
  Breakfast: 'linear-gradient(135deg, #ffecd9, #fff4eb)',
  Lunch:     'linear-gradient(135deg, #d9fff0, #edfff8)',
  Dinner:    'linear-gradient(135deg, #dbe5ff, #f0f3ff)',
  Snack:     'linear-gradient(135deg, #fde8ff, #fdf4ff)',
}

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMeals(), getTodayNutrition()])
      .then(([m, n]) => { setMeals(m); setNutrition(n) })
      .finally(() => setLoading(false))
  }, [])

  const visible = mealFilter === 'All' ? meals : meals.filter((m) => m.mealType === mealFilter)

  return (
    <Shell title="Nutrition">
      <div className="p-5 sm:p-8">

        {/* Hero */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
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
          <button className="btn-primary gap-2">
            <Plus className="size-4" /> Log a meal
          </button>
        </div>

        {loading ? <Spinner label="Loading nutrition data…" /> : (
          <>
            {/* Daily summary */}
            {nutrition && (
              <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {/* Calorie ring */}
                <div className="card col-span-full flex flex-col items-center justify-center gap-3 p-5 xl:col-span-1">
                  <CalorieRing calories={nutrition.calories} goal={nutrition.calorieGoal} />
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {(nutrition.calorieGoal - nutrition.calories).toLocaleString()} kcal remaining
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
                ].map(({ label, current, goal, color }) => (
                  <div key={label} className="card p-5">
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

            {/* Meal type filter */}
            <div className="mb-5 flex gap-2 overflow-x-auto pb-0.5">
              {MEAL_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setMealFilter(t)}
                  className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
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
              {visible.map((meal) => (
                <div
                  key={meal.id}
                  className="overflow-hidden rounded-2xl transition-transform duration-200 hover:-translate-y-1"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative h-36"
                    style={{ background: MEAL_GRADIENTS[meal.mealType] }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Utensils className="size-12 opacity-10" style={{ color: 'var(--foreground)' }} />
                    </div>
                    <span
                      className="absolute left-4 top-4 badge text-white"
                      style={{ background: MEAL_BADGE_COLORS[meal.mealType] }}
                    >
                      {meal.mealType}
                    </span>
                    <span
                      className="absolute right-4 top-4 badge"
                      style={{ background: 'rgba(255,255,255,0.85)', color: '#374151' }}
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
                      className="mt-4 w-full rounded-xl py-2 text-sm font-semibold transition-colors"
                      style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                    >
                      + Add to log
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Water intake tracker */}
            <div className="mt-6 card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    Hydration tracker
                  </h3>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                    Goal: 2,500 ml / day
                  </p>
                </div>
                <span className="badge badge-primary">1,800 ml</span>
              </div>
              <div className="mt-4 flex gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-lg py-3 transition-opacity"
                    style={{
                      background: i < 5 ? 'var(--primary)' : 'var(--border)',
                      opacity: i < 5 ? 1 : 0.4,
                    }}
                    title={`${(i + 1) * 250} ml`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                5 of 8 glasses · 700 ml to goal
              </p>
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}

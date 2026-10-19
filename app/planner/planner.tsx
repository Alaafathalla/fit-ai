'use client'

import { Shell } from '@/components/shell'
import { CardSkeleton, ChartSkeleton } from '@/components/ui/skeleton'
import { AthleteProgramView } from '@/components/athlete-program-view'
import {
  generateAndSaveFitnessPlan,
  getCustomFitnessPlan,
  getMeals,
  getUserProfile,
  getUserWeeklyPlan,
  toggleUserPlanDay,
  toggleUserPlanMeal,
  getWorkouts,
  type CustomFitnessPlan,
  type AthleteWeeklyPlan,
  type Meal,
  type UserProfile,
  type Workout,
} from '@/lib/api'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  HeartPulse,
  RefreshCw,
  Sparkles,
  Target,
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
  Cardio: '#ea580c',
  HIIT: '#dc2626',
  Mobility: '#059669',
}

export function PlannerPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [meals, setMeals] = useState<Meal[]>([])
  const [user, setUser] = useState<UserProfile | null>(null)
  const [aiPlan, setAiPlan] = useState<CustomFitnessPlan | null>(null)
  const [weeklyPlan, setWeeklyPlan] = useState<AthleteWeeklyPlan | null>(null)
  const [activeTab, setActiveTab] = useState<'my-program' | 'ai-plan' | 'calendar'>('my-program')
  const [variant, setVariant] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  const loadData = async () => {
    try {
      const [w, m, u, p, wp] = await Promise.all([
        getWorkouts(),
        getMeals(),
        getUserProfile(),
        getCustomFitnessPlan(),
        getUserWeeklyPlan(),
      ])
      setWorkouts(w)
      setMeals(m)
      setUser(u)
      setAiPlan(p)
      setWeeklyPlan(wp)
    } catch {
      setError('Could not build your weekly plan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleUserDay = async (dayId: string) => {
    try {
      const updated = await toggleUserPlanDay(dayId)
      setWeeklyPlan(updated)
      const targetDay = updated.splitDays.find((d) => d.id === dayId)
      setToastMsg(
        targetDay?.status === 'completed'
          ? 'Great job! Workout completed and stats updated ✓'
          : 'Workout marked as pending'
      )
      setTimeout(() => setToastMsg(''), 3000)
    } catch {
      setToastMsg('Could not update workout status.')
      setTimeout(() => setToastMsg(''), 2500)
    }
  }

  const handleToggleUserMeal = async (mealId: string) => {
    try {
      const updated = await toggleUserPlanMeal(mealId)
      setWeeklyPlan(updated)
      const targetMeal = updated.meals.find((m) => m.id === mealId)
      setToastMsg(
        targetMeal?.status === 'completed'
          ? 'Nice! Meal logged successfully ✓'
          : 'Meal marked as pending'
      )
      setTimeout(() => setToastMsg(''), 3000)
    } catch {
      setToastMsg('Could not update meal status.')
      setTimeout(() => setToastMsg(''), 2500)
    }
  }

  const handleRegenerateAiPlan = async () => {
    setGenerating(true)
    try {
      const newPlan = await generateAndSaveFitnessPlan({
        athleteName: user?.name,
        goal: user?.goal,
        currentWeight: user?.currentWeight,
        targetWeight: user?.targetWeight,
      })
      const newWeeklyPlan = await getUserWeeklyPlan()
      setAiPlan(newPlan)
      setWeeklyPlan(newWeeklyPlan)
      setToastMsg('AI Plan generated & customized to your goal!')
      setTimeout(() => setToastMsg(''), 3500)
    } catch {
      setToastMsg('Failed to generate plan.')
      setTimeout(() => setToastMsg(''), 3000)
    } finally {
      setGenerating(false)
    }
  }

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

  const totalMinutes = week.reduce((s, d) => s + (d.workout?.duration ?? 0), 0)
  const totalCalories = week.reduce((s, d) => s + (d.workout?.calories ?? 0), 0)
  const trainingCount = week.filter((d) => !d.isRest).length

  return (
    <Shell title="Smart Training Planner">
      <div className="p-5 sm:p-8 space-y-7">
        {/* Toast */}
        {toastMsg && (
          <div className="animate-fade-up fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-white shadow-2xl">
            <Sparkles className="size-4 text-amber-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Hero */}
        <div className="animate-fade-up flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Smart Periodization
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                AI Coach Engine
              </span>
            </div>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-foreground">
              Your Customized Training & Nutrition Blueprint
            </h2>
            <p className="mt-1 max-w-xl text-sm text-foreground-muted">
              {user?.goal
                ? `Tailored program for goal: “${user.goal}” (${user.currentWeight} kg → ${user.targetWeight} kg)`
                : 'Balanced workout splits and macronutrient targets designed for optimal recovery.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRegenerateAiPlan}
              disabled={generating}
              className="btn btn-primary inline-flex items-center gap-2 !h-11 !px-4"
            >
              <Sparkles className="size-4 text-amber-300" />
              {generating ? 'Engine Computing…' : 'Regenerate Plan with AI'}
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('my-program')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'my-program'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-foreground-muted hover:text-foreground'
            }`}
          >
            <CalendarDays className="size-3.5" />
            Weekly Program & Nutrition Tracker
            {weeklyPlan && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                {weeklyPlan.completedWorkoutsCount}/{weeklyPlan.totalWorkoutsCount} Done
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai-plan')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'ai-plan'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-foreground-muted hover:text-foreground'
            }`}
          >
            AI Protocol & Prescribed Exercises
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-foreground-muted hover:text-foreground'
            }`}
          >
            Weekly Schedule & Calendar Matrix
          </button>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <ChartSkeleton height="h-64" />
          </div>
        ) : error ? (
          <div className="card p-8 text-center text-sm text-danger">{error}</div>
        ) : activeTab === 'my-program' && weeklyPlan ? (
          <div className="animate-fade-up space-y-6">
            <AthleteProgramView
              plan={weeklyPlan}
              athleteName={user?.name}
              isCoachView={false}
              onToggleDay={handleToggleUserDay}
              onToggleMeal={handleToggleUserMeal}
            />
          </div>
        ) : activeTab === 'ai-plan' && aiPlan ? (
          <div className="space-y-7 animate-fade-up">
            {/* Plan Header Card */}
            <div className="card p-6 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50/20 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-slate-900/40 border border-blue-200/60 dark:border-blue-900/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="badge badge-primary">{aiPlan.level} Level · {aiPlan.daysPerWeek} Days/Week</span>
                  <h3 className="mt-2 text-2xl font-black text-foreground">{aiPlan.title}</h3>
                  <p className="mt-1 text-sm text-foreground-muted max-w-2xl">{aiPlan.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-card p-4 text-center border border-border shadow-xs">
                    <p className="text-[10px] font-bold text-foreground-muted uppercase">Daily Calorie Target</p>
                    <p className="text-xl font-black text-primary mt-0.5">{aiPlan.nutritionPlan.dailyCalories} kcal</p>
                  </div>
                </div>
              </div>

              {/* Macro breakdown bars */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/60 pt-5">
                <div className="rounded-xl bg-card/80 p-3 text-center border border-border/40">
                  <p className="text-xs font-semibold text-foreground-muted">Protein</p>
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                    {aiPlan.nutritionPlan.macros.proteinGrams}g
                  </p>
                  <p className="text-[10px] text-foreground-muted">~2.0g/kg bodyweight</p>
                </div>
                <div className="rounded-xl bg-card/80 p-3 text-center border border-border/40">
                  <p className="text-xs font-semibold text-foreground-muted">Carbohydrates</p>
                  <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                    {aiPlan.nutritionPlan.macros.carbsGrams}g
                  </p>
                  <p className="text-[10px] text-foreground-muted">Muscle glycogen & energy</p>
                </div>
                <div className="rounded-xl bg-card/80 p-3 text-center border border-border/40">
                  <p className="text-xs font-semibold text-foreground-muted">Healthy Fats</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {aiPlan.nutritionPlan.macros.fatGrams}g
                  </p>
                  <p className="text-[10px] text-foreground-muted">Hormone & joint support</p>
                </div>
              </div>
            </div>

            {/* Daily Training Days */}
            <div>
              <h3 className="text-xl font-black text-foreground mb-4">Training Days & Prescribed Movements</h3>
              <div className="grid gap-5 lg:grid-cols-2">
                {aiPlan.workoutPlan.days.map((day) => (
                  <div key={day.dayNumber} className="card p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <h4 className="font-extrabold text-foreground text-base">{day.title}</h4>
                        <p className="text-xs text-primary font-semibold mt-0.5">Focus: {day.focus}</p>
                      </div>
                      <span className="badge badge-secondary flex items-center gap-1">
                        <Clock3 className="size-3" /> {day.estimatedMinutes} min
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {day.exercises.map((ex, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl bg-slate-50/70 dark:bg-slate-800/40 p-3 border border-border/40"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-foreground truncate">{ex.name}</p>
                            {ex.notes && (
                              <p className="text-[10px] text-foreground-muted mt-0.5 truncate">{ex.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-right shrink-0 ml-3">
                            <div>
                              <p className="text-xs font-black text-foreground">{ex.sets} sets × {ex.reps}</p>
                              <p className="text-[10px] text-foreground-muted">Rest: {ex.rest}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Guidelines & Suggested Meals */}
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="card p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Utensils className="size-4 text-primary" />
                  <h4 className="font-extrabold text-foreground text-base">Suggested Meal Blueprint</h4>
                </div>
                <div className="space-y-3">
                  {aiPlan.nutritionPlan.suggestedMeals.map((meal, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-border p-3.5 bg-slate-50/50 dark:bg-slate-900/30 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="badge badge-primary text-[10px]">{meal.mealType}</span>
                          <p className="text-xs font-bold text-foreground">{meal.name}</p>
                        </div>
                        <p className="text-xs text-foreground-muted mt-1 leading-relaxed">{meal.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-foreground">{meal.calories} kcal</p>
                        <p className="text-[10px] font-semibold text-emerald-600">{meal.protein}g protein</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Target className="size-4 text-primary" />
                  <h4 className="font-extrabold text-foreground text-base">Coach Nutrition Directives</h4>
                </div>
                <div className="space-y-2.5">
                  {aiPlan.nutritionPlan.guidelines.map((guide, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground leading-relaxed">
                      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        ✓
                      </span>
                      <span>{guide}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Weekly Matrix View */
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Training days', value: `${trainingCount}/7`, icon: CalendarDays, gradient: '#2563eb' },
                { label: 'Planned volume', value: `${totalMinutes} min`, icon: Clock3, gradient: '#059669' },
                { label: 'Projected burn', value: `${totalCalories.toLocaleString()} kcal`, icon: Zap, gradient: '#ea580c' },
              ].map(({ label, value, icon: Icon, gradient }, i) => (
                <div
                  key={label}
                  className="animate-fade-up card flex items-center gap-4 p-5"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="icon-box size-11 shrink-0 rounded-2xl" style={{ background: gradient, color: '#fff' }}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{value}</p>
                    <p className="text-xs font-medium text-foreground-muted">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {week.map((item, i) => {
                const isToday = item.date.toDateString() === new Date().toDateString()
                const gradient = item.workout ? TYPE_GRADIENTS[item.workout.type] ?? TYPE_GRADIENTS.Strength : ''
                return (
                  <article
                    key={item.name}
                    className={`animate-fade-up card overflow-hidden p-5 transition-all ${
                      isToday ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ animationDelay: `${i * 45}ms` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{item.name}</h3>
                          {isToday && <span className="badge badge-primary">Today</span>}
                        </div>
                        <p className="text-xs text-foreground-muted">
                          {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      {item.isRest ? (
                        <span className="badge badge-success">Recovery</span>
                      ) : (
                        <span className="badge text-white" style={{ background: gradient }}>
                          {item.workout?.type}
                        </span>
                      )}
                    </div>

                    {item.isRest ? (
                      <div className="mt-4 flex items-center gap-4 rounded-2xl p-4 bg-slate-100/70 dark:bg-slate-800/60">
                        <div className="icon-box size-10 shrink-0 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                          <HeartPulse className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Active recovery</p>
                          <p className="mt-0.5 text-xs text-foreground-muted">
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
                          <p className="font-bold text-foreground">{item.workout.title}</p>
                          <p className="mt-0.5 text-xs text-foreground-muted">
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
                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary"
                          >
                            Open session <CheckCircle2 className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    ) : null}

                    {item.meal && (
                      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-foreground-muted">
                        <Utensils className="size-3.5 shrink-0" />
                        Nutrition focus: <strong className="text-foreground">{item.meal.name}</strong>
                        <span className="ml-auto">{item.meal.calories} kcal</span>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}

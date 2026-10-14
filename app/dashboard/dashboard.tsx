'use client'

import { ActivityHeatmap, CalorieRing, MacroBar, WeeklyBars, WeightSparkline } from '@/components/charts'
import { CoachPanel } from '@/components/coach-panel'
import { Shell } from '@/components/shell'
import { CardSkeleton, ChartSkeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/stat-card'
import {
  getDailyStats,
  getTodayNutrition,
  getUserProfile,
  getUserWeeklyPlan,
  toggleUserPlanDay,
  getWeeklyProgress,
  getWorkouts,
  updateUserProfile,
  type DailyStats,
  type UserProfile,
  type WeeklyProgress,
  type Workout,
  type AthleteWeeklyPlan,
} from '@/lib/api'
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Flame,
  HeartPulse,
  Pause,
  Play,
  RotateCcw,
  Scale,
  Sparkles,
  Target,
  Utensils,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<DailyStats[]>([])
  const [progress, setProgress] = useState<WeeklyProgress[]>([])
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null)
  const [nutrition, setNutrition] = useState<{
    calories: number
    calorieGoal: number
    protein: number
    carbs: number
    fat: number
  } | null>(null)
  const [weeklyPlan, setWeeklyPlan] = useState<AthleteWeeklyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Quick setup modal state
  const [setupModalOpen, setSetupModalOpen] = useState(false)
  const [setupCurrentWeight, setSetupCurrentWeight] = useState('')
  const [setupTargetWeight, setSetupTargetWeight] = useState('')
  const [setupGoal, setSetupGoal] = useState('Lose fat & build lean muscle')
  const [setupSaving, setSetupSaving] = useState(false)
  const [setupError, setSetupError] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const [vidPlaying, setVidPlaying] = useState(false)
  const [vidMuted, setVidMuted] = useState(true)

  const loadData = async () => {
    try {
      const [u, s, p, n, w, wp] = await Promise.all([
        getUserProfile(),
        getDailyStats(),
        getWeeklyProgress(),
        getTodayNutrition(),
        getWorkouts('Strength'),
        getUserWeeklyPlan(),
      ])
      setUser(u)
      setStats(s)
      setProgress(p)
      setNutrition(n)
      setTodayWorkout(w[0] ?? null)
      setWeeklyPlan(wp)
    } catch {
      setError('Some data could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleDay = async (dayId: string) => {
    try {
      const updated = await toggleUserPlanDay(dayId)
      setWeeklyPlan(updated)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Check if this is a new account that has not entered weight or goal yet
  const isNewAccount =
    !user ||
    !user.currentWeight ||
    user.currentWeight === 0 ||
    !user.goal ||
    user.goal.trim() === ''

  const today = stats[stats.length - 1]

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
      setVidPlaying(true)
    } else {
      v.pause()
      setVidPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setVidMuted(videoRef.current.muted)
  }

  // Calculate metrics with explicit 0 fallback for new accounts
  const displayCurrentWeight = isNewAccount ? 0 : user?.currentWeight ?? 0
  const displayStreak = isNewAccount ? 0 : user?.streak ?? 0
  const displayFitnessScore = isNewAccount ? 0 : user?.fitnessScore ?? 0

  const weeklyCalories = isNewAccount ? 0 : progress.reduce((s, p) => s + p.caloriesBurned, 0)

  const weightDelta =
    isNewAccount || stats.length < 2 || stats[stats.length - 1].weight === 0
      ? '0.0'
      : (stats[stats.length - 1].weight - stats[0].weight).toFixed(1)

  const todayCalories = isNewAccount ? 0 : today ? today.calories : 0
  const todayCalorieGoal = today?.calorieGoal ?? 2000

  // Quick setup submit handler
  const handleQuickSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSetupSaving(true)
    setSetupError('')

    const cw = parseFloat(setupCurrentWeight)
    const tw = parseFloat(setupTargetWeight)

    if (isNaN(cw) || cw <= 0) {
      setSetupError('Please enter a valid current weight (e.g., 75 kg).')
      setSetupSaving(false)
      return
    }

    if (!setupGoal.trim()) {
      setSetupError('Please enter or select a fitness goal.')
      setSetupSaving(false)
      return
    }

    try {
      await updateUserProfile({
        currentWeight: cw,
        targetWeight: !isNaN(tw) && tw > 0 ? tw : undefined,
        goal: setupGoal.trim(),
      })
      await loadData()
      setSetupModalOpen(false)
    } catch (cause) {
      setSetupError(cause instanceof Error ? cause.message : 'Failed to save profile.')
    } finally {
      setSetupSaving(false)
    }
  }

  return (
    <Shell title={user ? `${greeting}, ${user.name}` : greeting} subtitle={dateStr} allowedRoles={['USER']}>
      <div className="p-5 sm:p-8">
        {/* New Account Onboarding Prompt */}
        {isNewAccount && (
          <div className="animate-fade-up mb-7 overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-foreground text-background shadow-xs">
                  <Scale className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 border border-slate-200">
                      Profile Setup
                    </span>
                    <span className="text-xs font-medium text-foreground-muted">Initial Configuration</span>
                  </div>
                  <h3 className="mt-1 text-base font-extrabold text-foreground">
                    Welcome to FitAI, {user?.name || 'Athlete'}
                  </h3>
                  <p className="mt-0.5 text-xs text-foreground-muted max-w-xl leading-relaxed">
                    All metrics show <strong>0</strong> until you enter your current weight and training goal. Configure them below to calculate daily targets, energy expenditure, and streaks.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:shrink-0">
                <button
                  onClick={() => setSetupModalOpen(true)}
                  className="btn-primary !h-10 !px-4 !text-xs font-semibold"
                >
                  Set Up Profile
                </button>
                <Link href="/settings" className="btn-outline !h-10 !px-4 !text-xs font-semibold">
                  Settings
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Hero row */}
        <div className="animate-fade-up mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
              {dateStr}
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: 'var(--foreground)' }}>
              Your fitness overview
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              {isNewAccount
                ? 'Enter your weight and goal below to activate personalized tracking.'
                : 'Stay consistent — every session counts.'}
            </p>
          </div>
          <Link href="/workouts" className="btn-primary gap-2">
            Explore workouts <ArrowRight className="size-4" />
          </Link>
        </div>

        {error && !loading && (
          <div className="mb-5 rounded-xl px-4 py-3 text-sm bg-danger-light text-danger">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="stagger animate-fade-up grid gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: '60ms' }}>
              {[
                {
                  label: 'Current weight',
                  value: `${displayCurrentWeight} kg`,
                  meta: isNewAccount ? 'Enter in profile' : `${Number(weightDelta) <= 0 ? '↓' : '↑'} ${Math.abs(Number(weightDelta))} kg`,
                  metaPositive: isNewAccount ? false : Number(weightDelta) <= 0,
                  icon: Target,
                  gradient: 'linear-gradient(135deg,#0f172a,#1e293b)',
                  style: { '--i': 0 } as React.CSSProperties,
                },
                {
                  label: 'Calories today',
                  value: todayCalories.toLocaleString(),
                  meta: isNewAccount ? '0% of goal' : `${Math.round((todayCalories / todayCalorieGoal) * 100)}% of goal`,
                  metaPositive: !isNewAccount,
                  icon: Flame,
                  gradient: 'linear-gradient(135deg,#ea580c,#c2410c)',
                  style: { '--i': 1 } as React.CSSProperties,
                },
                {
                  label: 'Workout streak',
                  value: `${displayStreak} days`,
                  meta: isNewAccount ? '0 days' : 'Keep it going 🔥',
                  metaPositive: !isNewAccount,
                  icon: Zap,
                  gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                  style: { '--i': 2 } as React.CSSProperties,
                },
                {
                  label: 'Performance score',
                  value: `${displayFitnessScore}/100`,
                  meta: isNewAccount ? 'Awaiting setup' : '+6 this week',
                  metaPositive: !isNewAccount,
                  icon: HeartPulse,
                  gradient: 'linear-gradient(135deg,#059669,#047857)',
                  style: { '--i': 3 } as React.CSSProperties,
                },
              ].map(({ style, ...card }) => (
                <div key={card.label} className="animate-fade-up" style={style}>
                  <StatCard {...card} />
                </div>
              ))}
            </div>

            {/* Weekly Program & Split Completion Tracker */}
            {weeklyPlan && (
              <div className="animate-fade-up mt-6 card overflow-hidden border border-border/80 p-6 bg-gradient-to-br from-card via-slate-50/50 to-blue-50/20 dark:via-slate-900/40 dark:to-blue-950/20 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border/60 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary">{weeklyPlan.level} · {weeklyPlan.daysPerWeek} أيام أسبوعياً</span>
                      <span className="text-xs font-black uppercase tracking-wider text-primary">البرنامج الرياضي النشط</span>
                    </div>
                    <h3 className="mt-1 text-xl sm:text-2xl font-black text-foreground">
                      {weeklyPlan.programTitle}
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground-muted">
                      الهدف: <strong className="text-foreground">{weeklyPlan.goal}</strong> · السعرات المستهدفة: <strong className="text-primary">{weeklyPlan.targetCalories} kcal</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 p-3 border border-emerald-200/60 dark:border-emerald-800/60 text-center min-w-[120px]">
                      <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">أنجزت (Completed)</p>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {weeklyPlan.completedWorkoutsCount} <span className="text-xs font-semibold text-foreground-muted">/ {weeklyPlan.totalWorkoutsCount}</span>
                      </p>
                    </div>

                    <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/50 p-3 border border-blue-200/60 dark:border-blue-800/60 text-center min-w-[120px]">
                      <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">متبقي (Remaining)</p>
                      <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                        {weeklyPlan.remainingWorkoutsCount} <span className="text-xs font-semibold text-foreground-muted">تمارين</span>
                      </p>
                    </div>

                    <Link
                      href="/planner"
                      className="btn btn-primary !h-11 !px-4 !text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <CalendarDays className="size-4" />
                      عرض البرنامج والوجبات بالكامل →
                    </Link>
                  </div>
                </div>

                {/* 7-Day Weekly Split Strip */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span>المخطط الزمني للأسبوع (Weekly Split Matrix)</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      مستوى الإنجاز الأسبوعي: {weeklyPlan.completionPercentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${weeklyPlan.completionPercentage}%` }}
                    />
                  </div>

                  {/* 7 Days Cards */}
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7 pt-2">
                    {weeklyPlan.splitDays.map((day) => {
                      const isRest = day.type === 'rest'
                      const isCompleted = day.status === 'completed'
                      const isRemaining = day.status === 'remaining'

                      return (
                        <div
                          key={day.id}
                          className={`flex flex-col justify-between rounded-2xl p-3 border text-xs transition ${
                            isCompleted
                              ? 'border-emerald-500/40 bg-emerald-500/[0.04] dark:bg-emerald-950/20'
                              : isRemaining
                              ? 'border-blue-500/40 bg-blue-500/[0.04] dark:bg-blue-950/20'
                              : 'border-border/60 bg-slate-100/50 dark:bg-slate-800/30 opacity-70'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-black text-foreground">{day.dayShort}</span>
                              {isRest ? (
                                <span className="text-[10px] text-foreground-muted font-bold">راحة</span>
                              ) : isCompleted ? (
                                <span className="grid size-4 place-items-center rounded-full bg-emerald-500 text-white text-[9px] font-black">
                                  ✓
                                </span>
                              ) : (
                                <span className="grid size-4 place-items-center rounded-full bg-blue-500 text-white text-[9px] font-black">
                                  ⏳
                                </span>
                              )}
                            </div>
                            <p className="mt-1 font-bold text-foreground line-clamp-1 text-[11px]">{day.title}</p>
                            <p className="mt-0.5 text-[10px] text-foreground-muted line-clamp-1">{day.focus}</p>
                          </div>

                          {!isRest && (
                            <button
                              type="button"
                              onClick={() => handleToggleDay(day.id)}
                              className={`mt-2.5 rounded-lg py-1 text-[10px] font-bold transition ${
                                isCompleted
                                  ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400'
                                  : 'bg-primary text-white hover:bg-primary/90'
                              }`}
                            >
                              {isCompleted ? 'مكتمل ✓' : 'تحديد كمنجز'}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Charts row */}
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {/* Weight sparkline */}
              <div className="animate-fade-up card p-5" style={{ animationDelay: '120ms' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Weight trend</h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>Last 7 days</p>
                  </div>
                  <div className="text-right">
                    <strong className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      {displayCurrentWeight} kg
                    </strong>
                    <p className="text-xs font-bold" style={{ color: isNewAccount ? 'var(--foreground-muted)' : Number(weightDelta) <= 0 ? 'var(--success)' : 'var(--warning)' }}>
                      {isNewAccount ? '0.0 kg this week' : `${Number(weightDelta) <= 0 ? '↓' : '↑'} ${Math.abs(Number(weightDelta))} kg this week`}
                    </p>
                  </div>
                </div>
                <WeightSparkline stats={isNewAccount ? stats.map((s) => ({ ...s, weight: 0 })) : stats} />
              </div>

              {/* Weekly bars */}
              <div className="animate-fade-up card p-5" style={{ animationDelay: '150ms' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Weekly activity</h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>Calories burned per day</p>
                  </div>
                  <div className="text-right">
                    <strong className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      {weeklyCalories.toLocaleString()}
                    </strong>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>kcal this week</p>
                  </div>
                </div>
                <WeeklyBars progress={isNewAccount ? progress.map((p) => ({ ...p, caloriesBurned: 0 })) : progress} />
              </div>
            </div>

            {/* Today's workout + Nutrition */}
            <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              {/* Workout card */}
              <div className="animate-fade-up card p-5" style={{ animationDelay: '180ms' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Today's workout</h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>Recommended for you</p>
                  </div>
                  <Link href="/workouts" className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                    View all →
                  </Link>
                </div>

                {todayWorkout ? (
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                    <div className="group relative h-44 overflow-hidden rounded-2xl sm:w-48" style={{ flexShrink: 0 }}>
                      <img
                        src={todayWorkout.image}
                        alt={todayWorkout.title}
                        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                        style={{ opacity: vidPlaying ? 0 : 1 }}
                      />
                      {todayWorkout.video && (
                        <video
                          ref={videoRef}
                          src={todayWorkout.video}
                          muted={vidMuted}
                          loop
                          playsInline
                          preload="none"
                          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                          style={{ opacity: vidPlaying ? 1 : 0 }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <button
                        onClick={togglePlay}
                        aria-label={vidPlaying ? 'Pause' : 'Play preview'}
                        className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full shadow-lg transition-transform duration-200 group-hover:scale-110"
                        style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--primary)' }}
                      >
                        {vidPlaying ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
                      </button>
                      {todayWorkout.video && (
                        <button
                          onClick={toggleMute}
                          aria-label={vidMuted ? 'Unmute' : 'Mute'}
                          className="absolute bottom-3 right-3 grid size-7 place-items-center rounded-full shadow opacity-0 transition-all duration-200 group-hover:opacity-100"
                          style={{ background: 'rgba(255,255,255,0.9)', color: '#374151' }}
                        >
                          {vidMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
                        </button>
                      )}
                      <span className="absolute left-3 top-3 badge badge-primary">{todayWorkout.type}</span>
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h4 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                        {todayWorkout.title}
                      </h4>
                      <p className="mt-0.5 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                        {todayWorkout.level} · {todayWorkout.duration} min
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[
                          { label: 'Exercises', value: todayWorkout.exercises },
                          { label: 'Sets', value: todayWorkout.sets },
                          { label: 'Calories', value: `${todayWorkout.calories}` },
                        ].map(({ label, value }) => (
                          <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'var(--background-alt)' }}>
                            <p className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                            <p className="mt-0.5 font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
                          </div>
                        ))}
                      </div>

                      <Link
                        href={`/workouts/${todayWorkout.id}`}
                        className="mt-auto pt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 active:scale-95"
                        style={{ background: 'var(--gradient-hero)', color: '#fff' }}
                      >
                        <Play className="size-4 fill-current" /> Start session
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl p-6 text-center" style={{ background: 'var(--background-alt)' }}>
                    <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>No workout scheduled. Browse the library.</p>
                    <Link href="/workouts" className="mt-3 inline-block btn-primary text-sm">Browse workouts</Link>
                  </div>
                )}
              </div>

              {/* Nutrition card */}
              <div className="animate-fade-up card p-5" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Today's nutrition</h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>Calories & macros</p>
                  </div>
                  <Link href="/nutrition" className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                    Full log →
                  </Link>
                </div>

                {nutrition ? (
                  <div className="mt-5 flex flex-col items-center gap-5">
                    <CalorieRing calories={isNewAccount ? 0 : nutrition.calories} goal={nutrition.calorieGoal} />
                    <div className="w-full space-y-3">
                      <MacroBar label="Protein" current={isNewAccount ? 0 : nutrition.protein} goal={160} color="var(--primary)" />
                      <MacroBar label="Carbs" current={isNewAccount ? 0 : nutrition.carbs} goal={200} color="var(--warning)" />
                      <MacroBar label="Fat" current={isNewAccount ? 0 : nutrition.fat} goal={65} color="var(--accent)" />
                    </div>
                    <p className="w-full text-center text-sm font-semibold" style={{ color: 'var(--foreground-muted)' }}>
                      {isNewAccount
                        ? `${nutrition.calorieGoal.toLocaleString()} kcal remaining`
                        : nutrition.calories <= nutrition.calorieGoal
                        ? `${(nutrition.calorieGoal - nutrition.calories).toLocaleString()} kcal remaining`
                        : `${(nutrition.calories - nutrition.calorieGoal).toLocaleString()} kcal over goal`}
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 text-center text-sm" style={{ color: 'var(--foreground-muted)' }}>No meals logged yet.</div>
                )}
              </div>
            </div>

            {/* Step heatmap */}
            <div className="animate-fade-up mt-5 card p-5" style={{ animationDelay: '220ms' }}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Step activity</h3>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>Daily step count this week</p>
                </div>
                <Activity className="size-5" style={{ color: 'var(--primary)' }} />
              </div>
              <ActivityHeatmap progress={isNewAccount ? progress.map((p) => ({ ...p, steps: 0 })) : progress} />
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-7">
                {progress.map((p, i) => (
                  <div key={p.date ? `${p.date}-${p.day}` : `${p.day}-${i}`} className="rounded-xl p-3 text-center" style={{ background: 'var(--background-alt)' }}>
                    <p className="text-[10px] font-semibold" style={{ color: 'var(--foreground-muted)' }}>{p.day}</p>
                    <p className="mt-1 text-xs font-bold" style={{ color: 'var(--foreground)' }}>
                      {isNewAccount ? '0' : p.steps.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Coach preview */}
            <div className="animate-fade-up mt-5" style={{ animationDelay: '240ms' }}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="size-5" style={{ color: 'var(--primary)' }} />
                  <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>AI Coach</h3>
                </div>
                <Link href="/coach" className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--primary)' }}>
                  Full chat <ChevronRight className="size-3.5" />
                </Link>
              </div>
              <div style={{ height: 380 }}>
                <CoachPanel compact />
              </div>
            </div>
          </>
        )}

        {/* Quick Profile Setup Modal */}
        {setupModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(8px)' }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSetupModalOpen(false)
            }}
          >
            <div className="animate-scale-in w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary-light text-primary">
                    <Scale className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground">Set Up Your Profile</h3>
                    <p className="text-xs text-foreground-muted">Configure weight & fitness goal</p>
                  </div>
                </div>
                <button
                  onClick={() => setSetupModalOpen(false)}
                  className="btn-ghost !p-1.5 text-foreground-muted hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              {setupError && (
                <div className="mt-4 rounded-xl bg-danger-light p-3 text-xs font-semibold text-danger">
                  {setupError}
                </div>
              )}

              <form onSubmit={handleQuickSetupSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground">Current Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    value={setupCurrentWeight}
                    onChange={(e) => setSetupCurrentWeight(e.target.value)}
                    placeholder="e.g. 76.5"
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background-alt px-4 py-2.5 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground">Target Weight (kg) - Optional</label>
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    value={setupTargetWeight}
                    onChange={(e) => setSetupTargetWeight(e.target.value)}
                    placeholder="e.g. 72.0"
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background-alt px-4 py-2.5 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground">Primary Fitness Goal</label>
                  <select
                    value={setupGoal}
                    onChange={(e) => setSetupGoal(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background-alt px-4 py-2.5 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:bg-white"
                  >
                    <option value="Lose fat & build lean muscle">Lose fat & build lean muscle</option>
                    <option value="Strength & hypertrophy">Strength & hypertrophy</option>
                    <option value="5K / 10K running endurance">5K / 10K running endurance</option>
                    <option value="Mobility, core & posture recovery">Mobility, core & posture recovery</option>
                    <option value="General cardiovascular fitness">General cardiovascular fitness</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSetupModalOpen(false)}
                    className="btn-outline !text-xs !h-10"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={setupSaving} className="btn-primary !text-xs !h-10">
                    {setupSaving ? 'Saving…' : 'Save & Activate Dashboard'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}

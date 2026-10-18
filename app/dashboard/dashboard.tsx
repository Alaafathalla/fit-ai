'use client'

import { WeeklyBars, WeightSparkline } from '@/components/charts'
import { CoachPanel } from '@/components/coach-panel'
import { Shell } from '@/components/shell'
import { CardSkeleton, ChartSkeleton } from '@/components/ui/skeleton'
import {
  ActivityHeatmapCard,
  DashboardStatCards,
  NewAccountBanner,
  QuickSetupModal,
  TodayNutritionCard,
  TodayWorkoutCard,
  WeeklyPlanWidget,
} from '@/components/dashboard'
import {
  getDailyStats,
  getTodayNutrition,
  getUserProfile,
  getUserWeeklyPlan,
  toggleUserPlanDay,
  getWeeklyProgress,
  getWorkouts,
  type DailyStats,
  type UserProfile,
  type WeeklyProgress,
  type Workout,
  type AthleteWeeklyPlan,
} from '@/lib/api'
import { ArrowRight, Bot, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
  const [setupModalOpen, setSetupModalOpen] = useState(false)

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

  return (
    <Shell title={user ? `${greeting}, ${user.name}` : greeting} subtitle={dateStr} allowedRoles={['USER']}>
      <div className="p-5 sm:p-8">
        {isNewAccount && (
          <NewAccountBanner userName={user?.name} onOpenSetup={() => setSetupModalOpen(true)} />
        )}

        <div className="animate-fade-up mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">{dateStr}</p>
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
          <div className="mb-5 rounded-xl px-4 py-3 text-sm bg-danger-light text-danger">{error}</div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              <ChartSkeleton /><ChartSkeleton />
            </div>
          </div>
        ) : (
          <>
            <DashboardStatCards
              displayCurrentWeight={displayCurrentWeight}
              weightDelta={weightDelta}
              todayCalories={todayCalories}
              todayCalorieGoal={todayCalorieGoal}
              displayStreak={displayStreak}
              displayFitnessScore={displayFitnessScore}
              isNewAccount={isNewAccount}
            />

            {weeklyPlan && <WeeklyPlanWidget weeklyPlan={weeklyPlan} onToggleDay={handleToggleDay} />}

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
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

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <TodayWorkoutCard workout={todayWorkout} />
              <TodayNutritionCard nutrition={nutrition} isNewAccount={isNewAccount} />
            </div>

            <ActivityHeatmapCard progress={progress} isNewAccount={isNewAccount} />

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

        <QuickSetupModal
          open={setupModalOpen}
          onClose={() => setSetupModalOpen(false)}
          onSuccess={loadData}
        />
      </div>
    </Shell>
  )
}

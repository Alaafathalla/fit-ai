'use client'

import { ActivityHeatmap, CalorieRing, MacroBar, WeeklyBars, WeightSparkline } from '@/components/charts'
import { CoachPanel } from '@/components/coach-panel'
import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { StatCard } from '@/components/stat-card'
import {
  getDailyStats,
  getTodayNutrition,
  getUserProfile,
  getWeeklyProgress,
  getWorkouts,
  type DailyStats,
  type UserProfile,
  type WeeklyProgress,
  type Workout,
} from '@/lib/api'
import {
  Activity,
  ArrowRight,
  Check,
  ChevronRight,
  Flame,
  HeartPulse,
  Pause,
  Play,
  Target,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function DashboardPage() {
  const [user, setUser]           = useState<UserProfile | null>(null)
  const [stats, setStats]         = useState<DailyStats[]>([])
  const [progress, setProgress]   = useState<WeeklyProgress[]>([])
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null)
  const [nutrition, setNutrition] = useState<{
    calories: number; calorieGoal: number
    protein: number; carbs: number; fat: number
  } | null>(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading]     = useState(true)

  // video state
  const videoRef                  = useRef<HTMLVideoElement>(null)
  const [vidPlaying, setVidPlaying] = useState(false)
  const [vidMuted,   setVidMuted]   = useState(true)

  useEffect(() => {
    Promise.all([
      getUserProfile(),
      getDailyStats(),
      getWeeklyProgress(),
      getTodayNutrition(),
      getWorkouts('Strength'),
    ]).then(([u, s, p, n, w]) => {
      setUser(u)
      setStats(s)
      setProgress(p)
      setNutrition(n)
      setTodayWorkout(w[1] ?? null)
    }).finally(() => setLoading(false))
  }, [])

  const today = stats[stats.length - 1]

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const togglePlay = () => {
    const vid = videoRef.current
    if (!vid) return
    if (vid.paused) { vid.play().catch(() => {}); setVidPlaying(true) }
    else            { vid.pause(); setVidPlaying(false) }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setVidMuted(videoRef.current.muted)
  }

  return (
    <Shell title={user ? `${greeting}, ${user.name}` : greeting} subtitle={dateStr}>
      <div className="p-5 sm:p-8">

        {/* Page heading */}
        <div className="animate-fade-up mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm lg:hidden" style={{ color: 'var(--foreground-muted)' }}>
              {dateStr}
            </p>
            <h2
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{ color: 'var(--foreground)' }}
            >
              Your fitness overview
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Small steps every day make big changes.
            </p>
          </div>
          <Link href="/workouts" className="btn-primary gap-2 active:scale-95">
            Explore workouts <ArrowRight className="size-4" />
          </Link>
        </div>

        {loading ? <Spinner /> : (
          <>
            {/* Stat cards */}
            <div className="animate-fade-up grid gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: '60ms' }}>
              <StatCard
                label="Current weight"
                value={`${user?.currentWeight ?? 78.4} kg`}
                meta="-1.8 kg"
                icon={Target}
                iconBg="var(--primary-light)"
                iconColor="var(--primary)"
              />
              <StatCard
                label="Calories today"
                value={today ? today.calories.toLocaleString() : '1,240'}
                meta={today ? `${Math.round((today.calories / today.calorieGoal) * 100)}% of goal` : '62%'}
                icon={Flame}
                iconBg="var(--warning-light)"
                iconColor="var(--warning)"
              />
              <StatCard
                label="Workout streak"
                value={`${user?.streak ?? 12} days`}
                meta="Best: 18"
                icon={Zap}
                iconBg="var(--accent-light)"
                iconColor="var(--accent)"
              />
              <StatCard
                label="AI fitness score"
                value={`${user?.fitnessScore ?? 84}/100`}
                meta="+6 this week"
                icon={HeartPulse}
                iconBg="var(--success-light)"
                iconColor="var(--success)"
              />
            </div>

            {/* Charts row */}
            <div className="animate-fade-up mt-6 grid gap-5 xl:grid-cols-2" style={{ animationDelay: '120ms' }}>
              {/* Weight chart */}
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      Weight progress
                    </h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Last 7 days
                    </p>
                  </div>
                  <div className="text-right">
                    <strong className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {today?.weight ?? 78.4} kg
                    </strong>
                    <p className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
                      ↓ 1.8 kg
                    </p>
                  </div>
                </div>
                <WeightSparkline stats={stats} />
              </div>

              {/* Weekly calories */}
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      Weekly activity
                    </h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Calories burned per day
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <strong className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                    {progress.reduce((s, p) => s + p.caloriesBurned, 0).toLocaleString()}
                  </strong>
                  <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                    kcal this week
                  </span>
                </div>
                <WeeklyBars progress={progress} />
              </div>
            </div>

            {/* Today's workout + Nutrition */}
            <div className="animate-fade-up mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]" style={{ animationDelay: '160ms' }}>
              {/* Workout */}
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      Today's workout
                    </h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Push day · Strength
                    </p>
                  </div>
                  <Link href="/workouts" className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                    View plan
                  </Link>
                </div>

                {todayWorkout && (
                  <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                    {/* Video thumbnail */}
                    <div
                      className="group relative h-40 overflow-hidden rounded-xl sm:w-44"
                      style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--background-alt))' }}
                    >
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
                      {/* scrim */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      {/* play/pause */}
                      <button
                        onClick={togglePlay}
                        aria-label={vidPlaying ? 'Pause' : 'Play preview'}
                        className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full shadow transition-transform duration-200 group-hover:scale-110"
                        style={{ background: 'var(--card)', color: 'var(--primary)' }}
                      >
                        {vidPlaying
                          ? <Pause className="size-4 fill-current" />
                          : <Play  className="ml-0.5 size-4 fill-current" />}
                      </button>
                      {/* mute toggle */}
                      {todayWorkout.video && (
                        <button
                          onClick={toggleMute}
                          aria-label={vidMuted ? 'Unmute' : 'Mute'}
                          className="absolute bottom-3 right-3 grid size-7 place-items-center rounded-full opacity-0 shadow transition-all duration-200 group-hover:opacity-100"
                          style={{ background: 'rgba(255,255,255,0.88)', color: '#374151' }}
                        >
                          {vidMuted ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
                        </button>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4
                            className="text-lg font-semibold"
                            style={{ color: 'var(--foreground)' }}
                          >
                            {todayWorkout.title}
                          </h4>
                          <p className="mt-0.5 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                            {todayWorkout.type} · {todayWorkout.level}
                          </p>
                        </div>
                        <span className="badge badge-success">{todayWorkout.duration} min</span>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {[
                          { label: 'Exercises', value: todayWorkout.exercises },
                          { label: 'Sets',      value: todayWorkout.sets },
                          { label: 'Calories',  value: todayWorkout.calories },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="rounded-xl p-3"
                            style={{ background: 'var(--background-alt)' }}
                          >
                            <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                              {label}
                            </p>
                            <p className="mt-1 font-semibold" style={{ color: 'var(--foreground)' }}>
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setCompleted((c) => !c)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95"
                        style={
                          completed
                            ? { background: 'var(--success-light)', color: 'var(--success)' }
                            : { background: 'var(--foreground)', color: 'var(--background)' }
                        }
                      >
                        {completed
                          ? <><Check className="size-4" /> Completed!</>
                          : <><Play className="size-4 fill-current" /> Start workout</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nutrition quick-look */}
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      Today's nutrition
                    </h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Calorie &amp; macro overview
                    </p>
                  </div>
                  <Link href="/nutrition" className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                    Full log
                  </Link>
                </div>

                {nutrition && (
                  <div className="mt-4 flex flex-col items-center gap-5">
                    <CalorieRing calories={nutrition.calories} goal={nutrition.calorieGoal} />
                    <div className="w-full space-y-3">
                      <MacroBar label="Protein" current={nutrition.protein} goal={160} color="var(--primary)" />
                      <MacroBar label="Carbs"   current={nutrition.carbs}   goal={200} color="var(--warning)" />
                      <MacroBar label="Fat"     current={nutrition.fat}     goal={65}  color="var(--accent)"  />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity heatmap */}
            <div className="animate-fade-up mt-5 card p-5" style={{ animationDelay: '200ms' }}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    Step activity
                  </h3>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                    Daily step count this week
                  </p>
                </div>
                <Activity className="size-5" style={{ color: 'var(--primary)' }} />
              </div>
              <ActivityHeatmap progress={progress} />
              <div className="mt-4 flex gap-4">
                {progress.slice(-3).map((p) => (
                  <div
                    key={p.day}
                    className="flex-1 rounded-xl p-3 text-center"
                    style={{ background: 'var(--background-alt)' }}
                  >
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>
                      {p.day}
                    </p>
                    <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {p.steps.toLocaleString()}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--foreground-muted)' }}>steps</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded AI coach */}
            <div className="animate-fade-up mt-5" style={{ animationDelay: '240ms' }}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  AI Coach
                </h3>
                <Link
                  href="/coach"
                  className="flex items-center gap-1 text-xs font-semibold"
                  style={{ color: 'var(--primary)' }}
                >
                  Full chat <ChevronRight className="size-3.5" />
                </Link>
              </div>
              <div style={{ height: 360 }}>
                <CoachPanel compact />
              </div>
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}

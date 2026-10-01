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
  Bot,
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

export function DashboardPage() {
  const [user, setUser]           = useState<UserProfile | null>(null)
  const [stats, setStats]         = useState<DailyStats[]>([])
  const [progress, setProgress]   = useState<WeeklyProgress[]>([])
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null)
  const [nutrition, setNutrition] = useState<{
    calories: number; calorieGoal: number
    protein: number; carbs: number; fat: number
  } | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

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
      setUser(u); setStats(s); setProgress(p); setNutrition(n)
      setTodayWorkout(w[0] ?? null)
    }).catch(() => setError('Some data could not be loaded.'))
      .finally(() => setLoading(false))
  }, [])

  const today = stats[stats.length - 1]

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play().catch(() => {}); setVidPlaying(true) }
    else          { v.pause(); setVidPlaying(false) }
  }
  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setVidMuted(videoRef.current.muted)
  }

  const weeklyCalories = progress.reduce((s, p) => s + p.caloriesBurned, 0)
  const weightDelta = stats.length > 1
    ? (stats[stats.length - 1].weight - stats[0].weight).toFixed(1)
    : '0'

  return (
    <Shell title={user ? `${greeting}, ${user.name}` : greeting} subtitle={dateStr}>
      <div className="p-5 sm:p-8">

        {/* Hero row */}
        <div className="animate-fade-up mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
              {dateStr}
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: 'var(--foreground)' }}>
              Your fitness overview
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Stay consistent — every session counts.
            </p>
          </div>
          <Link href="/workouts" className="btn-primary gap-2">
            Explore workouts <ArrowRight className="size-4" />
          </Link>
        </div>

        {error && !loading && (
          <div className="mb-5 rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        {loading ? <Spinner /> : (
          <>
            {/* Stat cards */}
            <div className="stagger animate-fade-up grid gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: '60ms' }}>
              {[
                {
                  label: 'Current weight', value: `${user?.currentWeight ?? 78.4} kg`,
                  meta: `${Number(weightDelta) <= 0 ? '↓' : '↑'} ${Math.abs(Number(weightDelta))} kg`,
                  metaPositive: Number(weightDelta) <= 0,
                  icon: Target, gradient: 'linear-gradient(135deg,#4f5fed,#7c3aed)',
                  style: { '--i': 0 } as React.CSSProperties,
                },
                {
                  label: 'Calories today', value: today ? today.calories.toLocaleString() : '0',
                  meta: today ? `${Math.round((today.calories / today.calorieGoal) * 100)}% of goal` : '0%',
                  metaPositive: true,
                  icon: Flame, gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
                  style: { '--i': 1 } as React.CSSProperties,
                },
                {
                  label: 'Workout streak', value: `${user?.streak ?? 0} days`,
                  meta: 'Keep it going 🔥',
                  metaPositive: true,
                  icon: Zap, gradient: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                  style: { '--i': 2 } as React.CSSProperties,
                },
                {
                  label: 'AI fitness score', value: `${user?.fitnessScore ?? 84}/100`,
                  meta: '+6 this week',
                  metaPositive: true,
                  icon: HeartPulse, gradient: 'linear-gradient(135deg,#16a34a,#06b6d4)',
                  style: { '--i': 3 } as React.CSSProperties,
                },
              ].map(({ style, ...card }) => (
                <div key={card.label} className="animate-fade-up" style={style}>
                  <StatCard {...card} />
                </div>
              ))}
            </div>

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
                      {today?.weight ?? '—'} kg
                    </strong>
                    <p className="text-xs font-bold" style={{ color: Number(weightDelta) <= 0 ? 'var(--success)' : 'var(--warning)' }}>
                      {Number(weightDelta) <= 0 ? '↓' : '↑'} {Math.abs(Number(weightDelta))} kg this week
                    </p>
                  </div>
                </div>
                <WeightSparkline stats={stats} />
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
                <WeeklyBars progress={progress} />
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
                    {/* Video thumbnail */}
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
                      {/* Play */}
                      <button
                        onClick={togglePlay}
                        aria-label={vidPlaying ? 'Pause' : 'Play preview'}
                        className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full shadow-lg transition-transform duration-200 group-hover:scale-110"
                        style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--primary)' }}
                      >
                        {vidPlaying
                          ? <Pause className="size-4 fill-current" />
                          : <Play  className="ml-0.5 size-4 fill-current" />}
                      </button>
                      {/* Mute */}
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
                          { label: 'Sets',      value: todayWorkout.sets },
                          { label: 'Calories',  value: `${todayWorkout.calories}` },
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
                    <CalorieRing calories={nutrition.calories} goal={nutrition.calorieGoal} />
                    <div className="w-full space-y-3">
                      <MacroBar label="Protein" current={nutrition.protein} goal={160} color="var(--primary)" />
                      <MacroBar label="Carbs"   current={nutrition.carbs}   goal={200} color="var(--warning)" />
                      <MacroBar label="Fat"     current={nutrition.fat}     goal={65}  color="var(--accent)"  />
                    </div>
                    <p className="w-full text-center text-sm font-semibold" style={{ color: 'var(--foreground-muted)' }}>
                      {nutrition.calories <= nutrition.calorieGoal
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
              <ActivityHeatmap progress={progress} />
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-7">
                {progress.map((p) => (
                  <div key={p.day} className="rounded-xl p-3 text-center" style={{ background: 'var(--background-alt)' }}>
                    <p className="text-[10px] font-semibold" style={{ color: 'var(--foreground-muted)' }}>{p.day}</p>
                    <p className="mt-1 text-xs font-bold" style={{ color: 'var(--foreground)' }}>{p.steps.toLocaleString()}</p>
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
      </div>
    </Shell>
  )
}

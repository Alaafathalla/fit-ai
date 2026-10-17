'use client'

import { Shell } from '@/components/shell'
import { getDailyStats, getUserProfile, type UserProfile } from '@/lib/api'
import { Award, Flame, Moon, Target, Trophy, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const CATALOG = [
  { id: 'streak', title: 'Consistency streak', hint: 'Keep showing up for 7+ days', icon: Flame, threshold: (streak: number) => streak >= 7 },
  { id: 'score', title: 'Fit score 80+', hint: 'Hold a fitness score of 80 or higher', icon: Trophy, threshold: (_s: number, score: number) => score >= 80 },
  { id: 'sleep', title: 'Sleep steward', hint: 'Average 7+ hours across the last week', icon: Moon, threshold: (_s: number, _score: number, sleep: number) => sleep >= 7 },
  { id: 'volume', title: 'Work capacity', hint: 'Log 180+ training minutes in 7 days', icon: Zap, threshold: (_s: number, _score: number, _sleep: number, minutes: number) => minutes >= 180 },
  { id: 'goal', title: 'Goal locked', hint: 'Keep a written fitness goal on your profile', icon: Target, threshold: (_s: number, _score: number, _sleep: number, _m: number, hasGoal: boolean) => hasGoal },
  { id: 'hydrate', title: 'Hydration baseline', hint: 'Average hydration at 70% or better', icon: Award, threshold: (_s: number, _score: number, _sleep: number, _m: number, _g: boolean, hydration: number) => hydration >= 70 },
]

export function AchievementsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [minutes, setMinutes] = useState(0)
  const [sleep, setSleep] = useState(0)
  const [hydration, setHydration] = useState(0)

  useEffect(() => {
    Promise.all([getUserProfile(), getDailyStats(7)]).then(([profile, stats]) => {
      setUser(profile)
      setMinutes(stats.reduce((sum, day) => sum + day.workoutMinutes, 0))
      setSleep(stats.length ? stats.reduce((sum, day) => sum + day.sleepHours, 0) / stats.length : 0)
      setHydration(stats.length ? stats.reduce((sum, day) => sum + day.hydration, 0) / stats.length : 0)
    }).catch(() => {})
  }, [])

  const earned = useMemo(() => {
    const streak = user?.streak ?? 0
    const score = user?.fitnessScore ?? 0
    const hasGoal = Boolean(user?.goal)
    return CATALOG.map((item) => ({
      ...item,
      unlocked: item.threshold(streak, score, sleep, minutes, hasGoal, hydration),
    }))
  }, [user, minutes, sleep, hydration])

  const unlockedCount = earned.filter((item) => item.unlocked).length

  return (
    <Shell title="Achievements" subtitle="Progress">
      <div className="mx-auto max-w-5xl space-y-6 p-5 sm:p-8">
        <div className="card p-6" style={{ background: 'var(--gradient-hero)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Milestones</p>
          <h2 className="mt-2 text-3xl font-black text-white">
            {unlockedCount} / {CATALOG.length} unlocked
          </h2>
          <p className="mt-2 text-sm text-white/80">
            These badges follow real training behavior — streaks, sleep, volume, and whether a goal is actually set.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {earned.map((item) => {
            const Icon = item.icon
            return (
              <article
                key={item.id}
                className="card p-5"
                style={{ opacity: item.unlocked ? 1 : 0.55 }}
              >
                <span
                  className="icon-box size-11"
                  style={{
                    background: item.unlocked ? 'var(--gradient-hero)' : 'var(--background-alt)',
                    color: item.unlocked ? '#fff' : 'var(--foreground-muted)',
                  }}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-black">{item.title}</h3>
                <p className="mt-1 text-sm text-foreground-muted">{item.hint}</p>
                <span className={`badge mt-4 ${item.unlocked ? 'badge-success' : 'badge-neutral'}`}>
                  {item.unlocked ? 'Unlocked' : 'In progress'}
                </span>
              </article>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}

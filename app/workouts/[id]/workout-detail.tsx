'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { completeWorkout, getWorkoutById, type Workout } from '@/lib/api'
import {
  ArrowLeft,
  Check,
  Clock3,
  Flame,
  Layers3,
  Loader2,
  PlayCircle,
  Star,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const TYPE_GRADIENTS: Record<string, string> = {
  Strength: '#2563eb',
  Cardio:   '#ea580c',
  HIIT:     '#dc2626',
  Mobility: '#059669',
}

export function WorkoutDetailPage() {
  const params = useParams<{ id: string }>()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!params.id) return
    getWorkoutById(params.id)
      .then((data) => { setWorkout(data); if (!data) setError('Workout not found.') })
      .catch(() => setError('Could not load this workout.'))
      .finally(() => setLoading(false))
  }, [params.id])

  const finish = async () => {
    if (!workout || saving || completed) return
    setSaving(true); setError('')
    try {
      await completeWorkout(workout.id)
      setCompleted(true)
    } catch {
      setError('Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const gradient = workout ? (TYPE_GRADIENTS[workout.type] ?? TYPE_GRADIENTS.Strength) : TYPE_GRADIENTS.Strength

  return (
    <Shell title={workout?.title ?? 'Workout'}>
      <div className="p-5 sm:p-8">
        <Link
          href="/workouts"
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-[var(--background-alt)]"
          style={{ color: 'var(--foreground-muted)' }}
        >
          <ArrowLeft className="size-4" /> Back to workouts
        </Link>

        {loading ? <Spinner label="Loading workout…" /> : !workout ? (
          <div className="card p-12 text-center">
            <h2 className="font-bold" style={{ color: 'var(--foreground)' }}>Workout not found</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--foreground-muted)' }}>{error}</p>
          </div>
        ) : (
          <>
            {/* Main card */}
            <section
              className="animate-fade-up overflow-hidden rounded-3xl lg:grid lg:grid-cols-[1.15fr_0.85fr]"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}
            >
              {/* Media */}
              <div className="relative min-h-[300px] overflow-hidden lg:min-h-[520px]">
                {workout.video ? (
                  <video
                    controls
                    playsInline
                    poster={workout.image}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={workout.video}
                  />
                ) : (
                  <img src={workout.image} alt={workout.title} className="absolute inset-0 h-full w-full object-cover" />
                )}
                {/* Type + level badges */}
                <div className="absolute left-5 top-5 flex gap-2">
                  <span className="badge text-white" style={{ background: gradient }}>{workout.type}</span>
                  <span className="badge badge-neutral">{workout.level}</span>
                </div>
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Info panel */}
              <div className="flex flex-col p-6 sm:p-8">
                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      className="size-4"
                      style={{ color: '#f59e0b', fill: star <= Math.round(workout.rating) ? '#f59e0b' : 'transparent' }}
                    />
                  ))}
                  <span className="ml-1 text-sm font-bold" style={{ color: 'var(--foreground)' }}>{workout.rating}</span>
                  <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>community rating</span>
                </div>

                <h2 className="mt-4 text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                  {workout.title}
                </h2>
                <p className="mt-3 text-sm leading-7" style={{ color: 'var(--foreground-muted)' }}>
                  {workout.description}
                </p>

                {/* Stats grid */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { icon: Clock3,  label: 'Duration',   value: `${workout.duration} min` },
                    { icon: Flame,   label: 'Est. burn',  value: `${workout.calories} kcal` },
                    { icon: Target,  label: 'Exercises',  value: workout.exercises },
                    { icon: Layers3, label: 'Total sets', value: workout.sets },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="rounded-2xl p-4"
                      style={{ background: 'var(--background-alt)' }}
                    >
                      <div
                        className="icon-box size-8 mb-2"
                        style={{ background: gradient, color: '#fff' }}
                      >
                        <Icon className="size-3.5" />
                      </div>
                      <p className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                      <p className="mt-0.5 font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {workout.tags.map((tag) => (
                    <span key={tag} className="badge" style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)', color: 'var(--primary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto pt-8">
                  <button
                    onClick={finish}
                    disabled={saving || completed}
                    className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-all duration-200 active:scale-95 disabled:opacity-60"
                    style={{ background: completed ? 'var(--success)' : gradient, boxShadow: `0 4px 20px color-mix(in srgb, var(--primary) 35%, transparent)` }}
                  >
                    {saving
                      ? <span className="flex items-center justify-center gap-2"><Loader2 className="size-4 animate-spin" /> Saving…</span>
                      : completed
                        ? <span className="flex items-center justify-center gap-2"><Check className="size-4" /> Workout completed!</span>
                        : <span className="flex items-center justify-center gap-2"><PlayCircle className="size-4" /> Mark as complete</span>}
                  </button>
                  {completed && (
                    <p className="mt-3 text-center text-xs font-semibold" style={{ color: 'var(--success)' }}>
                      Great work! Your streak has been updated.
                    </p>
                  )}
                  {error && <p className="mt-2 text-center text-xs" style={{ color: 'var(--danger)' }}>{error}</p>}
                </div>
              </div>
            </section>

            {/* Phase cards */}
            <section className="animate-fade-up mt-6 grid gap-4 md:grid-cols-3" style={{ animationDelay: '80ms' }}>
              {[
                { num: '01', title: 'Warm-up',   time: '5–8 min',   desc: 'Dynamic movement, mobility drills, and rehearsal sets to prime your body.' },
                { num: '02', title: 'Main work',  time: `${Math.max(10, workout.duration - 12)} min`, desc: `${workout.exercises} exercises across ${workout.sets} working sets. Full focus here.` },
                { num: '03', title: 'Cool-down',  time: '5 min',     desc: 'Lower intensity, stretch, breathe, and note how the session went.' },
              ].map(({ num, title, time, desc }) => (
                <div key={title} className="card p-5">
                  <span
                    className="text-xs font-black"
                    style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {num}
                  </span>
                  <h3 className="mt-2 font-bold" style={{ color: 'var(--foreground)' }}>{title}</h3>
                  <p className="mt-0.5 text-xs font-semibold" style={{ color: 'var(--primary)' }}>{time}</p>
                  <p className="mt-3 text-sm leading-6" style={{ color: 'var(--foreground-muted)' }}>{desc}</p>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </Shell>
  )
}

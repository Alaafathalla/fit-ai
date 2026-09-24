'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { completeWorkout, getWorkoutById, type Workout } from '@/lib/api'
import { ArrowLeft, Check, Clock3, Flame, Layers3, Loader2, PlayCircle, Star, Target } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WorkoutDetailPage() {
  const params = useParams<{ id: string }>()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!params.id) return
    getWorkoutById(params.id)
      .then((data) => {
        setWorkout(data)
        if (!data) setError('Workout not found.')
      })
      .catch(() => setError('Could not load this workout.'))
      .finally(() => setLoading(false))
  }, [params.id])

  const finishWorkout = async () => {
    if (!workout || saving || completed) return
    setSaving(true)
    setError('')
    try {
      await completeWorkout(workout.id)
      setCompleted(true)
    } catch {
      setError('Could not save the completed workout. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Shell title={workout?.title ?? 'Workout'}>
      <div className="p-5 sm:p-8">
        <Link href="/workouts" className="mb-6 inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--foreground-muted)' }}>
          <ArrowLeft className="size-4" /> Back to workouts
        </Link>

        {loading ? <Spinner label="Loading workout…" /> : !workout ? (
          <div className="card p-10 text-center">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Workout unavailable</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--foreground-muted)' }}>{error}</p>
          </div>
        ) : (
          <>
            <section className="animate-fade-up grid overflow-hidden rounded-3xl lg:grid-cols-[1.2fr_0.8fr]" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="relative min-h-[330px] overflow-hidden bg-black lg:min-h-[500px]">
                {workout.video ? (
                  <video controls playsInline poster={workout.image} className="absolute inset-0 size-full object-cover" src={workout.video} />
                ) : (
                  <img src={workout.image} alt={workout.title} className="absolute inset-0 size-full object-cover" />
                )}
                <div className="pointer-events-none absolute left-5 top-5 flex gap-2">
                  <span className="badge bg-white/90 text-slate-800">{workout.type}</span>
                  <span className="badge bg-white/90 text-slate-800">{workout.level}</span>
                </div>
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--warning)' }}>
                  <Star className="size-4 fill-current" /> {workout.rating}
                  <span className="ml-1 font-normal" style={{ color: 'var(--foreground-muted)' }}>community rating</span>
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>{workout.title}</h2>
                <p className="mt-3 text-sm leading-6" style={{ color: 'var(--foreground-muted)' }}>{workout.description}</p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { icon: Clock3, label: 'Duration', value: `${workout.duration} min` },
                    { icon: Flame, label: 'Est. burn', value: `${workout.calories} kcal` },
                    { icon: Target, label: 'Exercises', value: workout.exercises },
                    { icon: Layers3, label: 'Total sets', value: workout.sets },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-xl p-3" style={{ background: 'var(--background-alt)' }}>
                      <Icon className="size-4" style={{ color: 'var(--primary)' }} />
                      <p className="mt-2 text-[11px]" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {workout.tags.map((tag) => <span key={tag} className="badge badge-primary">{tag}</span>)}
                </div>

                <div className="mt-auto pt-8">
                  <button
                    onClick={finishWorkout}
                    disabled={saving || completed}
                    className="btn-primary w-full gap-2 py-3 disabled:opacity-70"
                  >
                    {saving ? <><Loader2 className="size-4 animate-spin" /> Saving workout…</>
                      : completed ? <><Check className="size-4" /> Workout completed</>
                        : <><PlayCircle className="size-4" /> Mark workout complete</>}
                  </button>
                  {error && <p className="mt-3 text-center text-xs" style={{ color: 'var(--danger)' }}>{error}</p>}
                </div>
              </div>
            </section>

            <section className="animate-fade-up mt-5 grid gap-4 md:grid-cols-3" style={{ animationDelay: '80ms' }}>
              {[
                ['Warm-up', '5–8 min', 'Easy movement, mobility, and rehearsal sets.'],
                ['Main work', `${Math.max(10, workout.duration - 12)} min`, `${workout.exercises} exercises across ${workout.sets} working sets.`],
                ['Cool-down', '5 min', 'Lower intensity, breathe, and note how the session felt.'],
              ].map(([title, time, description], index) => (
                <div key={title} className="card p-5">
                  <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>0{index + 1}</span>
                  <h3 className="mt-2 font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h3>
                  <p className="mt-1 text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>{time}</p>
                  <p className="mt-3 text-sm leading-6" style={{ color: 'var(--foreground-muted)' }}>{description}</p>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </Shell>
  )
}

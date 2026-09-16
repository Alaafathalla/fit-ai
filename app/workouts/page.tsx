'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getWorkouts, type Workout, type WorkoutType } from '@/lib/api'
import { Check, Clock3, Play, Search, Sparkles, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

const FILTER_TYPES: (WorkoutType | 'All')[] = ['All', 'Strength', 'Cardio', 'HIIT', 'Mobility']

const GRADIENTS: Record<string, string> = {
  Strength: 'linear-gradient(135deg, #dbe5ff, #f0f3ff)',
  Cardio:   'linear-gradient(135deg, #ffecd9, #fff4eb)',
  HIIT:     'linear-gradient(135deg, #ffe0e0, #fff4f4)',
  Mobility: 'linear-gradient(135deg, #d9fff0, #edfff8)',
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [filter, setFilter]     = useState<WorkoutType | 'All'>('All')
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    getWorkouts(filter === 'All' ? undefined : filter)
      .then(setWorkouts)
      .finally(() => setLoading(false))
  }, [filter])

  const visible = workouts.filter((w) =>
    search ? w.title.toLowerCase().includes(search.toLowerCase()) : true
  )

  return (
    <Shell title="Workout Library">
      <div className="p-5 sm:p-8">

        {/* Hero */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
              Move with intention
            </p>
            <h2
              className="mt-1.5 text-3xl font-semibold tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              Find your next workout
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              AI-curated sessions that meet you exactly where you are.
            </p>
          </div>
          <button className="btn-primary gap-2">
            <Sparkles className="size-4" /> Generate with AI
          </button>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div
            className="flex flex-1 items-center gap-2 rounded-xl px-3.5 py-2.5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <Search className="size-4 shrink-0" style={{ color: 'var(--foreground-muted)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workouts…"
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: 'var(--foreground)' }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {FILTER_TYPES.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                style={
                  filter === f
                    ? { background: 'var(--foreground)', color: 'var(--background)' }
                    : {
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground-muted)',
                      }
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Spinner label="Loading workouts…" /> : (
          <>
            <p className="mb-4 mt-6 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              {visible.length} workout{visible.length !== 1 ? 's' : ''}
            </p>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((w) => (
                <article
                  key={w.id}
                  className="overflow-hidden rounded-2xl transition-transform duration-200 hover:-translate-y-1"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative h-48"
                    style={{ background: GRADIENTS[w.type] ?? GRADIENTS.Strength }}
                  >
                    <img
                      src="/fitai-athlete.png"
                      alt={`${w.title} workout`}
                      className="h-full w-full object-cover object-top mix-blend-multiply opacity-75"
                    />
                    <span
                      className="absolute left-4 top-4 badge"
                      style={{ background: 'rgba(255,255,255,0.9)', color: '#374151' }}
                    >
                      {w.type}
                    </span>
                    <div
                      className="absolute right-4 top-4 flex items-center gap-1 rounded-full px-2 py-1"
                      style={{ background: 'rgba(255,255,255,0.9)' }}
                    >
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-semibold text-slate-700">{w.rating}</span>
                    </div>
                    <button
                      aria-label={`Start ${w.title}`}
                      className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full shadow-md"
                      style={{ background: 'var(--card)', color: 'var(--primary)' }}
                    >
                      <Play className="ml-0.5 size-4 fill-current" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      {w.title}
                    </h2>
                    <p
                      className="mt-1 line-clamp-2 text-xs"
                      style={{ color: 'var(--foreground-muted)' }}
                    >
                      {w.description}
                    </p>

                    <div
                      className="mt-3 flex flex-wrap items-center gap-2 text-xs"
                      style={{ color: 'var(--foreground-muted)' }}
                    >
                      <span className="flex items-center gap-1">
                        <Clock3 className="size-3.5" /> {w.duration} min
                      </span>
                      <span className="badge badge-primary">{w.level}</span>
                      <span>{w.calories} kcal</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {w.tags.slice(0, 3).map((t) => (
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
                      className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors"
                      style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--primary)'
                        e.currentTarget.style.color = 'var(--primary-foreground)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--primary-light)'
                        e.currentTarget.style.color = 'var(--primary)'
                      }}
                    >
                      Start workout
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Footer note */}
            <div
              className="mt-6 flex items-center justify-center gap-2 text-sm"
              style={{ color: 'var(--foreground-muted)' }}
            >
              <Check className="size-4" style={{ color: 'var(--success)' }} />
              {visible
                .reduce((s, w) => s + w.completedCount, 0)
                .toLocaleString()}{' '}
              sessions completed across these workouts
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}

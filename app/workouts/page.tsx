'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getWorkouts, type Workout, type WorkoutType } from '@/lib/api'
import { Check, Clock3, Pause, Play, Search, Sparkles, Star, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const FILTER_TYPES: (WorkoutType | 'All')[] = ['All', 'Strength', 'Cardio', 'HIIT', 'Mobility']

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Strength: { bg: '#dbe5ff', text: '#3b4fcf' },
  Cardio:   { bg: '#ffecd9', text: '#b45309' },
  HIIT:     { bg: '#ffe0e0', text: '#b91c1c' },
  Mobility: { bg: '#d9fff0', text: '#065f46' },
}

/* ─── Video thumbnail card ──────────────────────────────────────────────────── */
function WorkoutCard({ w, index }: { w: Workout; index: number }) {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying]   = useState(false)
  const [muted,   setMuted]     = useState(true)
  const [hovered, setHovered]   = useState(false)

  // auto-play on hover
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    if (hovered) {
      vid.currentTime = 0
      vid.play().catch(() => {})
      setPlaying(true)
    } else {
      vid.pause()
      vid.currentTime = 0
      setPlaying(false)
    }
  }, [hovered])

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    const vid = videoRef.current
    if (!vid) return
    if (vid.paused) { vid.play().catch(() => {}); setPlaying(true) }
    else            { vid.pause(); setPlaying(false) }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  const colors = TYPE_COLORS[w.type] ?? TYPE_COLORS.Strength

  return (
    <article
      className="animate-fade-up overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-lg"
      style={{
        background:  'var(--card)',
        border:      '1px solid var(--border)',
        boxShadow:   'var(--shadow-md)',
        animationDelay: `${index * 70}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Thumbnail / Video ── */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* poster image shown until video plays */}
        <img
          src={w.image}
          alt={w.title}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: playing ? 0 : 1 }}
        />

        {/* video element */}
        {w.video && (
          <video
            ref={videoRef}
            src={w.video}
            muted={muted}
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
            style={{ opacity: playing ? 1 : 0 }}
          />
        )}

        {/* dim overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.25)', opacity: hovered ? 1 : 0 }}
        />

        {/* type badge */}
        <span
          className="absolute left-4 top-4 badge"
          style={{ background: colors.bg, color: colors.text }}
        >
          {w.type}
        </span>

        {/* rating */}
        <div
          className="absolute right-4 top-4 flex items-center gap-1 rounded-full px-2 py-1"
          style={{ background: 'rgba(255,255,255,0.92)' }}
        >
          <Star className="size-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-semibold text-slate-700">{w.rating}</span>
        </div>

        {/* play / pause button — always visible, grows on hover */}
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full shadow-md transition-transform duration-200"
          style={{
            background: 'var(--card)',
            color: 'var(--primary)',
            transform: hovered ? 'scale(1.12)' : 'scale(1)',
          }}
        >
          {playing
            ? <Pause className="size-4 fill-current" />
            : <Play  className="ml-0.5 size-4 fill-current" />}
        </button>

        {/* mute toggle — only visible when hovered */}
        {w.video && (
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="absolute bottom-4 left-4 grid size-8 place-items-center rounded-full shadow transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.88)',
              color: '#374151',
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? 'auto' : 'none',
            }}
          >
            {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-5">
        <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>
          {w.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-xs" style={{ color: 'var(--foreground-muted)' }}>
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
              style={{ background: 'var(--background-alt)', color: 'var(--foreground-muted)' }}
            >
              {t}
            </span>
          ))}
        </div>

        <Link
          href={`/workouts/${w.id}`}
          className="mt-4 block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-200 active:scale-95"
          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
        >
          Start workout
        </Link>
      </div>
    </article>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [filter, setFilter]     = useState<WorkoutType | 'All'>('All')
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    getWorkouts(filter === 'All' ? undefined : filter)
      .then(setWorkouts)
      .catch(() => setError('Could not load workouts. Please try again.'))
      .finally(() => setLoading(false))
  }, [filter])

  const visible = workouts.filter((w) =>
    search ? w.title.toLowerCase().includes(search.toLowerCase()) : true,
  )

  return (
    <Shell title="Workout Library">
      <div className="p-5 sm:p-8">

        {/* Hero */}
        <div className="animate-fade-up mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
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
          <Link href="/coach?prompt=Create%20a%20workout%20plan%20for%20me" className="btn-primary gap-2 active:scale-95">
            <Sparkles className="size-4" /> Generate with AI
          </Link>
        </div>

        {/* Search + filters */}
        <div className="animate-fade-up flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '60ms' }}>
          <label
            className="flex flex-1 items-center gap-2 rounded-xl px-3.5 py-2.5 transition-shadow focus-within:ring-2"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              '--tw-ring-color': 'var(--primary)',
            } as React.CSSProperties}
          >
            <Search className="size-4 shrink-0" style={{ color: 'var(--foreground-muted)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workouts…"
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: 'var(--foreground)' }}
            />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {FILTER_TYPES.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 active:scale-95"
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

        {loading ? (
          <Spinner label="Loading workouts…" />
        ) : error ? (
          <div className="card mt-6 p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            <p
              className="animate-fade-in mb-4 mt-6 text-sm"
              style={{ color: 'var(--foreground-muted)', animationDelay: '100ms' }}
            >
              {visible.length} workout{visible.length !== 1 ? 's' : ''}
              {' '}· Hover a card to preview
            </p>

            {visible.length ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((w, i) => (
                  <WorkoutCard key={w.id} w={w} index={i} />
                ))}
              </div>
            ) : (
              <div className="card p-10 text-center">
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>No workouts match your search.</p>
                <button onClick={() => setSearch('')} className="mt-2 text-sm font-semibold" style={{ color: 'var(--primary)' }}>Clear search</button>
              </div>
            )}

            {/* Footer */}
            <div
              className="animate-fade-in mt-6 flex items-center justify-center gap-2 text-sm"
              style={{ color: 'var(--foreground-muted)', animationDelay: '200ms' }}
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

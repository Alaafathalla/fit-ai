'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getWorkouts, type Workout, type WorkoutType } from '@/lib/api'
import {
  Check,
  Clock3,
  Flame,
  Layers3,
  Pause,
  Play,
  Search,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const FILTER_TYPES: (WorkoutType | 'All')[] = ['All', 'Strength', 'Cardio', 'HIIT', 'Mobility']

const TYPE_STYLES: Record<string, { bg: string; color: string; gradient: string }> = {
  Strength: { bg: '#eef0ff', color: '#4f5fed', gradient: 'linear-gradient(135deg,#4f5fed,#7c3aed)' },
  Cardio:   { bg: '#fff4e6', color: '#d97706', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  HIIT:     { bg: '#fee2e2', color: '#dc2626', gradient: 'linear-gradient(135deg,#ef4444,#f59e0b)' },
  Mobility: { bg: '#dcfce7', color: '#16a34a', gradient: 'linear-gradient(135deg,#16a34a,#06b6d4)' },
}

function WorkoutCard({ w, index }: { w: Workout; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted,   setMuted]   = useState(true)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    if (hovered) { vid.currentTime = 0; vid.play().catch(() => {}); setPlaying(true) }
    else         { vid.pause(); vid.currentTime = 0; setPlaying(false) }
  }, [hovered])

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    const vid = videoRef.current
    if (!vid) return
    if (vid.paused) { vid.play().catch(() => {}); setPlaying(true) }
    else            { vid.pause(); setPlaying(false) }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  const styles = TYPE_STYLES[w.type] ?? TYPE_STYLES.Strength

  return (
    <article
      className="animate-fade-up group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        animationDelay: `${index * 65}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Media */}
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={w.image}
          alt={w.title}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
          style={{ opacity: playing ? 0 : 1 }}
        />
        {w.video && (
          <video
            ref={videoRef}
            src={w.video}
            muted={muted}
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: playing ? 1 : 0 }}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Type badge */}
        <span
          className="absolute left-4 top-4 badge"
          style={{ background: styles.bg, color: styles.color }}
        >
          {w.type}
        </span>

        {/* Rating */}
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: 'rgba(255,255,255,0.95)', color: '#1a1a2e' }}>
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {w.rating}
        </div>

        {/* Play / pause */}
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play preview'}
          className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full shadow-lg transition-all duration-200 group-hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.95)', color: styles.color }}
        >
          {playing
            ? <Pause className="size-4 fill-current" />
            : <Play  className="ml-0.5 size-4 fill-current" />}
        </button>

        {/* Mute */}
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

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-12 p-4">
          <h2 className="font-bold text-white drop-shadow">{w.title}</h2>
          <p className="mt-0.5 text-xs text-white/75">{w.level}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="line-clamp-2 text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
          {w.description}
        </p>

        {/* Stats row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { icon: Clock3, value: `${w.duration}m` },
            { icon: Flame,  value: `${w.calories}` },
            { icon: Layers3,value: `${w.sets} sets` },
          ].map(({ icon: Icon, value }) => (
            <div key={value} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5" style={{ background: 'var(--background-alt)' }}>
              <Icon className="size-3.5 shrink-0" style={{ color: 'var(--primary)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {w.tags.slice(0, 3).map((t) => (
            <span key={t} className="badge badge-neutral">{t}</span>
          ))}
        </div>

        <Link
          href={`/workouts/${w.id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 active:scale-95"
          style={{ background: styles.gradient, color: '#fff', boxShadow: `0 4px 14px color-mix(in srgb, ${styles.color} 30%, transparent)` }}
        >
          <Play className="size-4 fill-current" /> Start workout
        </Link>
      </div>
    </article>
  )
}

export function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [filter, setFilter]     = useState<WorkoutType | 'All'>('All')
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    setLoading(true); setError('')
    getWorkouts(filter === 'All' ? undefined : filter)
      .then(setWorkouts)
      .catch(() => setError('Could not load workouts.'))
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
            <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
              Move with intention
            </p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Find your next workout
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              AI-curated sessions that meet you exactly where you are.
            </p>
          </div>
          <Link href="/coach?prompt=Create%20a%20workout%20plan%20for%20me" className="btn-primary gap-2">
            <Sparkles className="size-4" /> Generate with AI
          </Link>
        </div>

        {/* Search + filters */}
        <div className="animate-fade-up flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '60ms' }}>
          <label
            className="flex flex-1 items-center gap-2.5 rounded-xl px-4 py-2.5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <Search className="size-4 shrink-0" style={{ color: 'var(--foreground-muted)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workouts…"
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: 'var(--foreground)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-xs font-semibold" style={{ color: 'var(--foreground-muted)' }}>
                Clear
              </button>
            )}
          </label>

          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {FILTER_TYPES.map((f) => {
              const active = filter === f
              const st = f !== 'All' ? TYPE_STYLES[f] : null
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95"
                  style={active
                    ? { background: st?.gradient ?? 'var(--gradient-hero)', color: '#fff', boxShadow: '0 2px 12px rgba(79,95,237,0.35)' }
                    : { background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
                >
                  {f}
                </button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <Spinner label="Loading workouts…" />
        ) : error ? (
          <div className="card mt-6 p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            <p className="animate-fade-in mt-6 mb-4 text-sm" style={{ color: 'var(--foreground-muted)', animationDelay: '100ms' }}>
              <strong style={{ color: 'var(--foreground)' }}>{visible.length}</strong> workout{visible.length !== 1 ? 's' : ''}
              &nbsp;· Hover a card to preview
            </p>

            {visible.length ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((w, i) => <WorkoutCard key={w.id} w={w} index={i} />)}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>No workouts match your search.</p>
                <button onClick={() => setSearch('')} className="mt-2 text-sm font-bold" style={{ color: 'var(--primary)' }}>
                  Clear search
                </button>
              </div>
            )}

            <div className="animate-fade-in mt-8 flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--foreground-muted)', animationDelay: '200ms' }}>
              <Check className="size-4" style={{ color: 'var(--success)' }} />
              {visible.reduce((s, w) => s + w.completedCount, 0).toLocaleString()} total sessions completed
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}

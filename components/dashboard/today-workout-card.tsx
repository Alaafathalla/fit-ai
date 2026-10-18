import { useRef, useState } from 'react'
import Link from 'next/link'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import type { Workout } from '@/lib/api'

interface TodayWorkoutCardProps {
  workout: Workout | null
}

export function TodayWorkoutCard({ workout }: TodayWorkoutCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [vidPlaying, setVidPlaying] = useState(false)
  const [vidMuted, setVidMuted] = useState(true)

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

  return (
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

      {workout ? (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <div className="group relative h-44 overflow-hidden rounded-2xl sm:w-48" style={{ flexShrink: 0 }}>
            <img
              src={workout.image}
              alt={workout.title}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
              style={{ opacity: vidPlaying ? 0 : 1 }}
            />
            {workout.video && (
              <video
                ref={videoRef}
                src={workout.video}
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
            {workout.video && (
              <button
                onClick={toggleMute}
                aria-label={vidMuted ? 'Unmute' : 'Mute'}
                className="absolute bottom-3 right-3 grid size-7 place-items-center rounded-full shadow opacity-0 transition-all duration-200 group-hover:opacity-100"
                style={{ background: 'rgba(255,255,255,0.9)', color: '#374151' }}
              >
                {vidMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
              </button>
            )}
            <span className="absolute left-3 top-3 badge badge-primary">{workout.type}</span>
          </div>

          <div className="flex flex-1 flex-col">
            <h4 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              {workout.title}
            </h4>
            <p className="mt-0.5 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              {workout.level} · {workout.duration} min
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: 'Exercises', value: workout.exercises },
                { label: 'Sets', value: workout.sets },
                { label: 'Calories', value: `${workout.calories}` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'var(--background-alt)' }}>
                  <p className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                  <p className="mt-0.5 font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
                </div>
              ))}
            </div>

            <Link
              href={`/workouts/${workout.id}`}
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
  )
}

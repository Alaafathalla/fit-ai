'use client'

import type { DailyStats, WeeklyProgress } from '@/lib/api'

// ─── Weight Sparkline ─────────────────────────────────────────────────────────

export function WeightSparkline({ stats }: { stats: DailyStats[] }) {
  if (!stats.length) return null

  const weights = stats.map((s) => s.weight)
  const min = Math.min(...weights) - 0.5
  const max = Math.max(...weights) + 0.5
  const W = 520
  const H = 120

  const toX = (i: number) => (i / (weights.length - 1)) * W
  const toY = (w: number) => H - ((w - min) / (max - min)) * H * 0.85 - H * 0.075

  const pts = weights.map((w, i) => `${toX(i)},${toY(w)}`).join(' L ')
  const area = `M ${pts} L ${W},${H} L 0,${H} Z`
  const line = `M ${pts}`
  const lastX = toX(weights.length - 1)
  const lastY = toY(weights[weights.length - 1])

  const labels = [stats[0], stats[Math.floor(stats.length / 2)], stats[stats.length - 1]]

  return (
    <div className="relative mt-4 h-32 w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity=".18" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#wg)" />
        <path
          d={line}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={lastX}
          cy={lastY}
          r="5"
          fill="var(--card)"
          stroke="var(--primary)"
          strokeWidth="2.5"
        />
      </svg>
      <div
        className="absolute inset-x-0 bottom-0 flex justify-between text-[11px]"
        style={{ color: 'var(--foreground-muted)' }}
      >
        {labels.map((s, i) => (
          <span key={i}>{s.date.slice(5).replace('-', '/')}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Weekly Bars ──────────────────────────────────────────────────────────────

export function WeeklyBars({ progress }: { progress: WeeklyProgress[] }) {
  const today = new Date().getDay()
  const dayIndex = (d: string) =>
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(d)
  const max = Math.max(...progress.map((p) => p.caloriesBurned), 1)

  return (
    <div className="mt-4 flex h-28 items-end gap-1.5">
      {progress.map((p) => {
        const isToday = dayIndex(p.day) === today
        const pct = (p.caloriesBurned / max) * 100
        return (
          <div key={p.day} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="relative flex w-full items-end justify-center" style={{ height: 88 }}>
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${Math.max(pct, 6)}%`,
                  background: isToday ? 'var(--primary)' : 'var(--primary-light)',
                }}
              />
            </div>
            <span
              className="text-[10px] font-medium"
              style={{ color: isToday ? 'var(--primary)' : 'var(--foreground-muted)' }}
            >
              {p.day}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Calorie Ring ─────────────────────────────────────────────────────────────

export function CalorieRing({ calories, goal }: { calories: number; goal: number }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const pct = Math.min(calories / goal, 1)
  const dash = pct * circ

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" role="img" aria-label={`${calories} of ${goal} kcal`}>
      <circle cx="55" cy="55" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
      <circle
        cx="55" cy="55" r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 700ms ease' }}
      />
      <text x="55" y="50" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--foreground)">
        {calories}
      </text>
      <text x="55" y="64" textAnchor="middle" fontSize="10" fill="var(--foreground-muted)">
        of {goal}
      </text>
    </svg>
  )
}

// ─── Macro Bar ────────────────────────────────────────────────────────────────

export function MacroBar({
  label,
  current,
  goal,
  color,
}: {
  label: string
  current: number
  goal: number
  color: string
}) {
  const pct = Math.min((current / goal) * 100, 100)
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--foreground-muted)' }}>{label}</span>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
            {current}g{' '}
            <span style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>/ {goal}g</span>
          </span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ─── Activity Heatmap ─────────────────────────────────────────────────────────

export function ActivityHeatmap({ progress }: { progress: WeeklyProgress[] }) {
  const max = Math.max(...progress.map((p) => p.steps), 1)
  return (
    <div className="flex gap-1.5">
      {progress.map((p) => (
        <div
          key={p.day}
          className="flex flex-1 flex-col items-center gap-1"
          title={`${p.day}: ${p.steps.toLocaleString()} steps`}
        >
          <div
            className="h-8 w-full rounded"
            style={{
              background: 'var(--primary)',
              opacity: Math.max(p.steps / max, 0.12),
            }}
          />
          <span className="text-[10px]" style={{ color: 'var(--foreground-muted)' }}>
            {p.day}
          </span>
        </div>
      ))}
    </div>
  )
}

'use client'

import type { DailyStats, WeeklyProgress } from '@/lib/api'

/* ─── Weight Sparkline ──────────────────────────────────────────────────────── */
export function WeightSparkline({ stats }: { stats: DailyStats[] }) {
  if (stats.length < 2) return null

  const weights = stats.map((s) => s.weight)
  const allZero = weights.every((w) => w === 0)
  if (allZero) {
    return (
      <div className="mt-4 flex h-32 flex-col items-center justify-center rounded-2xl bg-background-alt/50 border border-dashed border-border p-4 text-center">
        <p className="text-xs font-bold text-foreground">0.0 kg recorded</p>
        <p className="text-[11px] text-foreground-muted mt-0.5">
          Enter your weight in profile to begin tracking trends.
        </p>
      </div>
    )
  }

  const W = 520; const H = 128
  const min = Math.min(...weights) - 0.8
  const max = Math.max(...weights) + 0.8
  const toX = (i: number) => (i / (weights.length - 1)) * W
  const toY = (w: number) => H - ((w - min) / (max - min)) * H * 0.82 - H * 0.09

  const pts = weights.map((w, i) => ({ x: toX(i), y: toY(w) }))
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L ${W},${H} L 0,${H} Z`

  const labels = [stats[0], stats[Math.floor(stats.length / 2)], stats[stats.length - 1]]
  const lastPt = pts[pts.length - 1]

  return (
    <div className="relative mt-3 w-full" style={{ height: 148 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="wg-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wg-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
          <filter id="dot-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill="url(#wg-fill)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#wg-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots on each point */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--primary)" opacity={i === pts.length - 1 ? 1 : 0.35} />
        ))}

        {/* Last point glow */}
        <circle cx={lastPt.x} cy={lastPt.y} r="6" fill="var(--card)" stroke="url(#wg-line)" strokeWidth="2.5" filter="url(#dot-glow)" />
      </svg>

      {/* Date labels */}
      <div
        className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] font-medium"
        style={{ color: 'var(--foreground-muted)' }}
      >
        {labels.map((s, i) => (
          <span key={i}>{s.date.slice(5).replace('-', '/')}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Weekly Bars ───────────────────────────────────────────────────────────── */
export function WeeklyBars({ progress }: { progress: WeeklyProgress[] }) {
  const today = new Date().getDay()
  const dayIndex = (d: string) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(d)
  const max = Math.max(...progress.map((p) => p.caloriesBurned), 1)

  return (
    <div className="mt-4 flex h-28 items-end gap-1.5">
      {progress.map((p) => {
        const isToday = dayIndex(p.day) === today
        const pct = Math.max((p.caloriesBurned / max) * 100, 5)
        return (
          <div key={p.day} className="group flex flex-1 flex-col items-center gap-1.5">
            <div
              className="relative w-full overflow-hidden rounded-t-lg"
              style={{ height: 88 }}
              title={`${p.day}: ${p.caloriesBurned} kcal`}
            >
              <div
                className="absolute bottom-0 w-full rounded-t-lg transition-all duration-700"
                style={{
                  height: `${pct}%`,
                  background: isToday
                    ? 'var(--gradient-hero)'
                    : 'color-mix(in srgb, var(--primary) 22%, var(--border))',
                  boxShadow: isToday ? '0 -2px 10px color-mix(in srgb, var(--primary) 40%, transparent)' : 'none',
                }}
              />
            </div>
            <span
              className="text-[10px] font-semibold"
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

/* ─── Calorie Ring ──────────────────────────────────────────────────────────── */
export function CalorieRing({ calories, goal }: { calories: number; goal: number }) {
  const r = 48
  const circ = 2 * Math.PI * r
  const pct = Math.min(calories / goal, 1)
  const dash = pct * circ
  const over = calories > goal

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label={`${calories} of ${goal} kcal`}>
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
      {/* Fill */}
      <circle
        cx="60" cy="60" r={r}
        fill="none"
        stroke={over ? 'var(--warning)' : 'url(#ring-grad)'}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 700ms cubic-bezier(0.16,1,0.3,1)' }}
      />
      <text x="60" y="55" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--foreground)">
        {calories}
      </text>
      <text x="60" y="70" textAnchor="middle" fontSize="9.5" fill="var(--foreground-muted)">
        of {goal} kcal
      </text>
    </svg>
  )
}

/* ─── Macro Bar ─────────────────────────────────────────────────────────────── */
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
          <span className="font-medium" style={{ color: 'var(--foreground-muted)' }}>{label}</span>
          <span className="font-bold" style={{ color: 'var(--foreground)' }}>
            {current}g{' '}
            <span style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>/ {goal}g</span>
          </span>
        </div>
      )}
      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ background: 'color-mix(in srgb, var(--border) 80%, transparent)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

/* ─── Activity Heatmap ──────────────────────────────────────────────────────── */
export function ActivityHeatmap({ progress }: { progress: WeeklyProgress[] }) {
  const max = Math.max(...progress.map((p) => p.steps), 1)
  return (
    <div className="flex gap-1.5">
      {progress.map((p) => {
        const intensity = Math.max(p.steps / max, 0.08)
        return (
          <div
            key={p.day}
            className="group flex flex-1 flex-col items-center gap-1"
            title={`${p.day}: ${p.steps.toLocaleString()} steps`}
          >
            <div
              className="h-9 w-full rounded-lg transition-all duration-300 group-hover:scale-105"
              style={{
                background: `color-mix(in srgb, var(--primary) ${Math.round(intensity * 100)}%, var(--background-alt))`,
              }}
            />
            <span className="text-[10px] font-medium" style={{ color: 'var(--foreground-muted)' }}>
              {p.day}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Mini Trend Spark ──────────────────────────────────────────────────────── */
export function MiniSpark({ values, color = 'var(--primary)' }: { values: number[]; color?: string }) {
  if (values.length < 2) return null
  const W = 80; const H = 28
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const toX = (i: number) => (i / (values.length - 1)) * W
  const toY = (v: number) => H - ((v - min) / range) * (H - 4) - 2
  const d = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ')
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

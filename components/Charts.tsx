'use client'

import type { WeeklyProgress, DailyStats } from '@/lib/api'

/** Smooth SVG area chart for weight trend */
export function WeightChart({ stats }: { stats: DailyStats[] }) {
  if (!stats.length) return null

  const weights = stats.map((s) => s.weight)
  const min = Math.min(...weights) - 0.5
  const max = Math.max(...weights) + 0.5
  const W = 520
  const H = 120
  const pad = 4

  const toX = (i: number) => pad + (i / (weights.length - 1)) * (W - pad * 2)
  const toY = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2)

  const points = weights.map((w, i) => `${toX(i)},${toY(w)}`).join(' L ')
  const area = `M ${points} L ${toX(weights.length - 1)},${H} L ${toX(0)},${H} Z`
  const line = `M ${points}`

  const labels = stats.map((s) => {
    const d = new Date(s.date)
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`
  })

  return (
    <div className="relative h-36 w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full overflow-visible" role="img" aria-label="Weight progress chart">
        <defs>
          <linearGradient id="weightArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#5872ff" stopOpacity=".22" />
            <stop offset="1" stopColor="#5872ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#weightArea)" />
        <path d={line} fill="none" stroke="#5872ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle
          cx={toX(weights.length - 1)}
          cy={toY(weights[weights.length - 1])}
          r="5"
          fill="white"
          stroke="#5872ff"
          strokeWidth="3"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] text-slate-400">
        {labels.map((l, i) =>
          i === 0 || i === Math.floor(labels.length / 2) || i === labels.length - 1 ? (
            <span key={i}>{l}</span>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
    </div>
  )
}

/** Grouped bar chart for weekly calories burned */
export function CaloriesBarChart({ progress }: { progress: WeeklyProgress[] }) {
  const max = Math.max(...progress.map((p) => p.caloriesBurned), 1)
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="flex h-36 items-end gap-1 pt-2">
      {progress.map((p, i) => (
        <div key={p.day} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex w-full flex-1 items-end justify-center">
            <div
              style={{ height: `${Math.max((p.caloriesBurned / max) * 100, 4)}%` }}
              className={`w-full max-w-[28px] rounded-t-md transition-all ${
                i === todayIndex ? 'bg-[#596bff]' : 'bg-[#dce4ff]'
              }`}
            />
          </div>
          <span className={`text-[10px] font-medium ${i === todayIndex ? 'text-[#596bff]' : 'text-slate-400'}`}>
            {p.day}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Horizontal macro progress bars */
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
      <div className="flex justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">
          {current}g / {goal}g
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          style={{ width: `${pct}%` }}
          className={`h-full rounded-full transition-all duration-700 ${color}`}
        />
      </div>
    </div>
  )
}

/** Radial / donut ring for calorie goal */
export function CalorieRing({
  calories,
  goal,
}: {
  calories: number
  goal: number
}) {
  const pct = Math.min(calories / goal, 1)
  const r = 44
  const circ = 2 * Math.PI * r
  const dash = circ * pct

  return (
    <div className="relative flex items-center justify-center">
      <svg width="110" height="110" viewBox="0 0 110 110" role="img" aria-label={`${calories} of ${goal} calories`}>
        <circle cx="55" cy="55" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#596bff"
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-lg font-bold text-slate-900">{calories.toLocaleString()}</p>
        <p className="text-[10px] text-slate-400">/ {goal.toLocaleString()}</p>
      </div>
    </div>
  )
}

/** Simple step-activity dots row */
export function ActivityDots({ progress }: { progress: WeeklyProgress[] }) {
  const max = Math.max(...progress.map((p) => p.steps), 1)
  return (
    <div className="flex items-end gap-2">
      {progress.map((p) => {
        const intensity = p.steps / max
        return (
          <div key={p.day} className="flex flex-1 flex-col items-center gap-1">
            <div
              style={{ opacity: Math.max(intensity, 0.15) }}
              className="size-6 rounded-md bg-[#596bff]"
              title={`${p.steps.toLocaleString()} steps`}
            />
            <span className="text-[10px] text-slate-400">{p.day}</span>
          </div>
        )
      })}
    </div>
  )
}

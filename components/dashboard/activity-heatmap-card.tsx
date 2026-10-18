import { Activity } from 'lucide-react'
import { ActivityHeatmap } from '@/components/charts'
import type { WeeklyProgress } from '@/lib/api'

interface ActivityHeatmapCardProps {
  progress: WeeklyProgress[]
  isNewAccount: boolean
}

export function ActivityHeatmapCard({ progress, isNewAccount }: ActivityHeatmapCardProps) {
  return (
    <div className="animate-fade-up mt-5 card p-5" style={{ animationDelay: '220ms' }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Step activity</h3>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>Daily step count this week</p>
        </div>
        <Activity className="size-5" style={{ color: 'var(--primary)' }} />
      </div>
      <ActivityHeatmap progress={isNewAccount ? progress.map((p) => ({ ...p, steps: 0 })) : progress} />
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-7">
        {progress.map((p, i) => (
          <div key={p.date ? `${p.date}-${p.day}` : `${p.day}-${i}`} className="rounded-xl p-3 text-center" style={{ background: 'var(--background-alt)' }}>
            <p className="text-[10px] font-semibold" style={{ color: 'var(--foreground-muted)' }}>{p.day}</p>
            <p className="mt-1 text-xs font-bold" style={{ color: 'var(--foreground)' }}>
              {isNewAccount ? '0' : p.steps.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import type { AthleteWeeklyPlan } from '@/lib/api'

interface WeeklyPlanWidgetProps {
  weeklyPlan: AthleteWeeklyPlan
  onToggleDay: (dayId: string) => void
}

export function WeeklyPlanWidget({ weeklyPlan, onToggleDay }: WeeklyPlanWidgetProps) {
  return (
    <div className="animate-fade-up mt-6 card overflow-hidden border border-border/80 p-6 bg-gradient-to-br from-card via-slate-50/50 to-blue-50/20 dark:via-slate-900/40 dark:to-blue-950/20 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary">{weeklyPlan.level} · {weeklyPlan.daysPerWeek} Days/Week</span>
            <span className="text-xs font-black uppercase tracking-wider text-primary">Active Training Program</span>
          </div>
          <h3 className="mt-1 text-xl sm:text-2xl font-black text-foreground">
            {weeklyPlan.programTitle}
          </h3>
          <p className="mt-0.5 text-xs text-foreground-muted">
            Goal: <strong className="text-foreground">{weeklyPlan.goal}</strong> · Target Calories: <strong className="text-primary">{weeklyPlan.targetCalories} kcal</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 p-3 border border-emerald-200/60 dark:border-emerald-800/60 text-center min-w-[120px]">
            <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Completed</p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {weeklyPlan.completedWorkoutsCount} <span className="text-xs font-semibold text-foreground-muted">/ {weeklyPlan.totalWorkoutsCount}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/50 p-3 border border-blue-200/60 dark:border-blue-800/60 text-center min-w-[120px]">
            <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">Remaining</p>
            <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {weeklyPlan.remainingWorkoutsCount} <span className="text-xs font-semibold text-foreground-muted">workouts</span>
            </p>
          </div>

          <Link
            href="/planner"
            className="btn btn-primary !h-11 !px-4 !text-xs font-bold inline-flex items-center gap-1.5"
          >
            <CalendarDays className="size-4" />
            View Full Program & Meals →
          </Link>
        </div>
      </div>

      {/* 7-Day Weekly Split Strip */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-foreground">
          <span>Weekly Split Matrix</span>
          <span className="text-emerald-600 dark:text-emerald-400">
            Weekly Completion: {weeklyPlan.completionPercentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
            style={{ width: `${weeklyPlan.completionPercentage}%` }}
          />
        </div>

        {/* 7 Days Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7 pt-2">
          {weeklyPlan.splitDays.map((day) => {
            const isRest = day.type === 'rest'
            const isCompleted = day.status === 'completed'
            const isRemaining = day.status === 'remaining'

            return (
              <div
                key={day.id}
                className={`flex flex-col justify-between rounded-2xl p-3 border text-xs transition ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/[0.04] dark:bg-emerald-950/20'
                    : isRemaining
                    ? 'border-blue-500/40 bg-blue-500/[0.04] dark:bg-blue-950/20'
                    : 'border-border/60 bg-slate-100/50 dark:bg-slate-800/30 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-foreground">{day.dayShort}</span>
                    {isRest ? (
                      <span className="text-[10px] text-foreground-muted font-bold">Rest</span>
                    ) : isCompleted ? (
                      <span className="grid size-4 place-items-center rounded-full bg-emerald-500 text-white text-[9px] font-black">
                        ✓
                      </span>
                    ) : (
                      <span className="grid size-4 place-items-center rounded-full bg-blue-500 text-white text-[9px] font-black">
                        ⏳
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-bold text-foreground line-clamp-1 text-[11px]">{day.title}</p>
                  <p className="mt-0.5 text-[10px] text-foreground-muted line-clamp-1">{day.focus}</p>
                </div>

                {!isRest && (
                  <button
                    type="button"
                    onClick={() => onToggleDay(day.id)}
                    className={`mt-2.5 rounded-lg py-1 text-[10px] font-bold transition ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {isCompleted ? 'Completed ✓' : 'Mark as Done'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

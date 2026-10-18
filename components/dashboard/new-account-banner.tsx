import { Scale } from 'lucide-react'
import Link from 'next/link'

interface NewAccountBannerProps {
  userName?: string
  onOpenSetup: () => void
}

export function NewAccountBanner({ userName, onOpenSetup }: NewAccountBannerProps) {
  return (
    <div className="animate-fade-up mb-7 overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-foreground text-background shadow-xs">
            <Scale className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 border border-slate-200">
                Profile Setup
              </span>
              <span className="text-xs font-medium text-foreground-muted">Initial Configuration</span>
            </div>
            <h3 className="mt-1 text-base font-extrabold text-foreground">
              Welcome to FitAI, {userName || 'Athlete'}
            </h3>
            <p className="mt-0.5 text-xs text-foreground-muted max-w-xl leading-relaxed">
              All metrics show <strong>0</strong> until you enter your current weight and training goal. Configure them below to calculate daily targets, energy expenditure, and streaks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:shrink-0">
          <button
            onClick={onOpenSetup}
            className="btn-primary !h-10 !px-4 !text-xs font-semibold"
          >
            Set Up Profile
          </button>
          <Link href="/settings" className="btn-outline !h-10 !px-4 !text-xs font-semibold">
            Settings
          </Link>
        </div>
      </div>
    </div>
  )
}

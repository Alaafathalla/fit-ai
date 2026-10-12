import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  children?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center justify-center p-8 sm:p-12 text-center animate-fade-up">
      <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-xs">
        <Icon className="size-7" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-foreground-muted max-w-sm">{description}</p>

      {actionLabel && (actionHref || onAction) && (
        <div className="mt-5">
          {actionHref ? (
            <Link href={actionHref} className="btn-primary inline-flex items-center gap-2">
              {actionLabel}
            </Link>
          ) : (
            <button type="button" onClick={onAction} className="btn-primary inline-flex items-center gap-2">
              {actionLabel}
            </button>
          )}
        </div>
      )}

      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}

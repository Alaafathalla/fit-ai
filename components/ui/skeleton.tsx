import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/60', className)}
      {...props}
    />
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card p-5 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-36" />
    </div>
  )
}

export function ChartSkeleton({ height = 'h-56', className }: { height?: string; className?: string }) {
  return (
    <div className={cn('card p-5 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className={cn('w-full rounded-xl flex items-end gap-3 p-4 bg-slate-100/50 dark:bg-slate-900/40', height)}>
        <Skeleton className="h-[40%] w-full rounded-lg" />
        <Skeleton className="h-[75%] w-full rounded-lg" />
        <Skeleton className="h-[50%] w-full rounded-lg" />
        <Skeleton className="h-[90%] w-full rounded-lg" />
        <Skeleton className="h-[65%] w-full rounded-lg" />
        <Skeleton className="h-[80%] w-full rounded-lg" />
        <Skeleton className="h-[60%] w-full rounded-lg" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-border-subtle animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className="h-4 w-full max-w-[90px]" />
        </td>
      ))}
    </tr>
  )
}

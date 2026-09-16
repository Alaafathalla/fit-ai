import { MoreHorizontal } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  meta: string
  metaPositive?: boolean
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

export function StatCard({
  label,
  value,
  meta,
  metaPositive = true,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-1"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="grid size-10 place-items-center rounded-xl"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon className="size-5" />
        </span>
        <MoreHorizontal className="size-4 opacity-30" style={{ color: 'var(--foreground)' }} />
      </div>

      <p className="mt-5 text-sm" style={{ color: 'var(--foreground-muted)' }}>
        {label}
      </p>

      <div className="mt-1 flex items-end gap-2">
        <strong
          className="text-2xl font-semibold tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          {value}
        </strong>
        <span
          className="mb-0.5 text-xs font-semibold"
          style={{ color: metaPositive ? 'var(--success)' : 'var(--danger)' }}
        >
          {meta}
        </span>
      </div>
    </div>
  )
}

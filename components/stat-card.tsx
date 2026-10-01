import type { ElementType } from 'react'

interface StatCardProps {
  label: string
  value: string
  meta: string
  metaPositive?: boolean
  icon: ElementType
  gradient?: string
  iconColor?: string
  badge?: string
}

export function StatCard({
  label,
  value,
  meta,
  metaPositive = true,
  icon: Icon,
  gradient = 'var(--gradient-hero)',
  iconColor = '#fff',
  badge,
}: StatCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Subtle glow in top-right */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.12]"
        style={{ background: gradient }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="icon-box size-11"
          style={{ background: gradient, color: iconColor, boxShadow: `0 4px 14px color-mix(in srgb, var(--primary) 30%, transparent)` }}
        >
          <Icon className="size-5" />
        </div>
        {badge && (
          <span className="badge badge-primary text-[10px]">{badge}</span>
        )}
      </div>

      <p className="mt-4 text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>
        {label}
      </p>

      <div className="mt-1 flex items-end gap-2">
        <strong
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          {value}
        </strong>
      </div>

      <p
        className="mt-1 text-xs font-semibold"
        style={{ color: metaPositive ? 'var(--success)' : 'var(--danger)' }}
      >
        {meta}
      </p>
    </div>
  )
}

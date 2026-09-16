import { Loader2 } from 'lucide-react'

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-20"
      style={{ color: 'var(--foreground-muted)' }}
    >
      <Loader2 className="size-7 animate-spin" style={{ color: 'var(--primary)' }} />
      <span className="text-sm">{label}</span>
    </div>
  )
}

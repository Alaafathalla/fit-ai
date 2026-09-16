import { Sparkles } from 'lucide-react'

export function Logo() {
  return (
    <div className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span
        className="grid size-8 place-items-center rounded-[10px]"
        style={{ background: 'var(--foreground)', color: 'var(--background)' }}
      >
        <Sparkles className="size-4" />
      </span>
      <span style={{ color: 'var(--foreground)' }}>
        fit<span style={{ color: 'var(--primary)' }}>ai</span>
      </span>
    </div>
  )
}

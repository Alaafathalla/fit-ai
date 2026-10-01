import { Sparkles } from 'lucide-react'

export function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className="icon-box size-9"
        style={{ background: 'var(--gradient-hero)', color: '#fff', boxShadow: '0 2px 10px rgba(79,95,237,0.4)' }}
      >
        <Sparkles className="size-4" />
      </div>
      <span className="text-base font-black tracking-tight" style={{ color: 'var(--foreground)' }}>
        fit<span style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ai</span>
      </span>
    </div>
  )
}

'use client'

import type { AuthRole } from '@/lib/auth'
import { Dumbbell, UsersRound } from 'lucide-react'

export function RoleSelector({ value, onChange }: { value: AuthRole; onChange: (role: AuthRole) => void }) {
  const options = [
    { role: 'USER' as const, title: 'Athlete', description: 'Track your training', icon: Dumbbell },
    { role: 'COACH' as const, title: 'Coach', description: 'Guide your clients', icon: UsersRound },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-background-alt p-1.5" role="radiogroup" aria-label="Account type">
      {options.map(({ role, title, description, icon: Icon }) => {
        const active = value === role
        return (
          <button
            key={role}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(role)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all"
            style={{
              background: active ? '#fff' : 'transparent',
              boxShadow: active ? '0 3px 12px rgba(30,40,90,0.08)' : 'none',
              color: active ? 'var(--foreground)' : 'var(--foreground-muted)',
            }}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ background: active ? 'var(--primary-light)' : 'rgba(255,255,255,0.5)', color: active ? 'var(--primary)' : 'var(--foreground-muted)' }}>
              <Icon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">{title}</span>
              <span className="hidden text-[10px] text-foreground-muted sm:block">{description}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

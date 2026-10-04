'use client'

import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'

interface PasswordFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
  id?: string
}

export function PasswordField({ value, onChange, placeholder = 'Enter your password', autoComplete = 'current-password', id = 'password' }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="input-base h-12 w-full pl-10 pr-11"
        required
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-foreground-muted transition hover:bg-background-alt hover:text-foreground"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

'use client'

export type ThemeMode = 'light' | 'dark'

export interface AccentColor {
  id: string
  label: string
  hex: string
  light: string
  dark: string
}

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'purple', label: 'Royal Purple', hex: '#7c3aed', light: '#f5f3ff', dark: '#6d28d9' },
  { id: 'violet', label: 'Electric Violet', hex: '#8b5cf6', light: '#f3e8ff', dark: '#7c3aed' },
  { id: 'blue', label: 'Cobalt Blue', hex: '#2563eb', light: '#eff6ff', dark: '#1d4ed8' },
  { id: 'emerald', label: 'Emerald Green', hex: '#059669', light: '#ecfdf5', dark: '#047857' },
  { id: 'amber', label: 'Kinetic Orange', hex: '#ea580c', light: '#fff7ed', dark: '#c2410c' },
  { id: 'red', label: 'Crimson Red', hex: '#dc2626', light: '#fef2f2', dark: '#b91c1c' },
]

const THEME_KEY = 'fitai-theme-mode'
const ACCENT_KEY = 'fitai-theme-accent'

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const val = localStorage.getItem(THEME_KEY)
  if (val === 'dark' || val === 'light') return val
  return 'light'
}

export function getStoredAccent(): string {
  if (typeof window === 'undefined') return 'purple'
  const val = localStorage.getItem(ACCENT_KEY)
  if (!val || val === 'slate' || val === 'blue') return 'purple'
  return val
}

let isApplyingTheme = false

export function applyTheme(mode: ThemeMode, accentId: string = 'purple') {
  if (typeof window === 'undefined') return
  if (isApplyingTheme) return

  isApplyingTheme = true
  try {
    const root = document.documentElement

    // 1. Toggle dark class
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // 2. Set accent CSS variables
    const accent = ACCENT_COLORS.find((a) => a.id === accentId) || ACCENT_COLORS[0]
    root.style.setProperty('--primary', accent.hex)
    root.style.setProperty('--primary-light', accent.light)
    root.style.setProperty('--primary-dark', accent.dark)
    root.style.setProperty('--ring', accent.hex)

    // 3. Save to localStorage
    try {
      localStorage.setItem(THEME_KEY, mode)
      localStorage.setItem(ACCENT_KEY, accentId)
    } catch {}

    // 4. Broadcast event
    window.dispatchEvent(
      new CustomEvent('fitai-theme-changed', {
        detail: { mode, accentId },
      })
    )
  } finally {
    isApplyingTheme = false
  }
}

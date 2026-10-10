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
  { id: 'blue', label: 'Cobalt Blue', hex: '#2563eb', light: '#eff6ff', dark: '#1d4ed8' },
  { id: 'slate', label: 'Obsidian Slate', hex: '#0f172a', light: '#f1f5f9', dark: '#020617' },
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
  if (typeof window === 'undefined') return 'blue'
  return localStorage.getItem(ACCENT_KEY) || 'blue'
}

export function applyTheme(mode: ThemeMode, accentId: string = 'blue') {
  if (typeof window === 'undefined') return

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
}

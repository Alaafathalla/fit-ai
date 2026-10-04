'use client'

/**
 * Dark mode removed. ThemeProvider is kept as a passthrough so existing
 * imports don't break. All dark-mode logic has been stripped.
 */

export type Theme = 'light'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function useTheme() {
  return {
    theme: 'light' as Theme,
    setTheme: (_t: Theme) => {},
    toggleTheme: () => {},
  }
}

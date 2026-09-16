import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FitAI Coach — Your personal AI fitness coach',
  description: 'Personalized workouts, nutrition plans, and progress tracking powered by AI.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)'  },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0d1117'  },
  ],
}

// Injected before React hydrates — reads localStorage and sets .dark on <html>
// to prevent a flash of the wrong theme.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('fitai-theme');
    var prefer  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme   = stored === 'dark' || stored === 'light' ? stored : prefer;
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script runs synchronously — no FOUC / theme flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

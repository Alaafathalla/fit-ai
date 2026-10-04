import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in | FitAI Coach',
  description: 'Secure athlete and coach access to FitAI.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}

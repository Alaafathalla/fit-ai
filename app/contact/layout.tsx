import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Contact — FitAI',
  description: 'Contact FitAI about the product, coach workspace, billing, or account access.',
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}

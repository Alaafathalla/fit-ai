import { HelpView } from './help-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center — FitAI',
  description: 'Answers for signing in, athlete vs coach workspaces, logging training, and managing your FitAI account.',
}

export default function HelpPage() {
  return <HelpView />
}

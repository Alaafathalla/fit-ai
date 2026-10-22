import { FeaturesClient } from '@/components/marketing/features-client'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Platform Architecture & Features — FitAI',
  description:
    'Complete technical breakdown of the autonomous periodization engine, biometric recovery telemetry, computer-vision macro intake, and coach command cockpit.',
}

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <FeaturesClient />
    </MarketingShell>
  )
}

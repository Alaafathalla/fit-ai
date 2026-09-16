'use client'

import { CoachCapabilities, CoachPanel } from '@/components/coach-panel'
import { Shell } from '@/components/shell'

export default function AICoachPage() {
  return (
    <Shell title="AI Coach">
      <div className="mx-auto max-w-3xl p-5 sm:p-8">
        {/* Hero */}
        <div className="mb-6">
          <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            Personal guidance
          </p>
          <h2
            className="mt-1.5 text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Your AI Coach
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Ask anything about training, nutrition, recovery — or just get motivated.
          </p>
        </div>

        {/* Capability chips */}
        <div className="mb-5">
          <CoachCapabilities />
        </div>

        {/* Full-height chat panel */}
        <div style={{ height: 560 }}>
          <CoachPanel compact />
        </div>
      </div>
    </Shell>
  )
}

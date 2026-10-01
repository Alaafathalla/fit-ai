'use client'

import { CoachCapabilities, CoachPanel } from '@/components/coach-panel'
import { Shell } from '@/components/shell'
import { Bot, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AICoachPage() {
  const [initialPrompt, setInitialPrompt] = useState('')

  useEffect(() => {
    setInitialPrompt(new URLSearchParams(window.location.search).get('prompt') ?? '')
  }, [])

  return (
    <Shell title="AI Coach">
      <div className="mx-auto max-w-3xl p-5 sm:p-8">

        {/* Hero banner */}
        <div
          className="animate-fade-up mb-7 overflow-hidden rounded-3xl p-7 sm:p-9"
          style={{
            background: 'var(--gradient-hero)',
            boxShadow: '0 8px 40px rgba(79,95,237,0.35)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="icon-box size-10" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                  <Bot className="size-5" />
                </div>
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Personal guidance</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Your AI Coach</h2>
              <p className="mt-2 text-sm text-white/75 leading-relaxed max-w-md">
                Ask anything about training, nutrition, or recovery — get personalized answers based on your data.
              </p>
            </div>
            <Sparkles className="size-8 text-white/30 shrink-0 animate-float" />
          </div>

          <div className="mt-5">
            <CoachCapabilities />
          </div>
        </div>

        {/* Chat panel */}
        <div className="animate-fade-up" style={{ height: 580, animationDelay: '80ms' }}>
          <CoachPanel compact initialPrompt={initialPrompt} />
        </div>
      </div>
    </Shell>
  )
}

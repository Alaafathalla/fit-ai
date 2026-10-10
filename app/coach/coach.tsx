'use client'

import { CoachCapabilities, CoachPanel } from '@/components/coach-panel'
import { Shell } from '@/components/shell'
import { Compass, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AICoachPage() {
  const [initialPrompt, setInitialPrompt] = useState('')

  useEffect(() => {
    setInitialPrompt(new URLSearchParams(window.location.search).get('prompt') ?? '')
  }, [])

  return (
    <Shell title="Training Advisor">
      <div className="mx-auto max-w-3xl p-5 sm:p-8">

        {/* Hero banner */}
        <div className="animate-fade-up mb-7 overflow-hidden rounded-2xl border border-slate-800 bg-[#090d16] p-6 sm:p-8 text-white shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="grid size-9 place-items-center rounded-lg border border-slate-700 bg-slate-800 text-blue-400">
                  <Compass className="size-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Performance Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Training Advisor</h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-lg">
                Evidence-based recommendations for workout splits, progressive overload, and nutrition targets calibrated to your activity log.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 text-xs font-semibold text-slate-300">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>Bio-Telemetry Active</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80">
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

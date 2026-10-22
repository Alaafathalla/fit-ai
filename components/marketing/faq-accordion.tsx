'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const FAQS = [
  {
    q: 'Can I use FitAI as an independent athlete without a personal coach?',
    a: 'Absolutely. FitAI functions as a complete autonomous athletic operating system. The AI engine programs your progressive overload cycles, adjusts your daily weights according to recovery biomarkers, and budgets your nutrition targets. If you later choose to hire a coach, you can invite them with one click into your existing data.',
  },
  {
    q: 'How does the AI auto-regulation adapt my workout in real time?',
    a: 'FitAI evaluates three distinct signals: (1) Pre-workout autonomic readiness derived from your sleep stages and overnight HRV, (2) Subjective RPE (Rate of Perceived Exertion) logged on your previous set, and (3) Cumulative 7-day fatigue volume. If your nervous system is in a deficit, it will recommend reducing top-end sets or swapping to an isometric/recovery variation to avoid overreaching.',
  },
  {
    q: 'What wearables and devices integrate with FitAI?',
    a: 'FitAI natively synchronizes with Apple Health (Apple Watch Ultra & Series), Whoop 4.0, Garmin Connect, Oura Ring, and Strava. We ingest sleep architecture, resting heart rate, active calories burned, and ambient workout telemetry seamlessly in the background.',
  },
  {
    q: 'How does the Coach Workspace work for trainers with multiple clients?',
    a: 'Coaches receive a dedicated command center. You can manage 20, 50, or 100+ athletes with automated red-flag alerts that surface clients who missed sessions, logged high soreness, or suffered drops in HRV. You can batch-assign training blocks, leave voice memos on exercise video submissions, and review compliance in seconds.',
  },
  {
    q: 'Is my biometric and health data private and encrypted?',
    a: 'Yes. FitAI applies enterprise-grade 256-bit AES encryption at rest and TLS 1.3 in transit. Your biometric logs and dietary records are strictly confidential and are never monetized, shared with third-party advertisers, or used to train public language models without explicit consent.',
  },
]

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx
        return (
          <div
            key={idx}
            className={`rounded-2xl border transition-all ${
              isOpen
                ? 'border-purple-300 bg-white shadow-md shadow-purple-500/5 ring-1 ring-purple-100'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between p-5 text-left transition"
            >
              <span className="text-base font-bold text-slate-900 pr-4">{faq.q}</span>
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                  isOpen ? 'rotate-180 bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <ChevronDown className="size-4" />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-600 border-t border-slate-100 mt-1 font-normal">
                {faq.a}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

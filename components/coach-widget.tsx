'use client'

import { CoachPanel } from '@/components/coach-panel'
import { Bot, Maximize2, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function CoachWidget() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Hide the floating widget if user is already on the dedicated /coach page
  if (pathname === '/coach') return null

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open AI Training Advisor"
          className="group flex items-center gap-2.5 rounded-full px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #4c1d95 100%)',
            boxShadow: '0 8px 30px color-mix(in srgb, var(--primary) 45%, transparent)',
          }}
        >
          <div className="relative flex items-center justify-center">
            <Bot className="size-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-xs font-extrabold tracking-wide">
            {open ? 'Close Advisor' : 'AI Coach'}
          </span>
          <Sparkles className="size-3 text-purple-200" />
        </button>
      </div>

      {/* Floating Chat Window Modal / Popup */}
      {open && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[460px] animate-scale-in">
          <div
            className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            style={{ height: '560px', maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Top Bar with quick navigation to full coach cockpit */}
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background-alt/70"
            >
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
                  Live Bio-Telemetry Advisor
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/coach"
                  onClick={() => setOpen(false)}
                  title="Expand to Full Cockpit"
                  className="rounded-lg p-1.5 text-foreground-muted hover:bg-card hover:text-foreground transition"
                >
                  <Maximize2 className="size-3.5" />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  title="Close Advisor"
                  className="rounded-lg p-1.5 text-foreground-muted hover:bg-card hover:text-foreground transition"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Embedded Coach Panel */}
            <div className="flex-1 overflow-hidden">
              <CoachPanel compact />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { getChatHistory, sendCoachMessage } from '@/lib/api'
import {
  Bot,
  Dumbbell,
  HeartPulse,
  Loader2,
  Send,
  TrendingUp,
  Utensils,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const QUICK_ACTIONS = [
  'Create a fat-loss workout',
  'Adjust my calorie target',
  'Best foods for muscle gain',
  'Help me sleep better',
]

const GREETING: Message = {
  id: '__greeting__',
  from: 'ai',
  text: 'Your recovery looks strong today. Ready for a focused session? Ask me anything about training, nutrition, or recovery.',
  timestamp: new Date().toISOString(),
}

interface Message {
  id: string
  from: 'ai' | 'user'
  text: string
  timestamp: string
}

export function CoachPanel({ compact = false, initialPrompt = '' }: { compact?: boolean; initialPrompt?: string }) {
  const [input, setInput]         = useState(initialPrompt)
  const [loading, setLoading]     = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [messages, setMessages]   = useState<Message[]>([GREETING])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialPrompt) setInput(initialPrompt)
  }, [initialPrompt])

  // Load persisted history on mount
  useEffect(() => {
    getChatHistory()
      .then((history) => {
        if (history.length > 0) {
          setMessages(history)
        }
      })
      .catch(() => {/* keep greeting if API fails */})
      .finally(() => setHistoryLoaded(true))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text = input) => {
    if (!text.trim() || loading) return
    setInput('')
    // Optimistically add user message
    const tempUserMsg: Message = {
      id: `tmp-${Date.now()}`,
      from: 'user',
      text,
      timestamp: new Date().toISOString(),
    }
    setMessages((m) => [...m, tempUserMsg])
    setLoading(true)
    try {
      const reply = await sendCoachMessage(text)
      // Replace any temp + add real AI reply
      setMessages((m) => [...m, reply])
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `err-${Date.now()}`,
          from: 'ai',
          text: 'Sorry, I had trouble responding. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const showQuickActions = historyLoaded && messages.length <= 1

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl"
      style={{
        height: compact ? '100%' : '600px',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="grid size-10 place-items-center rounded-xl"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            <Bot className="size-5" />
          </span>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
              AI Coach
            </h3>
            <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
              Powered by FitAI
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--success)' }}>
          <span className="size-2 rounded-full" style={{ background: 'var(--success)' }} />
          Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.from === 'ai' ? 'rounded-tl-sm' : 'ml-auto rounded-tr-sm'
            }`}
            style={
              m.from === 'ai'
                ? { background: 'var(--background-alt)', color: 'var(--foreground)' }
                : { background: 'var(--foreground)', color: 'var(--background)' }
            }
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div
            className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3"
            style={{ background: 'var(--background-alt)' }}
          >
            <Loader2 className="size-4 animate-spin" style={{ color: 'var(--foreground-muted)' }} />
          </div>
        )}

        {/* Quick actions — only shown before first user message */}
        {showQuickActions && (
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full border px-3 py-1.5 text-xs transition-colors active:scale-95"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground-muted)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)'
                  e.currentTarget.style.color = 'var(--primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--foreground-muted)'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div
          className="flex items-center gap-2 rounded-xl p-1.5"
          style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229)
                send()
            }}
            placeholder="Ask your coach anything…"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
            style={{ color: 'var(--foreground)' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="grid size-8 place-items-center rounded-lg text-white transition-opacity disabled:opacity-40 active:scale-95"
            style={{ background: 'var(--primary)' }}
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Capability chips ─────────────────────────────────────────────────────────

export function CoachCapabilities() {
  const chips = [
    { icon: Dumbbell,   label: 'Workout plans'     },
    { icon: Utensils,   label: 'Nutrition advice'  },
    { icon: HeartPulse, label: 'Recovery tips'     },
    { icon: TrendingUp, label: 'Progress analysis' },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
        >
          <Icon className="size-3.5" />
          {label}
        </div>
      ))}
    </div>
  )
}

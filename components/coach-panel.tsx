'use client'

import { getChatHistory, sendCoachMessage } from '@/lib/api'
import { Bot, Dumbbell, HeartPulse, Loader2, Send, TrendingUp, Utensils } from 'lucide-react'
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
  const [input,         setInput]         = useState(initialPrompt)
  const [loading,       setLoading]       = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [messages,      setMessages]      = useState<Message[]>([GREETING])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (initialPrompt) setInput(initialPrompt) }, [initialPrompt])

  useEffect(() => {
    getChatHistory()
      .then((history) => { if (history.length > 0) setMessages(history) })
      .catch(() => {})
      .finally(() => setHistoryLoaded(true))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text = input) => {
    if (!text.trim() || loading) return
    setInput('')
    const tmpMsg: Message = { id: `tmp-${Date.now()}`, from: 'user', text, timestamp: new Date().toISOString() }
    setMessages((m) => [...m, tmpMsg])
    setLoading(true)
    try {
      const reply = await sendCoachMessage(text)
      setMessages((m) => [...m, reply])
    } catch {
      setMessages((m) => [...m, {
        id: `err-${Date.now()}`, from: 'ai',
        text: 'Sorry, I had trouble responding. Please try again.',
        timestamp: new Date().toISOString(),
      }])
    } finally { setLoading(false) }
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
        style={{ borderBottom: '1px solid var(--border)', background: 'color-mix(in srgb, var(--primary) 5%, var(--card))' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="icon-box size-10"
            style={{ background: 'var(--gradient-hero)', color: '#fff', boxShadow: '0 2px 8px rgba(79,95,237,0.4)' }}
          >
            <Bot className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>AI Coach</h3>
            <p className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>Powered by FitAI</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--success)' }}>
          <span className="size-2 rounded-full animate-pulse-ring" style={{ background: 'var(--success)' }} />
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
            style={m.from === 'ai'
              ? { background: 'var(--background-alt)', color: 'var(--foreground)' }
              : { background: 'var(--gradient-hero)', color: '#fff' }}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: 'var(--background-alt)' }}>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 rounded-full"
                  style={{ background: 'var(--foreground-muted)', animation: `fade-in 0.6s ${i * 0.2}s ease infinite alternate` }}
                />
              ))}
            </div>
          </div>
        )}

        {showQuickActions && (
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95"
                style={{ border: '1px solid var(--border)', color: 'var(--foreground-muted)', background: 'var(--card)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)'
                  e.currentTarget.style.color = 'var(--primary)'
                  e.currentTarget.style.background = 'var(--primary-light)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--foreground-muted)'
                  e.currentTarget.style.background = 'var(--card)'
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
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) send()
            }}
            placeholder="Ask your coach anything…"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
            style={{ color: 'var(--foreground)' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="grid size-8 place-items-center rounded-lg text-white transition-all duration-150 disabled:opacity-40 active:scale-95"
            style={{ background: 'var(--gradient-hero)' }}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export function CoachCapabilities() {
  const chips = [
    { icon: Dumbbell,   label: 'Workout plans',    color: 'var(--primary)' },
    { icon: Utensils,   label: 'Nutrition advice',  color: 'var(--success)' },
    { icon: HeartPulse, label: 'Recovery tips',     color: 'var(--accent)'  },
    { icon: TrendingUp, label: 'Progress analysis', color: 'var(--warning)' },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(({ icon: Icon, label, color }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', backdropFilter: 'blur(4px)' }}
        >
          <Icon className="size-3.5" />
          {label}
        </div>
      ))}
    </div>
  )
}

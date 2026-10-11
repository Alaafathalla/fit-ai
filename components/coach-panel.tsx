'use client'

import { clearChatHistory, getChatHistory, sendCoachMessage } from '@/lib/api'
import { Check, Compass, Copy, Dumbbell, HeartPulse, Loader2, RotateCcw, Send, Sparkles, TrendingUp, Utensils } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const SUGGESTIONS = [
  'Create a 4-Day PPL split',
  'Calculate my protein & macros',
  'Fat loss blueprint',
  'Pre & post workout meals',
  'Evidence on creatine',
  'How to do a deload week',
  'Fix knee pain on squats',
  'Upper / Lower 4-day split',
]

const GREETING: Message = {
  id: '__greeting__',
  from: 'ai',
  text: 'Hey! I am your **FitAI Training Advisor**. I can design customized workout splits, calculate your macros, or diagnose recovery & mobility plateaus. What are we optimizing today?',
  timestamp: new Date().toISOString(),
}

interface Message {
  id: string
  from: 'ai' | 'user'
  text: string
  timestamp: string
}

function renderInlineFormatting(str: string) {
  const parts = str.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

function FormattedCoachMessage({ text, from }: { text: string; from: 'ai' | 'user' }) {
  if (from === 'user') {
    return <p className="leading-relaxed whitespace-pre-wrap">{text}</p>
  }

  const lines = text.split('\n')
  return (
    <div className="space-y-1.5 text-xs sm:text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-1" />

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="pt-2 text-xs font-black uppercase tracking-wider text-primary">
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          )
        }

        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^[•\-*]\s+/, '')
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 leading-relaxed">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{renderInlineFormatting(content)}</span>
            </div>
          )
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 leading-relaxed">
              <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-black text-primary">
                {numMatch[1]}
              </span>
              <span>{renderInlineFormatting(numMatch[2])}</span>
            </div>
          )
        }

        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineFormatting(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

export function CoachPanel({ compact = false, initialPrompt = '' }: { compact?: boolean; initialPrompt?: string }) {
  const [input,         setInput]         = useState(initialPrompt)
  const [loading,       setLoading]       = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [messages,      setMessages]      = useState<Message[]>([GREETING])
  const [copiedId,      setCopiedId]      = useState<string | null>(null)
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
  }, [messages, loading])

  const send = async (text = input) => {
    const toSend = text.trim()
    if (!toSend || loading) return
    setInput('')
    const tmpMsg: Message = { id: `tmp-${Date.now()}`, from: 'user', text: toSend, timestamp: new Date().toISOString() }
    setMessages((m) => [...m, tmpMsg])
    setLoading(true)
    try {
      const reply = await sendCoachMessage(toSend)
      setMessages((m) => [...m, reply])
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `err-${Date.now()}`,
          from: 'ai',
          text: 'Sorry, I had trouble formulating a response. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (confirm('Start a fresh conversation with your advisor?')) {
      try {
        await clearChatHistory()
      } catch {}
      setMessages([GREETING])
    }
  }

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

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
        className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--card)' }}
      >
        <div className="flex items-center gap-3">
          <div className="grid size-8 sm:size-9 place-items-center rounded-lg bg-slate-900 text-white shadow-xs">
            <Compass className="size-4 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-foreground">Training Advisor</h3>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-foreground-muted">Calibrated with your biometrics & goals</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          title="Reset chat history"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background-alt/60 px-2.5 py-1 text-[11px] font-bold text-foreground-muted transition hover:bg-background-alt hover:text-foreground"
        >
          <RotateCcw className="size-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3.5 overflow-y-auto p-4 sm:p-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`group relative max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
              m.from === 'ai' ? 'rounded-tl-sm' : 'ml-auto rounded-tr-sm'
            }`}
            style={
              m.from === 'ai'
                ? { background: 'var(--background-alt)', color: 'var(--foreground)', border: '1px solid var(--border)' }
                : { background: 'var(--primary)', color: '#fff' }
            }
          >
            <FormattedCoachMessage text={m.text} from={m.from} />

            {m.from === 'ai' && (
              <button
                onClick={() => copyText(m.id, m.text)}
                title="Copy response"
                className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-card hover:text-foreground text-foreground-muted"
              >
                {copiedId === m.id ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: 'var(--background-alt)' }}>
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted">
              <Loader2 className="size-3.5 animate-spin text-primary" />
              <span>Analyzing performance telemetry…</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions pills */}
      <div className="border-t border-border/70 bg-background-alt/30 px-3 py-2">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
          <span className="flex items-center gap-1 font-bold text-foreground-muted/70 whitespace-nowrap pl-1 pr-1">
            <Sparkles className="size-3 text-primary" /> Suggestions:
          </span>
          {SUGGESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 font-semibold text-foreground-muted transition hover:border-primary/50 hover:bg-primary-light hover:text-primary active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--card)' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex items-center gap-2 rounded-xl p-1.5"
          style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach (e.g., 'Make me a 4-day PPL routine' or 'Calculate my protein')..."
            className="min-w-0 flex-1 bg-transparent px-2.5 text-xs sm:text-sm outline-none text-foreground placeholder:text-foreground-muted/60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-white transition-all duration-150 disabled:opacity-40 active:scale-95"
            style={{ background: 'var(--primary)' }}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}

export function CoachCapabilities() {
  const chips = [
    { icon: Dumbbell,   label: 'Training Programs',    color: 'var(--primary)' },
    { icon: Utensils,   label: 'Nutritional Splits',   color: 'var(--success)' },
    { icon: HeartPulse, label: 'Bio-Recovery Protocol', color: 'var(--accent)'  },
    { icon: TrendingUp, label: 'Progression Velocity',  color: 'var(--warning)' },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold border border-slate-700 bg-slate-800/80 text-slate-200"
        >
          <Icon className="size-3.5 text-purple-400" />
          {label}
        </div>
      ))}
    </div>
  )
}

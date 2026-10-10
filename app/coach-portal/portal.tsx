'use client'

import { Shell } from '@/components/shell'
import {
  Activity,
  ArrowRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Filter,
  Flame,
  HeartPulse,
  MessageCircle,
  Plus,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  UsersRound,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface Client {
  id: string
  name: string
  initials: string
  goal: string
  adherence: number
  checkIn: string
  status: 'On track' | 'Review' | 'Needs attention'
  weight: number
  caloriesAvg: number
  lastSession: string
}

const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Maya Hassan',
    initials: 'MH',
    goal: 'Strength & recomposition',
    adherence: 92,
    checkIn: 'Today',
    status: 'On track',
    weight: 64.2,
    caloriesAvg: 2150,
    lastSession: 'Upper Body Hypertrophy (45m ago)',
  },
  {
    id: 'c2',
    name: 'Omar Saleh',
    initials: 'OS',
    goal: 'Fat loss & metabolic conditioning',
    adherence: 84,
    checkIn: 'Tomorrow',
    status: 'Review',
    weight: 88.5,
    caloriesAvg: 1980,
    lastSession: 'Zone 2 Cardio & Core (Yesterday)',
  },
  {
    id: 'c3',
    name: 'Nadia Kareem',
    initials: 'NK',
    goal: '5K race performance',
    adherence: 96,
    checkIn: 'Fri',
    status: 'On track',
    weight: 58.0,
    caloriesAvg: 2300,
    lastSession: 'Tempo Intervals (Today)',
  },
  {
    id: 'c4',
    name: 'Adam Nabil',
    initials: 'AN',
    goal: 'Mobility & spinal recovery',
    adherence: 78,
    checkIn: 'Sat',
    status: 'Needs attention',
    weight: 79.1,
    caloriesAvg: 2100,
    lastSession: 'Deep Hip Mobility (3 days ago)',
  },
]

const INITIAL_PRIORITIES = [
  { id: 'p1', text: 'Review 3 weekly check-ins for Maya and Omar', done: false, time: 'By 2:00 PM' },
  { id: 'p2', text: 'Update Omar’s target calorie deficit (-200 kcal)', done: true, time: 'Completed' },
  { id: 'p3', text: 'Send Nadia customized race-week taper guidelines', done: false, time: 'Today' },
  { id: 'p4', text: 'Reply to Adam regarding lower back soreness adjustment', done: false, time: 'High priority' },
]

export function CoachPortalPage() {
  const [clients] = useState<Client[]>(INITIAL_CLIENTS)
  const [priorities, setPriorities] = useState(INITIAL_PRIORITIES)
  const [filter, setFilter] = useState<'All' | 'On track' | 'Review' | 'Needs attention'>('All')
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [messageRecipient, setMessageRecipient] = useState<string>('All active clients')
  const [messageText, setMessageText] = useState('')
  const [sentToast, setSentToast] = useState(false)

  const filteredClients = clients.filter((c) => {
    const matchesFilter = filter === 'All' || c.status === filter
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.goal.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const togglePriority = (id: string) => {
    setPriorities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }

  const completedPrioritiesCount = priorities.filter((p) => p.done).length

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return
    setMessageModalOpen(false)
    setMessageText('')
    setSentToast(true)
    setTimeout(() => setSentToast(false), 3000)
  }

  const openMessageForClient = (client: Client) => {
    setMessageRecipient(client.name)
    setMessageText(`Hi ${client.name.split(' ')[0]}, checking in on your recent sessions. `)
    setMessageModalOpen(true)
  }

  return (
    <Shell
      title="Coach Workspace"
      subtitle="Client management, check-in queue & programming priorities"
      allowedRoles={['COACH']}
    >
      <div className="p-5 sm:p-8 space-y-7">
        {/* Toast confirmation */}
        {sentToast && (
          <div className="animate-fade-up fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3.5 text-sm font-semibold text-white shadow-2xl">
            <CheckCircle2 className="size-5 text-emerald-400" />
            <span>Coaching message dispatched successfully!</span>
          </div>
        )}

        {/* Hero Row */}
        <div className="animate-fade-up flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                Coaching Operations
              </span>
              <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-black text-purple-700 border border-purple-200">
                Live Roster
              </span>
            </div>
            <h2 className="mt-1.5 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Client priorities at a glance
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              Monitor adherence, review weekly check-ins, and keep your roster progressing.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setMessageRecipient('All active clients')
                setMessageText('')
                setMessageModalOpen(true)
              }}
              className="btn-primary !h-11 !px-4"
            >
              <MessageCircle className="size-4" /> Message clients
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Active clients', '24', '+3 this month', UsersRound, 'linear-gradient(135deg,#4f5fed,#7c3aed)'],
            ['Weekly adherence', '89%', '+4.2% vs last week', TrendingUp, 'linear-gradient(135deg,#16a34a,#06b6d4)'],
            ['Check-ins due', '6', '3 due today', CalendarCheck2, 'linear-gradient(135deg,#f59e0b,#ef4444)'],
            ['Avg response time', '1h 18m', '14m faster than avg', Clock3, 'linear-gradient(135deg,#06b6d4,#4f5fed)'],
          ].map(([label, value, meta, Icon, gradient], index) => (
            <div
              key={String(label)}
              className="card p-5 transition hover:-translate-y-0.5"
              style={{ '--i': index } as React.CSSProperties}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground-muted">{String(label)}</p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-foreground">{String(value)}</p>
                  <p className="mt-1 text-xs font-bold text-success flex items-center gap-1">
                    <Sparkles className="size-3" /> {String(meta)}
                  </p>
                </div>
                <span
                  className="grid size-11 place-items-center rounded-2xl text-white shadow-md"
                  style={{ background: String(gradient) }}
                >
                  <Icon className="size-5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main 2-Column Section */}
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          {/* Left: Client Roster */}
          <section className="card overflow-hidden">
            {/* Header with Search and Filter */}
            <div className="border-b border-border p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-extrabold text-foreground text-base">Client Roster</h3>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Real-time compliance, metrics, and coaching touchpoints
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-muted" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or goal…"
                    className="h-9 w-full rounded-xl border border-border bg-background-alt pl-8 pr-3 text-xs font-medium text-foreground outline-none transition focus:border-primary/50 focus:bg-white"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-border/60">
                {(['All', 'On track', 'Review', 'Needs attention'] as const).map((tab) => {
                  const active = filter === tab
                  return (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        active
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-background-alt text-foreground-muted hover:bg-card-hover hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Client List */}
            <div className="divide-y divide-border/60">
              {filteredClients.length === 0 ? (
                <div className="p-12 text-center text-sm text-foreground-muted">
                  No clients match your filter or search query.
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-background-alt/50 sm:flex-row sm:items-center sm:justify-between group"
                  >
                    {/* Client Info */}
                    <div className="flex min-w-0 flex-1 items-center gap-3.5">
                      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-light text-xs font-black text-primary shadow-xs">
                        {client.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold text-foreground">{client.name}</p>
                          <span
                            className={`badge ${
                              client.status === 'On track'
                                ? 'badge-success'
                                : client.status === 'Review'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            {client.status}
                          </span>
                        </div>
                        <p className="truncate text-xs text-foreground-muted mt-0.5">{client.goal}</p>
                        <p className="text-[11px] text-foreground-muted/80 mt-1 flex items-center gap-1">
                          <Clock3 className="size-3" /> {client.lastSession}
                        </p>
                      </div>
                    </div>

                    {/* Adherence Bar */}
                    <div className="sm:w-36">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-foreground-muted">Adherence</span>
                        <span className="text-foreground">{client.adherence}%</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-background-alt">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${client.adherence}%`,
                            background:
                              client.adherence >= 90
                                ? 'var(--success)'
                                : client.adherence >= 80
                                ? 'var(--primary)'
                                : 'var(--warning)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Check-in day */}
                    <div className="sm:w-20 text-left sm:text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Check-in</p>
                      <p className="mt-0.5 text-xs font-black text-foreground">{client.checkIn}</p>
                    </div>

                    {/* Quick Row Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openMessageForClient(client)}
                        className="btn-ghost !h-8 !px-2.5 !text-xs !font-bold rounded-lg border border-border hover:border-primary/40 hover:bg-primary-light hover:text-primary transition"
                        title={`Message ${client.name}`}
                      >
                        <MessageCircle className="size-3.5" />
                        <span className="hidden md:inline">Message</span>
                      </button>

                      <button
                        onClick={() => setSelectedClient(client)}
                        className="btn-outline !h-8 !px-2.5 !text-xs !font-bold rounded-lg hover:border-primary transition"
                        title="View Full Profile"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Right Column: Priorities & Weekly Pulse */}
          <section className="space-y-6">
            {/* Priorities Card */}
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary-light text-primary">
                    <Activity className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-foreground text-sm">Today’s Priorities</h3>
                    <p className="text-xs text-foreground-muted">
                      {completedPrioritiesCount} of {priorities.length} tasks completed
                    </p>
                  </div>
                </div>

                <div className="h-2 w-16 overflow-hidden rounded-full bg-background-alt">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(completedPrioritiesCount / priorities.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {priorities.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => togglePriority(item.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition border ${
                      item.done
                        ? 'border-border/60 bg-background-alt/50 opacity-60'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-background-alt'
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-lg border transition ${
                        item.done
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-border bg-white text-transparent'
                      }`}
                    >
                      <Check className="size-3.5 stroke-[3]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold ${item.done ? 'line-through text-foreground-muted' : 'text-foreground'}`}>
                        {item.text}
                      </p>
                      <span className="mt-1 inline-block text-[10px] font-semibold text-foreground-muted">
                        {item.time}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Pulse Card */}
            <div
              className="overflow-hidden rounded-3xl p-6 text-white shadow-xl relative"
              style={{ background: 'var(--gradient-hero)' }}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    <span className="text-xs font-black uppercase tracking-wider text-white/80">
                      Roster Compliance
                    </span>
                  </div>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold">
                    This Week
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-4xl font-black tracking-tight">19 / 24</p>
                  <p className="text-sm font-semibold text-white/80">Athletes</p>
                </div>
                <p className="mt-1 text-xs text-white/80 leading-relaxed">
                  Active athletes have logged all assigned training sessions and nutrition targets for the current cycle.
                </p>

                <div className="mt-5 rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                    <span>Target: 90%</span>
                    <span>79.2% achieved</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: '79.2%' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Client Detail Modal */}
        {selectedClient && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(8px)' }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSelectedClient(null)
            }}
          >
            <div className="animate-scale-in w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-primary text-base font-black text-white">
                    {selectedClient.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground">{selectedClient.name}</h3>
                    <p className="text-xs text-foreground-muted">{selectedClient.goal}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="btn-ghost !p-1.5 text-foreground-muted hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-background-alt p-3.5 text-center">
                  <p className="text-[10px] font-bold text-foreground-muted uppercase">Adherence</p>
                  <p className="text-base font-black text-primary mt-0.5">{selectedClient.adherence}%</p>
                </div>
                <div className="rounded-2xl bg-background-alt p-3.5 text-center">
                  <p className="text-[10px] font-bold text-foreground-muted uppercase">Weight</p>
                  <p className="text-base font-black text-foreground mt-0.5">{selectedClient.weight} kg</p>
                </div>
                <div className="rounded-2xl bg-background-alt p-3.5 text-center">
                  <p className="text-[10px] font-bold text-foreground-muted uppercase">Avg. Calories</p>
                  <p className="text-base font-black text-foreground mt-0.5">{selectedClient.caloriesAvg}</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-border p-4 bg-card">
                <p className="text-xs font-bold text-foreground">Recent Activity</p>
                <p className="text-xs text-foreground-muted mt-1">{selectedClient.lastSession}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="badge badge-primary text-[10px]">Active Macro Plan</span>
                  <span className="badge badge-success text-[10px]">Heart Rate Ready</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button onClick={() => setSelectedClient(null)} className="btn-outline !text-xs !h-10">
                  Close
                </button>
                <button
                  onClick={() => {
                    openMessageForClient(selectedClient)
                    setSelectedClient(null)
                  }}
                  className="btn-primary !text-xs !h-10"
                >
                  <MessageCircle className="size-3.5" /> Message Athlete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Coaching Message Modal */}
        {messageModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(8px)' }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setMessageModalOpen(false)
            }}
          >
            <div className="animate-scale-in w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div>
                  <h3 className="text-base font-black text-foreground">Send Coaching Note</h3>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Recipient: <strong className="text-primary">{messageRecipient}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setMessageModalOpen(false)}
                  className="btn-ghost !p-1.5 text-foreground-muted hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground">Message</label>
                  <textarea
                    rows={4}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write instructions, encouragement, or workout adjustments…"
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background-alt p-3.5 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:bg-white"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-foreground-muted">Delivered via FitAI athlete inbox</span>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setMessageModalOpen(false)}
                      className="btn-outline !text-xs !h-10"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary !text-xs !h-10">
                      <Send className="size-3.5" /> Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}

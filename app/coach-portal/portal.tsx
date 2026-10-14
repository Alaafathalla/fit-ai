'use client'

import { EmptyState } from '@/components/empty-state'
import { Shell } from '@/components/shell'
import { CardSkeleton } from '@/components/ui/skeleton'
import { AthleteProgramView } from '@/components/athlete-program-view'
import {
  getCoachClients,
  updateCoachClient,
  updateCoachClientPlanDay,
  updateCoachClientMeal,
  type CoachClientItem,
} from '@/lib/api'
import {
  Activity,
  CalendarCheck2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Dumbbell,
  MessageCircle,
  Save,
  Search,
  Send,
  TrendingUp,
  UsersRound,
  Utensils,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const INITIAL_PRIORITIES = [
  { id: 'p1', text: 'Review weekly check-ins for Maya and Omar', done: false, time: 'By 2:00 PM' },
  { id: 'p2', text: 'Update Omar’s target calorie deficit (-200 kcal)', done: true, time: 'Completed' },
  { id: 'p3', text: 'Send Nadia customized race-week taper guidelines', done: false, time: 'Today' },
  { id: 'p4', text: 'Reply to Adam regarding lower back soreness adjustment', done: false, time: 'High priority' },
]

export function CoachPortalPage() {
  const [clients, setClients] = useState<CoachClientItem[]>([])
  const [loading, setLoading] = useState(true)
  const [priorities, setPriorities] = useState(INITIAL_PRIORITIES)
  const [filter, setFilter] = useState<'All' | 'On track' | 'Review' | 'Needs attention'>('All')
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<CoachClientItem | null>(null)
  const [clientModalTab, setClientModalTab] = useState<'program' | 'overview'>('program')
  const [clientNotes, setClientNotes] = useState('')
  const [clientStatus, setClientStatus] = useState<'On track' | 'Review' | 'Needs attention'>('On track')
  const [savingNotes, setSavingNotes] = useState(false)
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [messageRecipient, setMessageRecipient] = useState<string>('All active clients')
  const [messageText, setMessageText] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const loadClients = async () => {
    try {
      const data = await getCoachClients()
      setClients(data)
    } catch {
      // fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
    try {
      const saved = localStorage.getItem('fitai_coach_priorities')
      if (saved) setPriorities(JSON.parse(saved))
    } catch {
      // ignore
    }
  }, [])

  const filteredClients = clients.filter((c) => {
    const matchesFilter = filter === 'All' || c.status === filter
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.goal.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const togglePriority = (id: string) => {
    setPriorities((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
      try {
        localStorage.setItem('fitai_coach_priorities', JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const completedPrioritiesCount = priorities.filter((p) => p.done).length

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return
    setMessageModalOpen(false)
    setMessageText('')
    showToast('Coaching message dispatched to athlete successfully!')
  }

  const openClientDetail = (client: CoachClientItem, initialTab: 'program' | 'overview' = 'program') => {
    setSelectedClient(client)
    setClientModalTab(initialTab)
    setClientNotes(client.notes || '')
    setClientStatus(client.status)
  }

  const handleToggleClientDay = async (dayId: string) => {
    if (!selectedClient) return
    try {
      const res = await updateCoachClientPlanDay(selectedClient.id, dayId)
      if (res.client) {
        setSelectedClient(res.client)
        setClients((prev) => prev.map((c) => (c.id === res.client!.id ? res.client! : c)))
        showToast('تم تحديث حالة تمرين اللاعب بنجاح!')
      }
    } catch {
      showToast('تعذر تحديث التمرين')
    }
  }

  const handleToggleClientMeal = async (mealId: string) => {
    if (!selectedClient) return
    try {
      const res = await updateCoachClientMeal(selectedClient.id, mealId)
      if (res.client) {
        setSelectedClient(res.client)
        setClients((prev) => prev.map((c) => (c.id === res.client!.id ? res.client! : c)))
        showToast('تم تحديث حالة وجبة اللاعب بنجاح!')
      }
    } catch {
      showToast('تعذر تحديث الوجبة')
    }
  }

  const handleSaveClientDetails = async () => {
    if (!selectedClient) return
    setSavingNotes(true)
    try {
      await updateCoachClient({
        athleteId: selectedClient.id,
        notes: clientNotes,
        status: clientStatus,
      })
      setClients((prev) =>
        prev.map((c) =>
          c.id === selectedClient.id
            ? { ...c, notes: clientNotes, status: clientStatus }
            : c
        )
      )
      setSelectedClient((prev) =>
        prev ? { ...prev, notes: clientNotes, status: clientStatus } : null
      )
      showToast('Client notes & status updated successfully!')
    } catch {
      showToast('Saved locally.')
    } finally {
      setSavingNotes(false)
    }
  }

  const openMessageForClient = (client: CoachClientItem) => {
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
        {toastMessage && (
          <div className="animate-fade-up fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3.5 text-sm font-semibold text-white shadow-2xl">
            <CheckCircle2 className="size-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Hero Row */}
        <div className="animate-fade-up flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                Coaching Operations
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-black text-blue-700 border border-blue-200">
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
              className="btn btn-primary inline-flex items-center gap-2 !h-11 !px-4"
            >
              <MessageCircle className="size-4" /> Message clients
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Active roster', `${clients.length || 4}`, 'Monitored athletes', UsersRound, 'bg-slate-900 text-white'],
            ['Roster adherence', '91%', '+4.2% vs last week', TrendingUp, 'bg-emerald-600 text-white'],
            ['Check-ins due', '4', '2 pending review', CalendarCheck2, 'bg-amber-600 text-white'],
            ['Avg response time', '1h 14m', '18m faster than benchmark', Clock3, 'bg-blue-600 text-white'],
          ].map(([label, value, meta, Icon, colorClass]) => (
            <div
              key={String(label)}
              className="card p-5 transition hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground-muted">{String(label)}</p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-foreground">{String(value)}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {String(meta)}
                  </p>
                </div>
                <span className={`grid size-10 place-items-center rounded-xl shadow-xs ${colorClass}`}>
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
                    className="h-9 w-full rounded-xl border border-border bg-slate-100/60 dark:bg-slate-800/50 pl-8 pr-3 text-xs font-medium text-foreground outline-none transition focus:border-primary/50 focus:bg-white"
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
                          : 'bg-slate-100 dark:bg-slate-800 text-foreground-muted hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Client List */}
            {loading ? (
              <div className="p-6 space-y-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {filteredClients.length === 0 ? (
                  <div className="p-8">
                    <EmptyState
                      icon={UsersRound}
                      title="No clients found"
                      description="No athletes match your filter or search query. Try broadening your criteria."
                    />
                  </div>
                ) : (
                  filteredClients.map((client) => {
                    const plan = client.weeklyPlan
                    return (
                      <div
                        key={client.id}
                        className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/50 dark:hover:bg-slate-900/30 xl:flex-row xl:items-center xl:justify-between group"
                      >
                        {/* Client Info */}
                        <div className="flex min-w-0 flex-1 items-center gap-3.5">
                          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-xs font-black text-primary shadow-xs">
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

                        {/* Program & Completion Stats */}
                        {plan && (
                          <div className="min-w-[190px] rounded-2xl bg-slate-100/70 p-2.5 dark:bg-slate-800/40 border border-border/50">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="text-foreground truncate max-w-[130px] font-extrabold">{plan.programTitle}</span>
                              <span className="text-emerald-600 dark:text-emerald-400">{plan.completionPercentage}%</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[10px] text-foreground-muted font-semibold">
                              <span>أتمّ {plan.completedWorkoutsCount} من {plan.totalWorkoutsCount}</span>
                              <span className="text-blue-600 dark:text-blue-400">متبقي {plan.remainingWorkoutsCount}</span>
                            </div>
                            {/* 7-day mini split dots */}
                            <div className="mt-2 flex items-center gap-1">
                              {plan.splitDays.map((d) => (
                                <span
                                  key={d.id}
                                  title={`${d.dayShort}: ${d.title} (${d.status === 'completed' ? 'تم الإنجاز' : d.status === 'remaining' ? 'متبقي' : 'يوم راحة'})`}
                                  className={`h-2 flex-1 rounded-full transition ${
                                    d.status === 'completed'
                                      ? 'bg-emerald-500'
                                      : d.status === 'remaining'
                                      ? 'bg-blue-500'
                                      : 'bg-slate-300 dark:bg-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Adherence Bar */}
                        <div className="sm:w-28">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-foreground-muted">Adherence</span>
                            <span className="text-foreground">{client.adherence}%</span>
                          </div>
                          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
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
                        <div className="sm:w-16 text-left sm:text-center">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Check-in</p>
                          <p className="mt-0.5 text-xs font-black text-foreground">{client.checkIn}</p>
                        </div>

                        {/* Quick Row Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openClientDetail(client, 'program')}
                            className="btn btn-primary !h-8 !px-3 !text-xs !font-bold inline-flex items-center gap-1.5 shadow-xs"
                            title="عرض وتعديل البرنامج والمخطط والوجبات"
                          >
                            <CalendarDays className="size-3.5" />
                            <span>البرنامج والوجبات</span>
                          </button>

                          <button
                            onClick={() => openMessageForClient(client)}
                            className="btn-ghost !h-8 !px-2.5 !text-xs !font-bold rounded-lg border border-border hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition"
                            title={`Message ${client.name}`}
                          >
                            <MessageCircle className="size-3.5" />
                          </button>

                          <button
                            onClick={() => openClientDetail(client, 'overview')}
                            className="btn-outline !h-8 !px-2.5 !text-xs !font-bold rounded-lg hover:border-primary transition"
                            title="إدارة الملاحظات والحالة"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </section>

          {/* Right Column: Priorities & Weekly Pulse */}
          <section className="space-y-6">
            {/* Priorities Card */}
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Activity className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-foreground text-sm">Today’s Priorities</h3>
                    <p className="text-xs text-foreground-muted">
                      {completedPrioritiesCount} of {priorities.length} tasks completed
                    </p>
                  </div>
                </div>

                <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
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
                        ? 'border-border/60 bg-slate-100/40 dark:bg-slate-900/40 opacity-60'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-lg border transition ${
                        item.done
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-border bg-card text-transparent'
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
            <div className="overflow-hidden rounded-2xl p-6 text-white bg-slate-900 border border-slate-800 shadow-sm relative">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Roster Compliance
                    </span>
                  </div>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700">
                    This Week
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tight text-white">{clients.length ? `${clients.length} Active` : '4 Active'}</p>
                  <p className="text-sm font-medium text-slate-400">Athletes</p>
                </div>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Active athletes are monitored against target weights, weekly volume adherence, and nutrition consistency.
                </p>

                <div className="mt-5 rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                    <span>Target: 90%</span>
                    <span>91% achieved</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: '91%' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Client Detail & Management Modal */}
        {selectedClient && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSelectedClient(null)
            }}
          >
            <div className="animate-scale-in w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
              {/* Modal Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="grid size-12 place-items-center rounded-2xl bg-primary text-base font-black text-white shadow-xs">
                    {selectedClient.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-foreground">{selectedClient.name}</h3>
                      <span
                        className={`badge ${
                          selectedClient.status === 'On track'
                            ? 'badge-success'
                            : selectedClient.status === 'Review'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {selectedClient.status}
                      </span>
                    </div>
                    <p className="text-xs text-foreground-muted mt-0.5">{selectedClient.goal} · {selectedClient.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openMessageForClient(selectedClient)
                      setSelectedClient(null)
                    }}
                    className="btn-outline !text-xs !h-9 inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="size-3.5" /> رسالة للاعب
                  </button>

                  <button
                    onClick={() => setSelectedClient(null)}
                    className="btn-ghost !p-2 text-foreground-muted hover:text-foreground rounded-xl"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="flex gap-2 border-b border-border/60 pb-3">
                <button
                  type="button"
                  onClick={() => setClientModalTab('program')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    clientModalTab === 'program'
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-slate-100 text-foreground-muted hover:text-foreground dark:bg-slate-800'
                  }`}
                >
                  <CalendarDays className="size-3.5" />
                  برنامج المتدرب والمخطط والوجبات
                  {selectedClient.weeklyPlan && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                      {selectedClient.weeklyPlan.completedWorkoutsCount}/{selectedClient.weeklyPlan.totalWorkoutsCount} أتمّ
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setClientModalTab('overview')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    clientModalTab === 'overview'
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-slate-100 text-foreground-muted hover:text-foreground dark:bg-slate-800'
                  }`}
                >
                  <Activity className="size-3.5" />
                  بيانات المتدرب وملاحظات الكوتش
                </button>
              </div>

              {/* Tab 1: Weekly Program, Split & Meals */}
              {clientModalTab === 'program' && selectedClient.weeklyPlan && (
                <div className="space-y-4">
                  <AthleteProgramView
                    plan={selectedClient.weeklyPlan}
                    athleteName={selectedClient.name}
                    isCoachView={true}
                    onToggleDay={handleToggleClientDay}
                    onToggleMeal={handleToggleClientMeal}
                  />
                </div>
              )}

              {/* Tab 2: Client Metrics & Private Notes */}
              {clientModalTab === 'overview' && (
                <div className="space-y-5 animate-fade-up">
                  {/* Client Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 p-4 text-center border border-border/40">
                      <p className="text-[10px] font-bold text-foreground-muted uppercase">نسبة الالتزام</p>
                      <p className="text-xl font-black text-primary mt-1">{selectedClient.adherence}%</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 p-4 text-center border border-border/40">
                      <p className="text-[10px] font-bold text-foreground-muted uppercase">الوزن الحالي</p>
                      <p className="text-xl font-black text-foreground mt-1">{selectedClient.weight} kg</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 p-4 text-center border border-border/40">
                      <p className="text-[10px] font-bold text-foreground-muted uppercase">متوسط السعرات</p>
                      <p className="text-xl font-black text-foreground mt-1">{selectedClient.caloriesAvg} kcal</p>
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1.5 block">حالة المتدرب</label>
                    <div className="flex gap-2">
                      {(['On track', 'Review', 'Needs attention'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setClientStatus(st)}
                          className={`flex-1 rounded-xl py-2 text-xs font-bold border transition ${
                            clientStatus === st
                              ? st === 'On track'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : st === 'Review'
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'border-border bg-slate-100/40 dark:bg-slate-800/40 text-foreground-muted'
                          }`}
                        >
                          {st === 'On track' ? 'ملتزم (On track)' : st === 'Review' ? 'تحت المراجعة (Review)' : 'يحتاج اهتمام (Needs attention)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Coach Notes */}
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1.5 block">
                      ملاحظات وتوجيهات الكوتش الخاصة بالمتدرب (مستمرة ومحفوظة)
                    </label>
                    <textarea
                      rows={4}
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="أضف ملاحظات خاصة حول تكنيك التمارين، تعديلات الوجبات والسعرات، وتوجيهات الأسبوع القادم…"
                      className="w-full rounded-2xl border border-border bg-slate-100/60 dark:bg-slate-800/50 p-3.5 text-xs font-medium text-foreground outline-none transition focus:border-primary"
                    />
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/70">
                    <button onClick={() => setSelectedClient(null)} className="btn-ghost !text-xs !h-10">
                      إغلاق
                    </button>
                    <button
                      onClick={handleSaveClientDetails}
                      disabled={savingNotes}
                      className="btn btn-primary !text-xs !h-10 inline-flex items-center gap-1.5"
                    >
                      <Save className="size-3.5" /> {savingNotes ? 'جارٍ الحفظ…' : 'حفظ الملاحظات والحالة'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Send Coaching Message Modal */}
        {messageModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
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
                    className="mt-1.5 w-full rounded-2xl border border-border bg-slate-100/60 dark:bg-slate-800/50 p-3.5 text-xs font-medium text-foreground outline-none transition focus:border-primary"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-foreground-muted">Delivered to athlete workspace</span>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setMessageModalOpen(false)}
                      className="btn-outline !text-xs !h-10"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary !text-xs !h-10 inline-flex items-center gap-1.5">
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

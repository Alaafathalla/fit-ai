'use client'

import { Shell } from '@/components/shell'
import { Activity, ArrowRight, CalendarCheck2, CheckCircle2, Clock3, MessageCircle, TrendingUp, UsersRound } from 'lucide-react'

const clients = [
  { name: 'Maya Hassan', initials: 'MH', goal: 'Strength & recomposition', adherence: 92, checkIn: 'Today', status: 'On track' },
  { name: 'Omar Saleh', initials: 'OS', goal: 'Fat loss', adherence: 84, checkIn: 'Tomorrow', status: 'Review' },
  { name: 'Nadia Kareem', initials: 'NK', goal: '5K performance', adherence: 96, checkIn: 'Fri', status: 'On track' },
  { name: 'Adam Nabil', initials: 'AN', goal: 'Mobility & recovery', adherence: 78, checkIn: 'Sat', status: 'Needs attention' },
]

export function CoachPortalPage() {
  return (
    <Shell title="Coach Workspace" subtitle="Manage clients, check-ins, and coaching priorities" allowedRoles={['COACH']}>
      <div className="p-5 sm:p-8">
        <div className="animate-fade-up flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Today’s coaching queue</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Your clients at a glance</h2>
            <p className="mt-1 text-sm text-foreground-muted">Focus on the people who need your attention most.</p>
          </div>
          <button className="btn-primary"><MessageCircle className="size-4" /> Message clients</button>
        </div>

        <div className="stagger mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Active clients', '24', '+3 this month', UsersRound, 'linear-gradient(135deg,#4f5fed,#7c3aed)'],
            ['Weekly adherence', '89%', '+4.2%', TrendingUp, 'linear-gradient(135deg,#16a34a,#06b6d4)'],
            ['Check-ins due', '6', '3 today', CalendarCheck2, 'linear-gradient(135deg,#f59e0b,#ef4444)'],
            ['Avg. response', '1h 18m', '12m faster', Clock3, 'linear-gradient(135deg,#06b6d4,#4f5fed)'],
          ].map(([label, value, meta, Icon, gradient], index) => (
            <div key={String(label)} className="card animate-fade-up p-5" style={{ '--i': index } as React.CSSProperties}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground-muted">{String(label)}</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{String(value)}</p>
                  <p className="mt-1 text-xs font-semibold text-success">{String(meta)}</p>
                </div>
                <span className="icon-box size-10 text-white" style={{ background: String(gradient) }}><Icon className="size-4" /></span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="font-bold text-foreground">Client roster</h3>
                <p className="mt-0.5 text-xs text-foreground-muted">Adherence and next coaching touchpoint</p>
              </div>
              <button className="btn-outline text-xs">View all <ArrowRight className="size-3.5" /></button>
            </div>

            <div className="divide-y divide-border-subtle">
              {clients.map((client) => (
                <div key={client.name} className="flex flex-col gap-4 px-5 py-4 transition hover:bg-background-alt/60 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-xs font-black text-primary">{client.initials}</div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">{client.name}</p>
                      <p className="truncate text-xs text-foreground-muted">{client.goal}</p>
                    </div>
                  </div>
                  <div className="min-w-[150px]">
                    <div className="flex items-center justify-between text-[11px] font-semibold"><span className="text-foreground-muted">Adherence</span><span className="text-foreground">{client.adherence}%</span></div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-background-alt"><div className="h-full rounded-full bg-primary" style={{ width: `${client.adherence}%` }} /></div>
                  </div>
                  <div className="sm:w-24">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Check-in</p>
                    <p className="mt-0.5 text-xs font-bold text-foreground">{client.checkIn}</p>
                  </div>
                  <span className={`badge ${client.status === 'On track' ? 'badge-success' : client.status === 'Review' ? 'badge-warning' : 'badge-danger'}`}>{client.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <span className="icon-box size-10 bg-primary-light text-primary"><Activity className="size-4" /></span>
                <div><h3 className="font-bold text-foreground">Today’s priorities</h3><p className="text-xs text-foreground-muted">Keep the queue moving</p></div>
              </div>
              <div className="mt-5 space-y-3">
                {['Review 3 weekly check-ins', 'Update Omar’s calorie target', 'Send Nadia race-week plan', 'Reply to 4 client messages'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-background-alt px-3 py-3">
                    <span className={`grid size-6 place-items-center rounded-full text-[10px] font-black ${index === 0 ? 'bg-primary text-white' : 'bg-white text-foreground-muted'}`}>{index + 1}</span>
                    <span className="text-xs font-semibold text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl p-5 text-white" style={{ background: 'var(--gradient-hero)', boxShadow: '0 12px 32px rgba(79,95,237,0.28)' }}>
              <div className="flex items-center gap-2"><CheckCircle2 className="size-4" /><span className="text-xs font-bold uppercase tracking-wider text-white/80">Weekly pulse</span></div>
              <p className="mt-4 text-3xl font-black">19 / 24</p>
              <p className="mt-1 text-sm text-white/75">clients have completed their planned sessions this week.</p>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  )
}

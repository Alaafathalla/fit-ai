'use client'

import {
  Activity,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  Moon,
  Sparkles,
  TrendingUp,
  Users,
  Utensils,
} from 'lucide-react'
import { useState } from 'react'

export function HeroCockpit() {
  const [activeTab, setActiveTab] = useState<'athlete' | 'coach' | 'biometrics'>('athlete')
  const [completedSets, setCompletedSets] = useState<number[]>([1])

  const toggleSet = (setNumber: number) => {
    setCompletedSets((prev) =>
      prev.includes(setNumber) ? prev.filter((s) => s !== setNumber) : [...prev, setNumber]
    )
  }

  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-2xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden ring-1 ring-slate-950/5">
      {/* Top Window Chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-rose-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
          </div>
          <span className="hidden sm:inline-block h-3.5 w-px bg-slate-200" />
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Cockpit • FitAI Engine 2.4</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center rounded-xl bg-slate-200/70 p-1 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('athlete')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
              activeTab === 'athlete'
                ? 'bg-white text-purple-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Dumbbell className="size-3.5" />
            <span>Athlete View</span>
          </button>
          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
              activeTab === 'coach'
                ? 'bg-white text-purple-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="size-3.5" />
            <span>Coach Roster</span>
          </button>
          <button
            onClick={() => setActiveTab('biometrics')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
              activeTab === 'biometrics'
                ? 'bg-white text-purple-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="size-3.5" />
            <span>AI & Biometrics</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Screen Content */}
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white to-slate-50/70 text-slate-900">
        {/* Tab 1: Athlete Performance View */}
        {activeTab === 'athlete' && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: Active Session & Live Logger */}
            <div className="space-y-5">
              {/* Session Header Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-purple-700 border border-purple-200">
                      Phase 3: Hypertrophy & Power
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="size-3 text-slate-400" /> Week 4 of 6
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Heart className="size-3 animate-pulse text-rose-500" />
                    <span>Live 142 BPM</span>
                  </div>
                </div>

                <h3 className="mt-2.5 text-lg font-black text-slate-900">Heavy Lower Body & Posterior Chain</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Target Load: 12,400 kg • RPE 8.0 • Rest intervals: 120s
                </p>

                {/* Interactive Exercise Item */}
                <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Primary Compound Lift</span>
                      <h4 className="text-sm font-black text-slate-900">Barbell Back Squat (Low Bar)</h4>
                    </div>
                    <span className="text-xs font-bold text-purple-900 bg-purple-100/80 px-2.5 py-1 rounded-md border border-purple-200">
                      Target: 140 kg
                    </span>
                  </div>

                  {/* Clickable Sets */}
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                    {[
                      { set: 1, reps: '5 reps', weight: '135 kg' },
                      { set: 2, reps: '5 reps', weight: '140 kg' },
                      { set: 3, reps: '5 reps', weight: '142.5 kg' },
                      { set: 4, reps: '4 reps (AMRAP)', weight: '142.5 kg' },
                    ].map((s) => {
                      const isDone = completedSets.includes(s.set)
                      return (
                        <button
                          key={s.set}
                          type="button"
                          onClick={() => toggleSet(s.set)}
                          className={`rounded-xl p-2.5 text-left transition border ${
                            isDone
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-900 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider opacity-70">
                              Set {s.set}
                            </span>
                            {isDone ? (
                              <CheckCircle2 className="size-3.5 text-emerald-600" />
                            ) : (
                              <Circle className="size-3.5 text-slate-300" />
                            )}
                          </div>
                          <p className="mt-1 text-xs font-black">{s.weight}</p>
                          <p className="text-[10px] opacity-75">{s.reps}</p>
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-2 text-[11px] text-purple-700 font-medium">
                    💡 Click any set button above to simulate live completion
                  </p>
                </div>

                {/* Subsequent exercise queue */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs">
                    <span className="font-semibold text-slate-800">2. Romanian Deadlifts (RDL)</span>
                    <span className="text-slate-500 font-medium">3 sets × 8 reps @ 110 kg</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs">
                    <span className="font-semibold text-slate-800">3. Bulgarian Split Squat</span>
                    <span className="text-slate-500 font-medium">3 sets × 10 reps @ 28 kg DBs</span>
                  </div>
                </div>
              </div>

              {/* Real-time Bio-Coach Adjustment Bubble */}
              <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 via-white to-purple-50/50 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20">
                    <Bot className="size-5" />
                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-purple-900">FitAI Real-time Co-Pilot</span>
                      <span className="rounded bg-purple-100 px-1.5 py-0.2 text-[9px] font-bold text-purple-800">
                        AUTONOMOUS LOAD ADVICE
                      </span>
                    </div>
                    <p className="text-xs leading-5 text-slate-700">
                      "HRV is <strong className="text-emerald-700 font-bold">+14ms above baseline</strong> and RPE on Set 1 was 7.0. Auto-periodization increased Set 3 target by <strong className="text-purple-700 font-bold">+2.5kg</strong>. Full CNS readiness detected."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Nutrition Targets & Recovery Readiness */}
            <div className="space-y-5">
              {/* Readiness Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Daily Telemetry</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    Peak State
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-5">
                  {/* Readiness Circular Graphic */}
                  <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-emerald-500/20 bg-emerald-50">
                    <div className="text-center">
                      <span className="text-2xl font-black text-emerald-600">96</span>
                      <span className="block text-[9px] font-bold uppercase text-emerald-700">Readiness</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs w-full">
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <Moon className="size-3 text-indigo-500" /> Sleep Quality
                      </span>
                      <p className="mt-1 font-black text-slate-900">8h 14m</p>
                      <span className="text-[10px] text-emerald-600 font-bold">92% Deep + REM</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <Activity className="size-3 text-purple-500" /> HRV (rMSSD)
                      </span>
                      <p className="mt-1 font-black text-slate-900">78 ms</p>
                      <span className="text-[10px] text-emerald-600 font-bold">+12% vs 7d avg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fuel & Nutrition Macro Bar */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="size-4 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Fuel & Macro Targets</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">2,140 / 2,850 kcal</span>
                </div>

                {/* Macro Progress Bars */}
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Protein (Target: 195g)</span>
                      <span className="font-bold text-purple-700">182g (93%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-purple-600" style={{ width: '93%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Carbohydrates (Target: 310g)</span>
                      <span className="font-bold text-sky-700">240g (77%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: '77%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Healthy Fats (Target: 68g)</span>
                      <span className="font-bold text-amber-700">54g (79%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: '79%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 border border-slate-200">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Flame className="size-3.5 text-rose-500" /> Pre-workout glycogen primed
                  </span>
                  <span className="font-bold text-emerald-700">Hydration 3.1L ✓</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Coach Command Center View */}
        {activeTab === 'coach' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Coach Command Workspace</h3>
                <p className="text-xs text-slate-500">Active roster: 18 athletes • 2 requiring programming review</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  94.2% Roster Adherence
                </span>
                <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
                  AI Auto-Flag Active
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Marcus Vance',
                  role: 'Powerlifter (93kg Class)',
                  status: 'Green',
                  compliance: '98%',
                  note: 'Completed all 5 sessions. Squat PR +5kg logged.',
                  badge: 'On Track',
                  badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                },
                {
                  name: 'Sarah Chen',
                  role: 'Marathon & Hyrox',
                  status: 'Yellow',
                  compliance: '88%',
                  note: 'Sleep debt 2.2 hrs detected. Auto-suggesting active recovery.',
                  badge: 'Recovery Flag',
                  badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
                },
                {
                  name: 'David Okafor',
                  role: 'CrossFit Competitor',
                  status: 'Green',
                  compliance: '100%',
                  note: 'Volume threshold met. Ready for Peak Deload Week.',
                  badge: 'Program Ready',
                  badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
                },
              ].map((client) => (
                <div
                  key={client.name}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 items-center justify-center rounded-full bg-purple-600 text-xs font-black text-white">
                        {client.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{client.name}</h4>
                        <p className="text-[11px] text-slate-500">{client.role}</p>
                      </div>
                    </div>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${client.badgeColor}`}>
                      {client.badge}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs border border-slate-100">
                    <span className="text-slate-500">Weekly Adherence:</span>
                    <span className="font-bold text-slate-900">{client.compliance}</span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{client.note}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button type="button" className="text-purple-700 font-bold hover:text-purple-900 flex items-center gap-1">
                      Edit Plan <ChevronRight className="size-3" />
                    </button>
                    <span className="text-[11px] text-slate-400">Updated 42m ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: AI Copilot & Biometrics View */}
        {activeTab === 'biometrics' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Autonomous Periodization</span>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  Adaptive AI
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900">Cumulative Fatigue vs. Performance Output</h4>

              {/* Simulated Chart Bars */}
              <div className="h-32 flex items-end gap-2 pt-6">
                {[
                  { day: 'Mon', height: '65%', label: 'Heavy Squat' },
                  { day: 'Tue', height: '80%', label: 'Upper Bench' },
                  { day: 'Wed', height: '35%', label: 'Mobility' },
                  { day: 'Thu', height: '90%', label: 'Deadlift' },
                  { day: 'Fri', height: '75%', label: 'Incline & Arms' },
                  { day: 'Sat', height: '50%', label: 'Aerobic Base' },
                  { day: 'Sun', height: '20%', label: 'Rest Day' },
                ].map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-purple-600 to-indigo-500 transition-all hover:brightness-110"
                      style={{ height: item.height }}
                    />
                    <span className="text-[10px] text-slate-500 font-semibold">{item.day}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                AI continuously recalculates acute:chronic workload ratios (ACWR) to prevent overtraining while maximizing mechanical stimulus.
              </p>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-purple-600" />
                <h4 className="text-sm font-black text-slate-900">Ask FitAI Bio-Coach Live</h4>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="rounded-xl bg-white p-3 text-slate-700 border border-purple-100 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Athlete Prompt</span>
                  <p className="mt-1 font-semibold text-slate-900">"My right knee feels slight tendon stiffness during warmups today. Should I modify leg day?"</p>
                </div>

                <div className="rounded-xl bg-purple-100/60 p-3 text-purple-950 border border-purple-200">
                  <span className="text-[10px] font-black text-purple-800 uppercase flex items-center gap-1">
                    <Bot className="size-3" /> FitAI Recommendation
                  </span>
                  <p className="mt-1 leading-relaxed">
                    "Auto-adjusting routine: Swap heavy low-bar squats for Spanish Squats (isometrics) and Romanian Deadlifts to unload the patellar tendon while maintaining posterior chain stimulus. Hydrate with sodium electrolytes."
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-purple-200/60">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="size-3.5 text-emerald-600" /> Context-aware across 45 logged sessions
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

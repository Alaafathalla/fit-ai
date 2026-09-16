'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  Check,
  ChevronDown,
  Clock3,
  Dumbbell,
  Flame,
  HeartPulse,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Utensils,
  Users,
  X,
  Zap,
} from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Workouts', icon: Dumbbell },
  { label: 'Nutrition', icon: Utensils },
  { label: 'Progress', icon: TrendingUp },
]

const workouts = [
  { title: 'Full Body Strength', type: 'Strength', duration: '42 min', level: 'Intermediate', calories: '320 kcal', color: 'from-[#e8efff] to-[#c7d8ff]', image: '/fitai-athlete.png' },
  { title: 'HIIT Cardio Blast', type: 'Cardio', duration: '28 min', level: 'Advanced', calories: '280 kcal', color: 'from-[#f1edff] to-[#dbd0ff]', image: '/fitai-athlete.png' },
  { title: 'Mobility Reset', type: 'Mobility', duration: '18 min', level: 'Beginner', calories: '110 kcal', color: 'from-[#edfff6] to-[#c9f7e0]', image: '/fitai-athlete.png' },
]

const meals = [
  { name: 'Green Power Bowl', meal: 'Breakfast', calories: '420 kcal', macros: '28g protein', color: 'from-[#e6fff2] to-[#c6f4d7]' },
  { name: 'Salmon & Quinoa', meal: 'Lunch', calories: '610 kcal', macros: '42g protein', color: 'from-[#fff0eb] to-[#ffd7c9]' },
  { name: 'Turkey Pesto Wrap', meal: 'Dinner', calories: '540 kcal', macros: '36g protein', color: 'from-[#f0edff] to-[#d9d2ff]' },
]

function Logo() {
  return <div className="flex items-center gap-2.5 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-[10px] bg-[#111827] text-white"><Sparkles className="size-4" /></span><span>fit<span className="text-[#4e6bff]">ai</span></span></div>
}

function StatCard({ label, value, meta, icon: Icon, tone }: { label: string; value: string; meta: string; icon: typeof Flame; tone: string }) {
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(45,54,88,0.06)] transition-transform hover:-translate-y-1"><div className="flex items-start justify-between"><span className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon className="size-5" /></span><MoreHorizontal className="size-4 text-slate-300" /></div><p className="mt-5 text-sm text-slate-500">{label}</p><div className="mt-1 flex items-end gap-2"><strong className="text-2xl font-semibold tracking-tight text-slate-900">{value}</strong><span className="mb-1 text-xs font-semibold text-[#31ad75]">{meta}</span></div></div>
}

function MiniChart() {
  return <div className="relative h-36 w-full"><svg viewBox="0 0 520 150" className="h-full w-full overflow-visible" role="img" aria-label="Weight progress trend"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#5872ff" stopOpacity=".22" /><stop offset="1" stopColor="#5872ff" stopOpacity="0" /></linearGradient></defs><path d="M0 112 C48 102 62 104 100 92 S162 84 198 90 S250 74 286 76 S344 58 380 65 S425 45 468 48 S502 34 520 38 L520 150 L0 150Z" fill="url(#area)" /><path d="M0 112 C48 102 62 104 100 92 S162 84 198 90 S250 74 286 76 S344 58 380 65 S425 45 468 48 S502 34 520 38" fill="none" stroke="#5872ff" strokeLinecap="round" strokeWidth="3" /><circle cx="520" cy="38" r="5" fill="white" stroke="#5872ff" strokeWidth="3" /></svg><div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] text-slate-400"><span>Jun 1</span><span>Jun 8</span><span>Jun 15</span><span>Jun 22</span><span>Jun 29</span></div></div>
}

function BarChart() {
  return <div className="flex h-36 items-end justify-between gap-3 px-2 pt-3"><div className="flex h-full flex-1 items-end justify-around gap-1">{[45, 70, 54, 82, 62, 92, 76].map((height, index) => <div key={index} className="flex h-full flex-1 items-end justify-center gap-1"><div style={{ height: `${height}%` }} className={`w-full max-w-5 rounded-t-md ${index === 5 ? 'bg-[#6878ff]' : 'bg-[#dce4ff]'}`} /><div style={{ height: `${Math.max(height - 20, 22)}%` }} className="hidden w-full max-w-2 rounded-t-md bg-[#aebcff] sm:block" /></div>)}</div></div>
}

function CoachPanel() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Your recovery looks strong today. Ready for a focused session?' }])
  const sendMessage = (text = message) => { if (!text.trim()) return; setMessages((items) => [...items, { from: 'user', text }, { from: 'ai', text: 'Got it. I’ll tailor your next session around that goal.' }]); setMessage('') }
  return <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_36px_rgba(45,54,88,0.06)]"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#111827] text-white"><Bot className="size-5" /></span><div><h3 className="font-semibold text-slate-900">AI Coach</h3><p className="text-xs text-slate-500">Always here to help</p></div></div><span className="flex items-center gap-1.5 text-xs font-medium text-[#27a96d]"><i className="size-2 rounded-full bg-[#27a96d]" /> Online</span></div><div className="flex-1 space-y-3 p-5">{messages.map((item, index) => <div key={index} className={`max-w-[86%] rounded-2xl px-3.5 py-3 text-sm leading-5 ${item.from === 'ai' ? 'rounded-tl-sm bg-[#f2f5ff] text-slate-700' : 'ml-auto rounded-tr-sm bg-[#111827] text-white'}`}>{item.text}</div>)}<div className="flex flex-wrap gap-2 pt-1"><button onClick={() => sendMessage('Create a fat loss workout')} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-[#7182ff] hover:text-[#5264eb]">Create a workout</button><button onClick={() => sendMessage('Adjust my calories')} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-[#7182ff] hover:text-[#5264eb]">Adjust my calories</button></div></div><div className="border-t border-slate-100 p-4"><div className="flex items-center gap-2 rounded-xl bg-[#f8f9fc] p-1.5"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) sendMessage() }} placeholder="Ask your coach anything..." className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400" /><button aria-label="Voice input" className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-white"><Mic className="size-4" /></button><button onClick={() => sendMessage()} aria-label="Send message" className="grid size-8 place-items-center rounded-lg bg-[#596bff] text-white"><Send className="size-4" /></button></div></div></div>
}

function Dashboard({ setPage }: { setPage: (page: string) => void }) {
  const [completed, setCompleted] = useState(false)
  return <div className="min-h-screen bg-[#f8f9fc] text-slate-900"><div className="mx-auto flex min-h-screen max-w-[1440px]"><aside className="hidden w-[238px] shrink-0 flex-col border-r border-slate-200/80 bg-white px-5 py-7 lg:flex"><Logo /><div className="mt-12 space-y-1">{navItems.map((item) => <button key={item.label} onClick={() => setPage(item.label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${item.label === 'Overview' ? 'bg-[#eef1ff] text-[#5264eb]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><item.icon className="size-[18px]" />{item.label}</button>)}<button onClick={() => setPage('AI Coach')} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"><Bot className="size-[18px]" />AI Coach</button></div><div className="mt-auto space-y-1"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"><Settings className="size-[18px]" />Settings</button><div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-5"><div className="grid size-9 place-items-center rounded-full bg-[#ffd9c5] text-sm font-semibold text-[#8d4b2e]">MA</div><div><p className="text-sm font-semibold">Mahmoud</p><p className="text-xs text-slate-400">Pro plan</p></div><ChevronDown className="ml-auto size-4 text-slate-400" /></div></div></aside><main className="min-w-0 flex-1"><header className="flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white px-5 sm:px-8"><div className="flex items-center gap-4"><button className="lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button><div className="lg:hidden"><Logo /></div><div className="hidden lg:block"><p className="text-sm font-medium text-slate-500">Tuesday, June 24, 2025</p><h1 className="text-xl font-semibold tracking-tight">Good morning, Mahmoud</h1></div></div><div className="flex items-center gap-3"><button aria-label="Search" className="grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><Search className="size-[18px]" /></button><button aria-label="Notifications" className="relative grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><Bell className="size-[18px]" /><i className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#ff725c]" /></button></div></header><div className="p-5 sm:p-8"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500 lg:hidden">Tuesday, June 24, 2025</p><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your fitness overview</h2><p className="mt-1 text-sm text-slate-500">Small steps every day make big changes.</p></div><button onClick={() => setPage('Workouts')} className="flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">Explore workouts <ArrowRight className="size-4" /></button></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Current weight" value="78.4 kg" meta="-1.8%" icon={Target} tone="bg-[#eef1ff] text-[#5a6bfa]" /><StatCard label="Calories today" value="1,240" meta="62% of goal" icon={Flame} tone="bg-[#fff0e8] text-[#f27455]" /><StatCard label="Workout streak" value="12 days" meta="Best: 18" icon={Zap} tone="bg-[#f2edff] text-[#936df4]" /><StatCard label="AI fitness score" value="84/100" meta="+6 this week" icon={HeartPulse} tone="bg-[#e9fbf1] text-[#32ad73]" /></div><div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_1fr]"><div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(45,54,88,0.06)]"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Weight progress</h3><p className="mt-1 text-xs text-slate-500">Your journey over the last 30 days</p></div><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">Last 30 days <ChevronDown className="ml-1 inline size-3" /></button></div><div className="mt-5 flex items-baseline gap-2"><strong className="text-3xl font-semibold">78.4 kg</strong><span className="text-xs font-semibold text-[#31ad75]">↓ 2.1 kg</span></div><MiniChart /></div><div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(45,54,88,0.06)]"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Calories burned</h3><p className="mt-1 text-xs text-slate-500">This week&apos;s activity</p></div><BarChart3 className="size-5 text-[#6878ff]" /></div><div className="mt-5 flex items-baseline gap-2"><strong className="text-3xl font-semibold">2,840</strong><span className="text-xs text-slate-500">kcal</span></div><BarChart /></div></div><div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]"><div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(45,54,88,0.06)]"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Today&apos;s workout</h3><p className="mt-1 text-xs text-slate-500">Tuesday, June 24 · Push day</p></div><button onClick={() => setPage('Workouts')} className="text-xs font-semibold text-[#596bff]">View plan</button></div><div className="mt-5 flex flex-col gap-4 sm:flex-row"><div className="relative h-40 overflow-hidden rounded-xl bg-gradient-to-br from-[#dbe5ff] to-[#f0f2ff] sm:w-44"><img src="/fitai-athlete.png" alt="Athlete preparing for a workout" className="h-full w-full object-cover object-top mix-blend-multiply" /><span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-white/90 text-[#5264eb] shadow-sm"><Play className="ml-0.5 size-4 fill-current" /></span></div><div className="flex-1"><div className="flex items-start justify-between"><div><h4 className="text-lg font-semibold">Upper Body Power</h4><p className="mt-1 text-sm text-slate-500">Strength · Intermediate</p></div><span className="rounded-full bg-[#eafaf1] px-2.5 py-1 text-[11px] font-semibold text-[#2da66d]">42 min</span></div><div className="mt-5 grid grid-cols-3 gap-3"><div><p className="text-xs text-slate-400">Exercises</p><p className="mt-1 font-semibold">8</p></div><div><p className="text-xs text-slate-400">Sets</p><p className="mt-1 font-semibold">24</p></div><div><p className="text-xs text-slate-400">Calories</p><p className="mt-1 font-semibold">320</p></div></div><button onClick={() => setCompleted(!completed)} className={`mt-5 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${completed ? 'bg-[#eafaf1] text-[#279e69]' : 'bg-[#111827] text-white hover:bg-[#29364e]'}`}>{completed ? <><Check className="size-4" /> Completed</> : <><Play className="size-4 fill-current" /> Start workout</>}</button></div></div></div><CoachPanel /></div></div></main></div></div>
}

function WorkoutsPage({ setPage }: { setPage: (page: string) => void }) {
  const [filter, setFilter] = useState('All')
  const visible = useMemo(() => filter === 'All' ? workouts : workouts.filter((workout) => workout.type === filter), [filter])
  return <div className="min-h-screen bg-[#f8f9fc] text-slate-900"><header className="flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white px-5 sm:px-8"><button onClick={() => setPage('Overview')} className="flex items-center gap-3"><Logo /><span className="hidden border-l border-slate-200 pl-3 text-sm text-slate-500 sm:inline">Workout library</span></button><button onClick={() => setPage('Overview')} className="text-sm font-medium text-slate-500 hover:text-slate-900">Back to dashboard</button></header><main className="mx-auto max-w-6xl px-5 py-10 sm:px-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-[#596bff]">Move with intention</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Find your next workout.</h1><p className="mt-2 max-w-lg text-slate-500">AI-curated sessions that meet you exactly where you are today.</p></div><button className="flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white"><Sparkles className="size-4" /> Generate with AI</button></div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5"><Search className="size-4 text-slate-400" /><input placeholder="Search workouts" className="w-full bg-transparent text-sm outline-none" /></div><div className="flex gap-2 overflow-x-auto">{['All', 'Strength', 'Cardio', 'Mobility'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium ${filter === item ? 'bg-[#111827] text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>{item}</button>)}</div></div><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map((workout) => <article key={workout.title} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_36px_rgba(45,54,88,0.06)]"><div className={`relative h-48 bg-gradient-to-br ${workout.color}`}><img src={workout.image} alt="Athlete training" className="h-full w-full object-cover object-top mix-blend-multiply opacity-80" /><span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{workout.type}</span><button aria-label={`Start ${workout.title}`} className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-white text-[#5264eb] shadow-md"><Play className="ml-0.5 size-4 fill-current" /></button></div><div className="p-5"><h2 className="font-semibold">{workout.title}</h2><div className="mt-2 flex items-center gap-3 text-xs text-slate-500"><span className="flex items-center gap-1"><Clock3 className="size-3.5" /> {workout.duration}</span><span>{workout.level}</span><span>{workout.calories}</span></div><button className="mt-5 w-full rounded-xl bg-[#f1f3ff] py-2.5 text-sm font-semibold text-[#5264eb] hover:bg-[#e7eaff]">Start workout</button></div></article>)}</div></main></div>
}

function CoachPage({ setPage }: { setPage: (page: string) => void }) {
  return <div className="min-h-screen bg-[#f8f9fc] text-slate-900"><header className="flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white px-5 sm:px-8"><button onClick={() => setPage('Overview')}><Logo /></button><button onClick={() => setPage('Overview')} className="text-sm font-medium text-slate-500 hover:text-slate-900">Back to dashboard</button></header><main className="mx-auto max-w-3xl px-5 py-10 sm:px-8"><div className="mb-7"><p className="text-sm font-semibold text-[#596bff]">Personal guidance</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Your AI Coach</h1><p className="mt-2 text-slate-500">Ask anything about training, nutrition, or recovery.</p></div><div className="h-[600px]"><CoachPanel /></div></main></div>
}

export default function Page() {
  const [page, setPage] = useState('Overview')
  if (page === 'Workouts') return <WorkoutsPage setPage={setPage} />
  if (page === 'AI Coach') return <CoachPage setPage={setPage} />
  return <Dashboard setPage={setPage} />
}

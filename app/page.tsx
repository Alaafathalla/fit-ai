'use client'

import { FaqAccordion } from '@/components/marketing/faq-accordion'
import { FeatureShowcase } from '@/components/marketing/feature-showcase'
import { HeroCockpit } from '@/components/marketing/hero-cockpit'
import { InteractiveBlueprint } from '@/components/marketing/interactive-blueprint'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { getCurrentAuthUser, getRoleHome } from '@/lib/auth'
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  Layers,
  Moon,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Utensils,
  Watch,
  X,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [workspaceHref, setWorkspaceHref] = useState('/auth/register')
  const [primaryLabel, setPrimaryLabel] = useState('Start Free Trial')

  useEffect(() => {
    const user = getCurrentAuthUser()
    if (user) {
      setWorkspaceHref(getRoleHome(user.role))
      setPrimaryLabel('Open Workspace')
    }
  }, [])

  return (
    <MarketingShell>
      {/* ─── 1. HERO SECTION (PREMIUM LIGHT THEME) ─────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/40 via-white to-slate-50 text-slate-900 pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Soft atmospheric ambient light glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute top-96 -left-40 size-[450px] rounded-full bg-sky-500/8 blur-[110px]" />
        <div className="pointer-events-none absolute top-96 -right-40 size-[450px] rounded-full bg-emerald-500/6 blur-[110px]" />

        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Top Announcement Pill */}
          <div className="flex justify-center">
            <Link
              href="/features"
              className="group inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm transition hover:border-purple-300 hover:bg-white"
            >
              <span className="flex size-2 rounded-full bg-purple-600 animate-pulse" />
              <span>FitAI 2.4 Released: Autonomous Periodization & Biometric Telemetry</span>
              <ChevronRight className="size-3.5 text-purple-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Main Hero Header */}
          <div className="mx-auto mt-8 max-w-4xl text-center">
            <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl leading-[1.08] text-slate-900">
              The Intelligent Cockpit for{' '}
              <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Peak Athletic Performance
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 font-normal">
              FitAI unites progressive overload training, real-time macronutrient fueling, continuous HRV & sleep telemetry, and autonomous AI coaching into one synchronized workspace. Built for dedicated athletes and high-performance coaches.
            </p>

            {/* CTA Group */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={workspaceHref}
                className="group inline-flex items-center gap-2.5 rounded-xl bg-purple-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 hover:shadow-purple-600/40 hover:-translate-y-0.5"
              >
                <span>{primaryLabel}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#interactive-cockpit"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm sm:text-base font-bold text-slate-700 shadow-xs transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
              >
                <span>Explore Live Demo</span>
              </Link>
            </div>

            {/* Key Micro Trust Signals */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" /> 14-Day Free Trial
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" /> No Credit Card Required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" /> Athlete & Coach Dual Modes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-sky-600" /> 100% Encrypted Biometric Vault
              </span>
            </div>
          </div>

          {/* ─── Hero Interactive Cockpit Mockup ────────────────────────────── */}
          <div id="interactive-cockpit" className="mt-14 sm:mt-16">
            <div className="text-center mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-purple-700">
                Interactive Workspace Demonstration
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Click tabs and toggle sets below to test real-time logging responsiveness
              </p>
            </div>
            <HeroCockpit />
          </div>

          {/* Wearables & Integration Ecosystem Bar */}
          <div className="mt-16 pt-10 border-t border-slate-200 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Seamlessly Synchronizes With Your Athletic Hardware & Ecosystem
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-bold text-slate-600">
              <span className="flex items-center gap-2 hover:text-purple-700 transition">
                <Watch className="size-4 text-purple-600" /> Apple HealthKit & Watch Ultra
              </span>
              <span className="flex items-center gap-2 hover:text-purple-700 transition">
                <Activity className="size-4 text-rose-500" /> Whoop 4.0 Biometrics
              </span>
              <span className="flex items-center gap-2 hover:text-purple-700 transition">
                <HeartPulse className="size-4 text-sky-600" /> Garmin Connect & Forerunner
              </span>
              <span className="flex items-center gap-2 hover:text-purple-700 transition">
                <Moon className="size-3.5 text-indigo-500" /> Oura Ring Gen 3
              </span>
              <span className="flex items-center gap-2 hover:text-purple-700 transition">
                <Flame className="size-4 text-amber-500" /> Strava Athlete Sync
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. PERFORMANCE IMPACT METRICS BAR ──────────────────────────────── */}
      <section className="border-y border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                stat: '48,000+',
                label: 'Workouts Logged Monthly',
                sub: 'Across 42 countries',
                icon: Dumbbell,
                color: 'text-purple-600',
              },
              {
                stat: '94.6%',
                label: 'Program Adherence Rate',
                sub: 'vs 41% industry average',
                icon: Trophy,
                color: 'text-emerald-600',
              },
              {
                stat: '+18.4 ms',
                label: 'Average HRV Gain',
                sub: 'Within 8-week block',
                icon: HeartPulse,
                color: 'text-sky-600',
              },
              {
                stat: '6.5 hrs',
                label: 'Saved Weekly by Coaches',
                sub: 'Automated roster analysis',
                icon: Clock,
                color: 'text-amber-500',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">{item.stat}</span>
                  <item.icon className={`size-6 ${item.color}`} />
                </div>
                <p className="mt-2 text-sm font-bold text-slate-800">{item.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. INTERACTIVE 5-PILLAR SHOWCASE ─────────────────────────────────── */}
      <section className="bg-slate-50/80 py-20 sm:py-28 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <Layers className="size-3.5" />
              Comprehensive Platform Architecture
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Built for the uncompromising demands of serious training.
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600">
              FitAI removes the friction of juggling workout logs in notes, diet in a separate tracker, and biometrics in wearable apps. Everything operates in concert.
            </p>
          </div>

          <div className="mt-12">
            <FeatureShowcase />
          </div>
        </div>
      </section>

      {/* ─── 4. INTERACTIVE BLUEPRINT CALCULATOR ─────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28 text-slate-900 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <InteractiveBlueprint />
        </div>
      </section>

      {/* ─── 5. BENTO GRID: THE ANATOMY OF PEAK PERFORMANCE ──────────────────── */}
      <section className="bg-slate-50/80 py-20 sm:py-28 text-slate-900 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <Zap className="size-3.5" />
              Engineered Differently
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Every detail optimized for athletic progression.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Explore the technical innovations that distinguish FitAI from traditional fitness trackers.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Bento Card 1: Autonomous Periodization (Large 2 cols) */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                  <TrendingUp className="size-5" />
                </div>
                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
                  Auto-Periodization
                </span>
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-900">
                Mechanical Tension & Load Tonnage Auto-Regulation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-xl">
                FitAI doesn’t rely on static guesswork. It calculates cumulative acute volume versus chronic adaptation, adjusting weekly micro-cycles so you break through plateaus without overtraining.
              </p>

              {/* Visual Tonnage progression mockup */}
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">12-Week Squat & Deadlift Progressive Wave</span>
                  <span className="font-bold text-emerald-600">+17.5% Realized Strength</span>
                </div>
                <div className="mt-4 grid grid-cols-6 gap-2 items-end h-20">
                  {[45, 55, 68, 62, 78, 92].map((height, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        className="w-full rounded-md bg-gradient-to-t from-purple-600 to-indigo-500 transition-all hover:brightness-110"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[10px] text-slate-500 font-semibold">Wk {i * 2 + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bento Card 2: Computer Vision Food Intake */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <Utensils className="size-5" />
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-900">Visual & Voice Macro Logger</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Point your camera or speak your meal into the app. FitAI calculates protein, carbs, fats, and fiber with 98% accuracy in under 3 seconds.
              </p>
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">Ribeye + Sweet Potato</span>
                  <span className="text-emerald-600">740 kcal ✓</span>
                </div>
                <div className="flex gap-2 text-[11px] text-slate-500">
                  <span>58g Protein</span> • <span>45g Carbs</span> • <span>32g Fat</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Biometric Guardrails */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <HeartPulse className="size-5" />
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-900">Central Nervous System Guardrails</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                When nighttime HRV drops below 2 standard deviations, FitAI automatically dials back top sets and triggers an active deload protocol.
              </p>
              <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-900">
                <span className="font-bold flex items-center gap-1.5 text-rose-800">
                  <ShieldCheck className="size-3.5 text-rose-600" /> Auto-Safety Deload Trigger
                </span>
                <p className="mt-1 text-[11px] text-rose-700">Prevented overreaching flag: volume reduced by 25% today.</p>
              </div>
            </div>

            {/* Bento Card 4: Coach Roster Command (Large 2 cols) */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                  <Users className="size-5" />
                </div>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 border border-sky-200">
                  For Coaches & Studios
                </span>
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-900">
                Multi-Athlete Cockpit with Instant Red-Flag Queue
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-xl">
                Coaches monitor compliance at a glance. Filter by status, assign modified blocks in one click, and send voice guidance directly to the athlete's workout screen.
              </p>

              <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Client Compliance</span>
                  <p className="mt-1 text-lg font-black text-emerald-600">96.8%</p>
                  <span className="text-[10px] text-slate-500">18 Active Athletes</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Auto-Red Flags</span>
                  <p className="mt-1 text-lg font-black text-amber-600">2 Athletes</p>
                  <span className="text-[10px] text-slate-500">Require Rest Review</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Programming Speed</span>
                  <p className="mt-1 text-lg font-black text-sky-600">4x Faster</p>
                  <span className="text-[10px] text-slate-500">Reusable Block Templates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. COMPARISON MATRIX: WHY FITAI WINS ───────────────────────────── */}
      <section className="bg-white py-20 sm:py-28 text-slate-900 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <Award className="size-3.5" />
              The Competitive Advantage
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Why elite performers leave spreadsheets and basic trackers behind.
            </h2>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-4">Performance Capability</th>
                  <th className="py-4 px-4 text-slate-500">Spreadsheets & Notes</th>
                  <th className="py-4 px-4 text-slate-500">Generic Fitness Apps</th>
                  <th className="py-4 px-4 text-purple-700 bg-purple-50/70 rounded-t-xl font-black">
                    FitAI Performance OS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    feature: 'Real-time Autonomous Auto-Periodization',
                    sheets: 'Manual calculation',
                    generic: 'Static cookie-cutter PDF',
                    fitai: 'Dynamic RPE + Tonnage AI',
                  },
                  {
                    feature: 'Biometric HRV & Sleep Recovery Sync',
                    sheets: 'None',
                    generic: 'Disconnected or extra app',
                    fitai: 'Native Apple/Whoop/Garmin Sync',
                  },
                  {
                    feature: 'Dynamic Macro & Nutrient Timing',
                    sheets: 'Separate tracking needed',
                    generic: 'Fixed daily calorie ceiling',
                    fitai: 'Auto-balanced with workout expenditure',
                  },
                  {
                    feature: 'Coach Cockpit & Athlete Roster',
                    sheets: 'Cluttered Google Drive tabs',
                    generic: 'No coach portal',
                    fitai: 'Dedicated command workspace',
                  },
                  {
                    feature: '24/7 Context-Aware AI Sports Scientist',
                    sheets: 'None',
                    generic: 'Basic scripted bot',
                    fitai: 'Full training history context',
                  },
                  {
                    feature: 'Biometric Privacy & Local Encryption',
                    sheets: 'Vulnerable',
                    generic: 'Ad networks & data brokers',
                    fitai: '256-bit AES Vault Guarantee',
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-bold text-slate-900">{row.feature}</td>
                    <td className="py-4 px-4 text-slate-500 flex items-center gap-1.5">
                      <X className="size-4 text-rose-500 shrink-0" />
                      <span>{row.sheets}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <X className="size-4 text-amber-500 shrink-0" />
                        <span>{row.generic}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-purple-900 bg-purple-50/40">
                      <span className="flex items-center gap-1.5">
                        <Check className="size-4 text-emerald-600 shrink-0" />
                        <span>{row.fitai}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── 7. ATHLETE & COACH TESTIMONIALS ─────────────────────────────────── */}
      <section className="bg-slate-50/80 py-20 sm:py-28 text-slate-900 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Trusted by high-performance athletes & coaches worldwide.
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Read how FitAI transformed training efficiency and competitive PRs.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Marcus Thorne',
                role: 'Head Strength Coach • 22 Athletes',
                text: 'FitAI cut my weekly client programming time from 14 hours down to 3. The automated red flags alert me to recovery deficits before injuries occur. I cannot imagine running my coaching business without it.',
                stat: '11 hrs saved / wk',
                badge: 'Verified Coach',
              },
              {
                name: 'Samantha Reed',
                role: 'Hyrox Pro & Marathon Runner',
                text: 'Having my workout volume, carbohydrate targets, and Whoop HRV in a single dashboard changed everything. I took 9 minutes off my marathon PR because I finally stopped overtraining.',
                stat: 'PR: 2h 54m Marathon',
                badge: 'Elite Athlete',
              },
              {
                name: 'Dr. Julian Ramirez',
                role: 'Sports Biomechanist & D1 Specialist',
                text: 'Most fitness apps are glorified timers. FitAI is the first system that actually applies the acute-to-chronic workload ratio and autoregulates progressive overload using sports science.',
                stat: '+18% Squat 1RM',
                badge: 'Sports Scientist',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs flex flex-col justify-between transition hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-200">
                      {item.badge}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{item.stat}</span>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-slate-700 italic">
                    "{item.text}"
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-black text-white">
                    {item.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. INTERACTIVE FAQ ──────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28 text-slate-900 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              Got Questions?
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Everything you need to know about the platform, integrations, and coaching features.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* ─── 9. GRAND FINALE HIGH-IMPACT CTA ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-28 text-white border-t border-slate-800">
        {/* Soft radial glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-gradient-to-tr from-purple-600/30 to-indigo-600/20 blur-[130px]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/20 px-4 py-1.5 text-xs font-semibold text-purple-200 backdrop-blur-md">
            <Sparkles className="size-4" />
            <span>Start Your 14-Day Free Performance Trial</span>
          </div>

          <h2 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Stop guessing your training load.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
              Start operating with precision.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-slate-300">
            Join thousands of athletes and coaches who have simplified their workflow and elevated their athletic potential with FitAI.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-purple-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-purple-600/40 transition hover:bg-purple-500 hover:shadow-purple-600/60 hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/for-coaches"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-8 py-4 text-base font-bold text-slate-200 backdrop-blur-md transition hover:border-slate-600 hover:bg-slate-700 hover:text-white"
            >
              <Users className="size-5 text-purple-400" />
              <span>Explore Coach Workspace</span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" /> No credit card required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" /> Instant onboarding in 60s
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" /> Cancel anytime with 1 click
            </span>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}

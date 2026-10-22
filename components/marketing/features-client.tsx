'use client'

import {
  Activity,
  ArrowRight,
  BarChart2,
  BarChart3,
  Bot,
  Brain,
  BrainCircuit,
  Calendar,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Cpu,
  Dumbbell,
  Eye,
  FileSpreadsheet,
  Filter,
  Flame,
  Gauge,
  Heart,
  HeartPulse,
  HelpCircle,
  History,
  Layers,
  LineChart,
  Lock,
  MessageSquare,
  Mic,
  Moon,
  RotateCcw,
  Search,
  Share2,
  Shield,
  ShieldCheck,
  Sliders,
  Smartphone,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  Utensils,
  Video,
  Watch,
  WifiOff,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface FeatureItem {
  id: string
  title: string
  category: 'training' | 'nutrition' | 'biometrics' | 'coach' | 'ai' | 'security'
  categoryLabel: string
  icon: any
  summary: string
  details: string[]
  badge: string
}

const ALL_FEATURES: FeatureItem[] = [
  {
    id: 'training-suite',
    title: 'Adaptive Training & Periodization Engine',
    category: 'training',
    categoryLabel: 'Training Engine',
    icon: Dumbbell,
    summary: 'Auto-calculates progressive overload micro-cycles, RPE auto-regulation, 280+ movement library, and smart injury/equipment substitutions.',
    details: [
      'Linear, Conjugate & Undulating auto-periodization',
      'Real-time RPE and bar-speed load recalculation',
      '280+ HD movement library & joint-friendly swaps',
    ],
    badge: 'Training Suite',
  },
  {
    id: 'nutrition-suite',
    title: 'Computer Vision & Macronutrient Telemetry',
    category: 'nutrition',
    categoryLabel: 'Fuel & Nutrition',
    icon: Utensils,
    summary: 'Instant 3-second photo & voice food intake scanner with dynamic carb cycling and pre/post-workout nutrient timing.',
    details: [
      '98% volumetric food recognition in 3 seconds',
      'Dynamic carb allocation by daily training strain',
      'Leucine threshold monitor for muscle protein synthesis',
    ],
    badge: 'Nutrition Suite',
  },
  {
    id: 'biometrics-suite',
    title: 'Nocturnal Biometrics & Recovery Guardrails',
    category: 'biometrics',
    categoryLabel: 'Biometrics & Sleep',
    icon: HeartPulse,
    summary: 'Continuous HRV (rMSSD) baseline tracking, deep sleep staging, and Acute:Chronic Workload Ratio (ACWR) injury prevention guardrails.',
    details: [
      '7-day rolling rMSSD baseline detects true fatigue',
      'Deep & REM sleep architecture tracking',
      'ACWR safety ceiling prevents connective overtraining',
    ],
    badge: 'Biometrics Suite',
  },
  {
    id: 'coach-suite',
    title: 'Coach Command Cockpit & Video Telestrator',
    category: 'coach',
    categoryLabel: 'Coach Workspace',
    icon: Users,
    summary: 'Command center enabling coaches to manage 30+ athletes simultaneously with automated red-flag alerts and frame-by-frame video review.',
    details: [
      'Live roster adherence & recovery alert queue',
      'Reusable 4-12 week block template library',
      'Frame-by-frame video review with voice feedback',
    ],
    badge: 'Coaching Suite',
  },
  {
    id: 'ai-suite',
    title: '24/7 Context-Aware AI Sports Copilot',
    category: 'ai',
    categoryLabel: 'AI Intelligence',
    icon: Bot,
    summary: 'Conversational sports scientist trained on 14,000+ papers with full access to your training history, injuries, and recovery state.',
    details: [
      'Context-aware exercise modifications & warmups',
      'Autonomous 7-minute joint-specific primers',
      'Meet-day tapering & deload advice',
    ],
    badge: 'AI Copilot',
  },
  {
    id: 'security-suite',
    title: 'Enterprise Biometric Vault & Zero-Lag Offline',
    category: 'security',
    categoryLabel: 'Architecture & Security',
    icon: ShieldCheck,
    summary: 'Enterprise 256-bit AES encryption with zero data sharing, plus full offline logging support for basement gym facilities.',
    details: [
      '100% offline logging via local IndexedDB cache',
      '256-bit AES encrypted private health records',
      'Zero monetization or sale of biometric data',
    ],
    badge: 'Vault & Offline',
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Capabilities', icon: Sparkles },
  { id: 'training', label: 'Training Engine', icon: Dumbbell },
  { id: 'nutrition', label: 'Fuel & Nutrition', icon: Utensils },
  { id: 'biometrics', label: 'Biometrics & Sleep', icon: Activity },
  { id: 'coach', label: 'Coach Workspace', icon: Users },
  { id: 'ai', label: 'AI Intelligence', icon: Bot },
  { id: 'security', label: 'Security & Offline', icon: ShieldCheck },
]

export function FeaturesClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  // Filter features
  const filteredFeatures = ALL_FEATURES.filter((feature) => {
    const matchesCategory = activeCategory === 'all' || feature.category === activeCategory
    const matchesSearch =
      searchQuery.trim() === '' ||
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.details.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      feature.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-[#f8fafc] text-slate-900">
      {/* ─── 1. HERO HEADER ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-slate-50 pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-slate-200">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute top-72 -left-40 size-[450px] rounded-full bg-sky-500/8 blur-[110px]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-xs backdrop-blur-md">
            <Cpu className="size-3.5 text-purple-600" />
            <span>FitAI 2.4 Technical Architecture • 8 Core Modules</span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
            Engineered for Serious Training.{' '}
            <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Built Without Compromise.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-slate-600 font-normal">
            A comprehensive breakdown of the algorithmic periodization, biometric telemetry, computer-vision nutrition, and coach command tools powering FitAI.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">280+</span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">HD Movement Guides</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-purple-700">98%</span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Food Vision Precision</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">5 Sync</span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Hardware Ecosystems</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-sky-600">256-Bit</span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Biometric Encryption</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. INTERACTIVE SEARCH & CATEGORY FILTER ─────────────────────────── */}
      <section className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl py-4 shadow-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search features (e.g. HRV, RPE, Macro)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-xs shadow-purple-600/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
                    }`}
                  >
                    <cat.icon className="size-3.5" />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. DEEP-DIVE FLAGSHIP SHOWCASES ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
            <Zap className="size-3.5 text-purple-600" />
            Core Architecture
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The Four Engines of FitAI
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Engineered to remove guesswork and synchronize your workouts, fuel, recovery, and coaching.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Engine 1: Smart Training */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition hover:border-slate-300 hover:shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                  <Dumbbell className="size-5" />
                </span>
                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700 border border-purple-200">
                  Live v2.4
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-900">Adaptive Periodization & RPE</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Calculates cumulative mechanical tension tonnage and auto-adjusts working set weights when bar speed or RPE indicates central nervous system fatigue.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                ⚡ Dynamic Overload
              </span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                🎯 Auto-Weight Bumps (+2.5kg)
              </span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                🛡️ Connective Deload Triggers
              </span>
            </div>
          </div>

          {/* Engine 2: Vision Macro Telemetry */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition hover:border-slate-300 hover:shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Utensils className="size-5" />
                </span>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                  98% Precision
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-900">Computer Vision Food Telemetry</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Snap a photo or speak your meal into the app. FitAI calculates calories and macros in under 3 seconds, aligning daily fuel with scheduled training output.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                📸 3-Second Photo Scan
              </span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                ⚡ Dynamic Carb Cycling
              </span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                🧪 Leucine Synthesis Trigger
              </span>
            </div>
          </div>

          {/* Engine 3: Biometrics & Sleep */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition hover:border-slate-300 hover:shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <HeartPulse className="size-5" />
                </span>
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 border border-rose-200">
                  Biometric Sync
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-900">Continuous HRV & Sleep Telemetry</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Nocturnal HRV (rMSSD) deviations and deep sleep stages actively configure your daily training volume, protecting joints before overreaching occurs.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                💓 7-Day HRV Baseline
              </span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                🌙 Sleep Architecture (Deep/REM)
              </span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                ⚠️ ACWR Injury Index (&lt;1.5)
              </span>
            </div>
          </div>

          {/* Engine 4: Coach Cockpit */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition hover:border-slate-300 hover:shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <Users className="size-5" />
                </span>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700 border border-sky-200">
                  Coach Studio
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-900">Coach Cockpit & Video Telestrator</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Monitor 30+ athletes simultaneously from a single view with automatic red-flag alerts, batch programming, and frame-by-frame video review.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                👥 Multi-Athlete Cockpit
              </span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                🚨 Auto Red-Flag Alerts
              </span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/70">
                🎥 Frame-by-Frame Telestrator
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. COMPLETE SYSTEM SPECIFICATION GRID ──────────────────────────── */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-700">
                Complete Architecture Matrix
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                All Available Platform Capabilities
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Showing {filteredFeatures.length} of {ALL_FEATURES.length} capabilities
                {activeCategory !== 'all' ? ` in ${CATEGORIES.find((c) => c.id === activeCategory)?.label}` : ''}
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </p>
            </div>

            {(activeCategory !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all')
                  setSearchQuery('')
                }}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 self-start sm:self-auto"
              >
                Reset filters & search
              </button>
            )}
          </div>

          {filteredFeatures.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <Search className="size-8 text-slate-400 mx-auto" />
              <h3 className="mt-3 text-base font-bold text-slate-800">No capabilities found</h3>
              <p className="mt-1 text-xs text-slate-500">
                We couldn't find any feature matching "{searchQuery}". Try searching for another term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all')
                  setSearchQuery('')
                }}
                className="mt-4 btn-primary !text-xs !py-2"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFeatures.map((feat) => {
                const IconComponent = feat.icon
                return (
                  <div
                    key={feat.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                          <IconComponent className="size-5" />
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                          {feat.badge}
                        </span>
                      </div>

                      <h3 className="mt-4 text-base font-bold text-slate-900">{feat.title}</h3>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{feat.summary}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {feat.details.map((detail, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 border border-slate-200/70"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── 5. HARDWARE & WEARABLE INTEGRATION ECOSYSTEM ────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50/80 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <Watch className="size-3.5 text-purple-600" />
              Connected Hardware Infrastructure
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Synchronize with what you already wear.
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Zero manual exports. FitAI hooks into your existing fitness sensors via native APIs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                device: 'Apple Health & Watch Ultra',
                icon: Watch,
                sync: 'Continuous Background Sync',
                ingests: 'HRV (rMSSD), Active Calories, Sleep Stages, Resting HR, VO2 Max',
                badge: 'HealthKit Native',
              },
              {
                device: 'Whoop 4.0 Telemetry',
                icon: Activity,
                sync: 'Daily Cloud Webhook',
                ingests: 'Recovery Score, Day Strain, Sleep Performance %, Respiratory Rate',
                badge: 'Direct OAuth',
              },
              {
                device: 'Garmin Connect & Forerunner',
                icon: HeartPulse,
                sync: 'Post-Activity Ingest',
                ingests: 'Training Effect, Lactate Threshold, Running Power & Dynamics',
                badge: 'Garmin API',
              },
              {
                device: 'Oura Ring Gen 3',
                icon: Moon,
                sync: 'Morning Readiness Ingest',
                ingests: 'Sleep Readiness Index, Body Temperature Deviations, Heart Rate Dip',
                badge: 'Oura Cloud',
              },
              {
                device: 'Strava Performance Engine',
                icon: Flame,
                sync: 'Real-time GPS Splits',
                ingests: 'Outdoor Run/Bike Splits, Elevation Profile, Normalized Power',
                badge: 'Strava Athlete',
              },
              {
                device: 'Bluetooth Smart Chest Straps',
                icon: Heart,
                sync: 'In-Session Live HR',
                ingests: 'Polar H10, Garmin HRM-Pro, Wahoo TICKR (sub-second ECG data)',
                badge: 'BLE Smart',
              },
            ].map((hw, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                      <hw.icon className="size-4" />
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{hw.device}</h3>
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {hw.badge}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs">
                  <p className="text-[11px] font-semibold text-purple-700">{hw.sync}</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    <strong className="text-slate-800">Telemetry Ingested:</strong> {hw.ingests}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. TECHNICAL FAQ ACCORDION ──────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <HelpCircle className="size-3.5" />
              Technical Inquiries
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Technical Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Learn more about our algorithmic periodization formulas and security standards.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does FitAI calculate Acute:Chronic Workload Ratio (ACWR)?',
                a: 'FitAI applies exponentially weighted moving averages (EWMA). Acute workload represents fatigue accumulated over the preceding 7 days, while Chronic workload captures fitness adaptation across the previous 28 days. When the ratio exceeds 1.5, the risk of soft-tissue and connective injury spikes significantly; FitAI will automatically flag this state and suggest a 20-30% volume reduction.',
              },
              {
                q: 'Can coaches import existing client spreadsheets from Excel or Google Sheets?',
                a: 'Yes. FitAI includes an intelligent CSV and markdown routine importer. You can paste your existing block templates or client rosters, and our parser will map exercises, sets, reps, and RPE percentages into our native database with 1 click.',
              },
              {
                q: 'How does the computer-vision food scanner estimate portion sizes accurately?',
                a: 'Our vision model is trained on multi-angle depth geometry. By analyzing plate margins, shadows, and reference objects, the model approximates volumetric density with 98% accuracy on common training meals (chicken breast, rice, sweet potatoes, eggs, oatmeal). You can also adjust portions manually with a quick slider.',
              },
              {
                q: 'Does FitAI require a persistent internet connection during workouts?',
                a: 'No. FitAI is built with an offline-first architecture using local IndexedDB storage. You can log entire sessions, check off sets, and run rest timers in basement gyms with zero reception. All telemetry syncs silently as soon as your device reconnects to Wi-Fi or cellular.',
              },
              {
                q: 'How is biometric privacy guaranteed?',
                a: 'All biometric records (HRV, sleep architecture, medical notes) are encrypted using 256-bit AES encryption at rest and TLS 1.3 in transit. We maintain a zero-advertiser business model: your personal biometrics are never monetized, traded, or shared with third parties.',
              },
            ].map((faq, idx) => {
              const isOpen = expandedFaq === idx
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? 'border-purple-300 bg-white shadow-md shadow-purple-500/5 ring-1 ring-purple-100'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left transition"
                  >
                    <span className="text-base font-bold text-slate-900 pr-4">{faq.q}</span>
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ChevronDown className="size-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-600 border-t border-slate-100 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 7. HIGH-IMPACT CLOSING CTA ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-28 text-white border-t border-slate-800">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-gradient-to-tr from-purple-600/30 to-indigo-600/20 blur-[130px]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/20 px-4 py-1.5 text-xs font-semibold text-purple-200 backdrop-blur-md">
            <Sparkles className="size-4" />
            <span>Test the Engine Yourself</span>
          </div>

          <h2 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Ready to experience the future of athletic performance?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-slate-300">
            Start your 14-day free trial today. Full access to all 8 core modules for athletes and coaches.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-purple-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-purple-600/40 transition hover:bg-purple-500 hover:shadow-purple-600/60 hover:-translate-y-0.5"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-8 py-4 text-base font-bold text-slate-200 backdrop-blur-md transition hover:border-slate-600 hover:bg-slate-700 hover:text-white"
            >
              <span>Compare Plans</span>
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
              <CheckCircle2 className="size-4 text-emerald-400" /> Full hardware integration
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

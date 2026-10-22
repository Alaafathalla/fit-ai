'use client'

import {
  Activity,
  ArrowRight,
  Bot,
  Camera,
  Check,
  CheckCircle2,
  Dumbbell,
  Heart,
  Moon,
  Sparkles,
  Users,
  Utensils,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const PILLARS = [
  {
    id: 'workouts',
    label: 'Smart Training Engine',
    icon: Dumbbell,
    headline: 'Adaptive strength & conditioning that evolves with your fatigue.',
    description:
      'Gone are static PDF programs and rigid spreadsheets. FitAI dynamically auto-regulates loads, set volumes, and RPE targets based on your actual recovery telemetry and previous set performance.',
    highlights: [
      'Automated periodization (Linear, Conjugate, Undulating & Block models)',
      'Real-time set & rep auto-regulation based on bar speed and RPE feedback',
      'Over 280+ high-definition movement guides with biomechanical form cues',
      'Instant substitute exercise engine for tight joints or equipment shortages',
    ],
    mockupType: 'workout',
  },
  {
    id: 'nutrition',
    label: 'Precision Macro & Fueling',
    icon: Utensils,
    headline: 'Macro targets dynamically synchronized with training expenditure.',
    description:
      'Log meals in seconds using AI voice or photo recognition. FitAI adjusts your daily carbohydrate and hydration budget depending on whether today is a heavy leg session, an aerobic run, or a rest day.',
    highlights: [
      'Computer vision food logging with 98% macronutrient identification accuracy',
      'Dynamic carb cycling & pre/intra/post workout nutrient timing recommendations',
      'Hydration & electrolyte tracking tied to sweat rate and ambient climate',
      'Zero-guilt auto-rebalancing when social meals or off-track days happen',
    ],
    mockupType: 'nutrition',
  },
  {
    id: 'biometrics',
    label: 'Biometric Telemetry & HRV',
    icon: Activity,
    headline: 'Sleep architecture, HRV, and central nervous system readiness.',
    description:
      'Biometrics are not just numbers to look at—they dictate your program. FitAI syncs with Apple Health, Whoop, Garmin, and Oura to calculate a scientifically validated readiness score before every session.',
    highlights: [
      'Continuous HRV (rMSSD) baseline monitoring with 7-day rolling deviations',
      'Sleep stage breakdown (Deep, REM, Light) and sleep debt calculation',
      'Acute-to-Chronic Workload Ratio (ACWR) injury prevention guardrails',
      'Resting heart rate trends indicating systemic stress and overreaching',
    ],
    mockupType: 'biometrics',
  },
  {
    id: 'coach',
    label: 'Coach Command Workspace',
    icon: Users,
    headline: 'Manage 30+ athletes in less time than it used to take for 5.',
    description:
      'Designed specifically for performance coaches, gyms, and personal trainers. Monitor your entire roster from a unified cockpit with automated red flags, 1-click workout assignment, and seamless messaging.',
    highlights: [
      'Live client roster with automated red-amber-green adherence flags',
      'Batch programming with custom block templates and superset logic',
      'In-app video form review with telestrator drawing and audio notes',
      'Athletes retain their personal biometric privacy while coaches see performance trends',
    ],
    mockupType: 'coach',
  },
  {
    id: 'copilot',
    label: '24/7 AI Athletic Copilot',
    icon: Bot,
    headline: 'A sports scientist and performance dietitian in your pocket.',
    description:
      'Ask questions about fatigue, exercise substitutions, pre-workout meals, or meet-day tapering. FitAI knows your complete training history, injury flags, and personal records.',
    highlights: [
      'Trained on peer-reviewed sports science, biomechanics, and clinical nutrition',
      'Context-aware answers referencing your exact logs from this week',
      'Autonomous warmup generation tailored to today’s primary lifts',
      'Coaches can customize the AI assistant’s tone and programming philosophy',
    ],
    mockupType: 'copilot',
  },
]

export function FeatureShowcase() {
  const [activePillarId, setActivePillarId] = useState('workouts')
  const currentPillar = PILLARS.find((p) => p.id === activePillarId) || PILLARS[0]

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 text-slate-900 shadow-xl">
      {/* Pillar Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
        {PILLARS.map((pillar) => {
          const isActive = pillar.id === activePillarId
          return (
            <button
              key={pillar.id}
              onClick={() => setActivePillarId(pillar.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold transition ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              <pillar.icon className="size-4" />
              <span>{pillar.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
        {/* Left Column: Descriptions & Highlights */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
            <Sparkles className="size-3.5" />
            <span>Core Innovation</span>
          </div>

          <h3 className="mt-4 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {currentPillar.headline}
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            {currentPillar.description}
          </p>

          <div className="mt-6 space-y-3">
            {currentPillar.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Check className="size-3" />
                </div>
                <span className="text-xs sm:text-sm text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-purple-700 shadow-md shadow-purple-600/25"
            >
              <span>Explore Detailed Specs</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-xs"
            >
              <span>Test In Free Trial</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Interactive Mockup Card */}
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm overflow-hidden">
          {/* Workout Showcase Mockup */}
          {currentPillar.id === 'workouts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Live Session Monitor
                  </span>
                  <h4 className="text-base font-black text-slate-900">Barbell Bench Press (Heavy Wave)</h4>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                  Target: 105 kg
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Set 1: 100 kg × 5 reps</span>
                  </div>
                  <span className="text-slate-500 font-medium">RPE 7.0 • Velocity 0.62 m/s</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Set 2: 105 kg × 5 reps</span>
                  </div>
                  <span className="text-slate-500 font-medium">RPE 8.0 • Velocity 0.54 m/s</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-purple-50 p-3 border border-purple-200">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-purple-600 animate-ping" />
                    <span className="font-bold text-purple-900">Set 3: 107.5 kg × 5 reps</span>
                  </div>
                  <span className="text-xs font-bold text-purple-700">Auto-Bumped +2.5kg</span>
                </div>
              </div>

              <div className="rounded-xl bg-white p-3.5 text-xs text-slate-700 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Volume Accumulation:</span>
                  <span className="font-black text-slate-900">1,560 kg</span>
                </div>
                <div className="mt-2.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          )}

          {/* Nutrition Showcase Mockup */}
          {currentPillar.id === 'nutrition' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="size-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-800">Vision Food Scanner</span>
                </div>
                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                  98% AI Confidence
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Grilled Salmon, Quinoa & Avocado</h4>
                  <span className="text-xs font-black text-emerald-600">685 kcal</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <span className="block text-[10px] text-purple-700 font-bold">Protein</span>
                    <span className="font-black text-slate-900">46g</span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <span className="block text-[10px] text-sky-700 font-bold">Carbs</span>
                    <span className="font-black text-slate-900">52g</span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <span className="block text-[10px] text-amber-700 font-bold">Fats</span>
                    <span className="font-black text-slate-900">28g</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-900 border border-emerald-200 flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                <span className="font-medium">Perfect Post-Workout Window: Meets the 40g leucine threshold for optimal protein synthesis.</span>
              </div>
            </div>
          )}

          {/* Biometrics Showcase Mockup */}
          {currentPillar.id === 'biometrics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Biometric Stream</span>
                <span className="text-xs font-bold text-emerald-700">Connected: Apple Watch Ultra</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                  <span className="text-slate-500 flex items-center gap-1 text-[11px] font-semibold">
                    <Moon className="size-3 text-indigo-500" /> Sleep Architecture
                  </span>
                  <p className="mt-1.5 text-xl font-black text-slate-900">8h 12m</p>
                  <span className="text-[10px] text-emerald-600 font-bold">2h 10m Deep Sleep</span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                  <span className="text-slate-500 flex items-center gap-1 text-[11px] font-semibold">
                    <Heart className="size-3 text-rose-500" /> Resting Heart Rate
                  </span>
                  <p className="mt-1.5 text-xl font-black text-slate-900">46 <span className="text-xs font-normal text-slate-500">bpm</span></p>
                  <span className="text-[10px] text-emerald-600 font-bold">-3 bpm from baseline</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-semibold">HRV Readiness Index (rMSSD)</span>
                  <span className="font-bold text-purple-700">76 ms (Elevated)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '88%' }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Cardiovascular recovery is in the top 5th percentile. Cleared for high-strain training.
                </p>
              </div>
            </div>
          )}

          {/* Coach Workspace Mockup */}
          {currentPillar.id === 'coach' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Athlete Queue</span>
                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
                  3 Actions Pending
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-rose-500" />
                    <div>
                      <p className="font-bold text-slate-900">Elena Rostova</p>
                      <p className="text-[10px] text-slate-500">Hamstring tightness on deadlift set 3</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer">
                    Adjust Load
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-bold text-slate-900">Liam Gallagher</p>
                      <p className="text-[10px] text-slate-500">Completed 4-week strength cycle (+10kg)</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">
                    Assign Phase 2
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-white p-3 text-xs text-slate-600 border border-slate-200 flex items-center justify-between shadow-xs">
                <span>Direct Voice/Video Review:</span>
                <span className="font-bold text-emerald-700">Instant Sync Active ✓</span>
              </div>
            </div>
          )}

          {/* AI Copilot Mockup */}
          {currentPillar.id === 'copilot' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="size-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-900">FitAI Sports Science Agent</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">Trained on 14,000+ papers</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="rounded-xl bg-white p-3 text-slate-700 border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Athlete Question</span>
                  <p className="mt-1 font-semibold text-slate-900">
                    "I only have 35 minutes today instead of 60. How should I condense my push workout?"
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-3 text-purple-950 border border-purple-200">
                  <span className="text-[10px] text-purple-800 font-bold uppercase flex items-center gap-1">
                    <Sparkles className="size-3 text-purple-600" /> FitAI Solution
                  </span>
                  <p className="mt-1 leading-relaxed text-slate-700">
                    "Convert your isolation exercises into antagonistic supersets: Incline DB Press paired with Cable Face Pulls (no rest between pairs). Keep rest to 75s. You preserve 92% of target mechanical tension in 34 minutes."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

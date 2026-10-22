'use client'

import {
  ArrowRight,
  CheckCircle,
  Dumbbell,
  Flame,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface BlueprintConfig {
  title: string
  calories: number
  protein: number
  carbs: number
  fats: number
  split: string[]
  aiNotes: string
  strainLevel: string
  recoveryPriority: string
}

const BLUEPRINTS: Record<string, Record<number, BlueprintConfig>> = {
  hypertrophy: {
    3: {
      title: 'Full Body Wave Hypertrophy',
      calories: 2750,
      protein: 190,
      carbs: 310,
      fats: 68,
      split: ['Mon: Full Body Power', 'Wed: Full Body Hypertrophy', 'Fri: Full Body Density'],
      aiNotes: 'Optimized 48h systemic recovery windows between high-frequency sessions.',
      strainLevel: 'Moderate-High (14.2)',
      recoveryPriority: 'Sleep & Glycogen replenishment',
    },
    4: {
      title: 'Upper / Lower Antagonistic Split',
      calories: 2850,
      protein: 200,
      carbs: 325,
      fats: 70,
      split: ['Mon: Upper Strength', 'Tue: Lower Strength', 'Thu: Upper Hypertrophy', 'Fri: Lower Hypertrophy'],
      aiNotes: 'Double progression scheme on primary compounds with mechanical drop sets.',
      strainLevel: 'High (16.5)',
      recoveryPriority: 'Joint mobility & intra-workout carbs',
    },
    5: {
      title: 'Push / Pull / Legs + Upper / Lower',
      calories: 3000,
      protein: 210,
      carbs: 350,
      fats: 75,
      split: ['Mon: Push (Chest/Shoulders/Tri)', 'Tue: Pull (Back/Bi)', 'Wed: Legs Quad Focus', 'Fri: Upper Compound', 'Sat: Lower Posterior'],
      aiNotes: 'Maximum localized muscular volume with intelligent CNS micro-deloads.',
      strainLevel: 'Very High (18.1)',
      recoveryPriority: 'HRV tracking & 8.5h sleep target',
    },
    6: {
      title: 'PPL x 2 High-Frequency Hypertrophy',
      calories: 3150,
      protein: 220,
      carbs: 380,
      fats: 75,
      split: ['Mon: Push A', 'Tue: Pull A', 'Wed: Legs A', 'Thu: Push B', 'Fri: Pull B', 'Sat: Legs B'],
      aiNotes: 'Elite volume tier requiring strict biometric readiness thresholds.',
      strainLevel: 'Extreme (19.4)',
      recoveryPriority: 'Mandatory cold/contrast & biometric monitor',
    },
  },
  strength: {
    3: {
      title: 'Heavy Tri-Weekly Conjugate',
      calories: 2900,
      protein: 200,
      carbs: 340,
      fats: 75,
      split: ['Mon: Max Effort Squat/Deadlift', 'Wed: Max Effort Bench', 'Fri: Dynamic Lower/Upper'],
      aiNotes: 'High nervous system recruitment with heavy singles and bar speed metrics.',
      strainLevel: 'High CNS (16.0)',
      recoveryPriority: 'Electrolytes & neuromuscular reset',
    },
    4: {
      title: 'Powerlifting Competition Periodization',
      calories: 3050,
      protein: 210,
      carbs: 360,
      fats: 80,
      split: ['Mon: Heavy Squat + Bench Acc', 'Tue: Heavy Bench + Upper Acc', 'Thu: Deadlift + Squat Acc', 'Fri: Comp Bench + Accessories'],
      aiNotes: 'RPE 8-9 cap with auto-regulation based on bar velocity & sleep readiness.',
      strainLevel: 'Very High CNS (17.5)',
      recoveryPriority: 'Rest days & high protein distribution',
    },
    5: {
      title: 'Strength & Muscular Density Block',
      calories: 3200,
      protein: 220,
      carbs: 390,
      fats: 80,
      split: ['Mon: Squat Volume', 'Tue: Bench Heavy', 'Wed: Deadlift Speed', 'Fri: Squat Heavy', 'Sat: Bench Volume'],
      aiNotes: 'Tonnage wave periodization to peak 1RM across 8-week block.',
      strainLevel: 'Extreme CNS (18.8)',
      recoveryPriority: 'Creatine + 4L water + sleep staging',
    },
    6: {
      title: 'Elite Power-Athlete Micro-Cycles',
      calories: 3350,
      protein: 225,
      carbs: 410,
      fats: 85,
      split: ['Mon: Squat', 'Tue: Bench', 'Wed: Deadlift', 'Thu: Press/Overhead', 'Fri: Front Squat', 'Sat: Heavy Accessory'],
      aiNotes: 'Micro-dosed volume blocks for elite athletes with dedicated coaches.',
      strainLevel: 'Peak (19.6)',
      recoveryPriority: 'Professional biometric surveillance',
    },
  },
  conditioning: {
    3: {
      title: 'Hybrid Engine (Strength + Aerobic)',
      calories: 2600,
      protein: 185,
      carbs: 300,
      fats: 60,
      split: ['Mon: Full Body Strength', 'Wed: Zone 2 Aerobic Engine (60m)', 'Sat: Anaerobic Lactate Intervals'],
      aiNotes: 'Balances mitochondrial density with maximal torque production.',
      strainLevel: 'Moderate (14.5)',
      recoveryPriority: 'Hydration & VO2 max monitoring',
    },
    4: {
      title: 'Hyrox & Tactical Performance',
      calories: 2850,
      protein: 195,
      carbs: 340,
      fats: 65,
      split: ['Mon: Lower Compound + Sled Work', 'Tue: 10k Tempo Run', 'Thu: Upper Compound + SkiErg', 'Sat: Hyrox Mixed Simulation'],
      aiNotes: 'Metabolic conditioning programmed around heavy concentric movements.',
      strainLevel: 'High (17.2)',
      recoveryPriority: 'Carb cycling on simulation days',
    },
    5: {
      title: 'Ultra-Endurance & Iron Athlete',
      calories: 3100,
      protein: 190,
      carbs: 420,
      fats: 65,
      split: ['Mon: Gym Strength', 'Tue: Long Interval Run', 'Wed: Recovery Swim/Bike', 'Fri: Threshold Session', 'Sat: Long Trail Endurance'],
      aiNotes: 'High carbohydrate fueling with periodic low-intensity glycogen depleting runs.',
      strainLevel: 'Extreme Aerobic (19.0)',
      recoveryPriority: 'Continuous glucose & sodium replenishment',
    },
    6: {
      title: 'Triathlon / Hybrid Peak Block',
      calories: 3300,
      protein: 200,
      carbs: 460,
      fats: 70,
      split: ['Mon: Swim + Core', 'Tue: Bike Intervals', 'Wed: Heavy Gym', 'Thu: Track Run', 'Fri: Open Water', 'Sat: Brick (Bike/Run)'],
      aiNotes: 'Periodized multi-sport engine synchronized with resting heart rate metrics.',
      strainLevel: 'Maximum (20.1)',
      recoveryPriority: 'Sleep telemetry & active soft-tissue care',
    },
  },
  fatloss: {
    3: {
      title: 'Metabolic Recomposition 3-Day',
      calories: 2150,
      protein: 190,
      carbs: 180,
      fats: 55,
      split: ['Mon: Heavy Full Body Resistance', 'Wed: Full Body + Incline Walk', 'Fri: Functional Conditioning Circuit'],
      aiNotes: 'Preserves lean muscle mass via heavy mechanical tension during a caloric deficit.',
      strainLevel: 'Moderate (13.5)',
      recoveryPriority: 'High protein per meal & 10k daily steps',
    },
    4: {
      title: 'Athletic Cut & Lean Mass Defense',
      calories: 2300,
      protein: 205,
      carbs: 210,
      fats: 58,
      split: ['Mon: Upper Strength', 'Tue: Lower Strength', 'Thu: Upper Volume + HIIT', 'Fri: Lower Volume + Steady State'],
      aiNotes: 'Carbohydrates concentrated around training windows for maximal performance.',
      strainLevel: 'High Deficit (15.5)',
      recoveryPriority: 'Sleep hygiene to mitigate cortisol spikes',
    },
    5: {
      title: 'Rapid Recomp & Conditioning Protocol',
      calories: 2450,
      protein: 215,
      carbs: 230,
      fats: 60,
      split: ['Mon: Push + 20m Zone 2', 'Tue: Pull + 20m Zone 2', 'Wed: Legs Heavy', 'Fri: Upper Conditioning', 'Sat: Sprint Intervals'],
      aiNotes: 'High non-exercise physical activity (NEAT) target with auto-monitored recovery.',
      strainLevel: 'Very High (17.0)',
      recoveryPriority: 'Electrolytes & fiber intake tracking',
    },
    6: {
      title: 'Contest / Stage Lean Precision Cut',
      calories: 2550,
      protein: 225,
      carbs: 240,
      fats: 55,
      split: ['Mon: Chest/Back', 'Tue: Quads/Calves', 'Wed: Shoulders/Arms', 'Thu: Hamstrings/Glutes', 'Fri: Upper Detail', 'Sat: Metabolic Finisher'],
      aiNotes: 'Strict micronutrient budgeting with refeed days triggered by drop in HRV.',
      strainLevel: 'Peak Stress (18.5)',
      recoveryPriority: 'Refeed protocol & stress mitigation',
    },
  },
}

export function InteractiveBlueprint() {
  const [goal, setGoal] = useState<'hypertrophy' | 'strength' | 'conditioning' | 'fatloss'>('hypertrophy')
  const [days, setDays] = useState<number>(4)

  const activePlan = BLUEPRINTS[goal]?.[days] || BLUEPRINTS.hypertrophy[4]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-purple-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-sky-500/5 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <Sparkles className="size-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h3 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Build Your FitAI Athletic Blueprint
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 max-w-xl">
              Select your performance targets below to see how FitAI auto-calculates periodized volume, macronutrient targets, and recovery requirements.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Calculation Engine v2.4</span>
          </div>
        </div>

        {/* Control Selectors */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Goal Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Choose Primary Athletic Goal
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {[
                { id: 'hypertrophy', label: 'Hypertrophy & Muscle', icon: Dumbbell },
                { id: 'strength', label: 'Max Strength & Power', icon: Trophy },
                { id: 'conditioning', label: 'Hyrox & Endurance', icon: Zap },
                { id: 'fatloss', label: 'Fat Loss & Recomp', icon: Flame },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id as any)}
                  className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition ${
                    goal === item.id
                      ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <item.icon
                    className={`size-4 shrink-0 ${
                      goal === item.id ? 'text-purple-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Days Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Weekly Frequency Commitment
            </label>
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {[3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setDays(num)}
                  className={`flex flex-col items-center justify-center rounded-xl border py-3.5 px-2 transition ${
                    days === num
                      ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg font-black">{num}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Days / Wk</span>
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle className="size-3 text-emerald-600" />
              FitAI automatically programs dedicated active recovery and sleep targets.
            </p>
          </div>
        </div>

        {/* Dynamic Blueprint Preview Output */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-slate-50/70 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-widest">
                Generated Program Architecture
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-1">{activePlan.title}</h4>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs">
                Weekly Strain: <strong className="text-purple-700">{activePlan.strainLevel}</strong>
              </span>
            </div>
          </div>

          {/* Macros & Caloric Blueprint */}
          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Daily Calorie Target</span>
              <p className="mt-1 text-2xl font-black text-slate-900">{activePlan.calories} <span className="text-xs font-semibold text-slate-500">kcal</span></p>
              <span className="text-[10px] text-emerald-600 font-bold">TDEE Adjusted</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Protein Target</span>
              <p className="mt-1 text-2xl font-black text-purple-700">{activePlan.protein}g</p>
              <span className="text-[10px] text-slate-500 font-semibold">~2.2g per kg LBM</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Carbohydrate Fuel</span>
              <p className="mt-1 text-2xl font-black text-sky-700">{activePlan.carbs}g</p>
              <span className="text-[10px] text-slate-500 font-semibold">Timed around sessions</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Essential Fats</span>
              <p className="mt-1 text-2xl font-black text-amber-700">{activePlan.fats}g</p>
              <span className="text-[10px] text-slate-500 font-semibold">Hormonal optimization</span>
            </div>
          </div>

          {/* Weekly Schedule Breakdown */}
          <div className="mt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Weekly Microcycle Structure
            </span>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {activePlan.split.map((session, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 shadow-xs"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-purple-100 text-[10px] font-black text-purple-800">
                    {idx + 1}
                  </span>
                  <span className="font-semibold">{session}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Periodization Strategy Callout */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-purple-200 bg-purple-50/60 p-4 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-purple-900 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-purple-600" /> AI Periodization Strategy:
              </span>
              <p className="text-slate-700 font-medium">{activePlan.aiNotes}</p>
              <p className="text-slate-500 text-[11px]">Primary Recovery Key: {activePlan.recoveryPriority}</p>
            </div>

            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 font-bold text-white transition hover:bg-purple-700 shadow-md shadow-purple-600/25"
            >
              <span>Activate In Workspace</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

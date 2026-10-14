'use client'

import type { AthleteWeeklyPlan } from '@/lib/athlete-plan'
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  RotateCcw,
  Sparkles,
  Utensils,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

interface AthleteProgramViewProps {
  plan: AthleteWeeklyPlan
  athleteName?: string
  isCoachView?: boolean
  onToggleDay?: (dayId: string) => void | Promise<void>
  onToggleMeal?: (mealId: string) => void | Promise<void>
}

export function AthleteProgramView({
  plan,
  athleteName,
  isCoachView = false,
  onToggleDay,
  onToggleMeal,
}: AthleteProgramViewProps) {
  const [activeTab, setActiveTab] = useState<'split' | 'meals'>('split')
  const [togglingDayId, setTogglingDayId] = useState<string | null>(null)
  const [togglingMealId, setTogglingMealId] = useState<string | null>(null)

  const completedMealsCount = plan.meals.filter((m) => m.status === 'completed').length
  const remainingMealsCount = plan.meals.filter((m) => m.status === 'remaining').length
  const totalMealsCount = plan.meals.length

  const handleDayClick = async (dayId: string) => {
    if (!onToggleDay) return
    setTogglingDayId(dayId)
    try {
      await onToggleDay(dayId)
    } finally {
      setTogglingDayId(null)
    }
  }

  const handleMealClick = async (mealId: string) => {
    if (!onToggleMeal) return
    setTogglingMealId(mealId)
    try {
      await onToggleMeal(mealId)
    } finally {
      setTogglingMealId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Top Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-300 border border-blue-500/30">
                <Sparkles className="size-3.5 text-blue-400" />
                {plan.level} Level · {plan.daysPerWeek} Days/Week
              </span>
              {athleteName && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200 border border-white/15">
                  Athlete: {athleteName}
                </span>
              )}
              {isCoachView && (
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                  Coach Mode
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {plan.programTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Target Goal: <span className="text-blue-400 font-bold">{plan.goal}</span> · Balanced progressive overload & nutrition targets
            </p>
          </div>

          {/* Quick macro box */}
          <div className="flex items-center gap-2 rounded-2xl bg-white/5 p-3.5 backdrop-blur-md border border-white/10">
            <div className="text-center px-2">
              <p className="text-[10px] font-bold uppercase text-slate-400">Calories</p>
              <p className="text-lg font-black text-amber-400">{plan.targetCalories}</p>
              <span className="text-[9px] text-slate-400">kcal/day</span>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center px-2">
              <p className="text-[10px] font-bold uppercase text-slate-400">Protein</p>
              <p className="text-lg font-black text-blue-400">{plan.targetProtein}g</p>
              <span className="text-[9px] text-slate-400">Muscle build</span>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center px-2">
              <p className="text-[10px] font-bold uppercase text-slate-400">Carbs</p>
              <p className="text-lg font-black text-emerald-400">{plan.targetCarbs}g</p>
              <span className="text-[9px] text-slate-400">Energy</span>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center px-2">
              <p className="text-[10px] font-bold uppercase text-slate-400">Fats</p>
              <p className="text-lg font-black text-rose-400">{plan.targetFat}g</p>
              <span className="text-[9px] text-slate-400">Hormones</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-purple-600/15 blur-3xl" />
      </div>

      {/* ── Completion & Remaining Status Cards (خلص قد إيه وفاضل إيه) ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Completed Workouts */}
        <div className="card p-5 border-l-4 border-l-emerald-500 bg-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                تم إنجازه (Completed)
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {plan.completedWorkoutsCount}
                </p>
                <span className="text-sm font-semibold text-foreground-muted">
                  / {plan.totalWorkoutsCount} تمرين
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-emerald-600">
                {plan.completionPercentage}% من البرنامج الأسبوعي
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="size-6" />
            </span>
          </div>

          <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${plan.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Remaining Workouts */}
        <div className="card p-5 border-l-4 border-l-blue-500 bg-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                متبقي له (Remaining)
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {plan.remainingWorkoutsCount}
                </p>
                <span className="text-sm font-semibold text-foreground-muted">
                  تمارين متبقية
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-foreground-muted">
                {plan.remainingWorkoutsCount === 0
                  ? '🎉 تم إكمال جميع التمارين المقررة!'
                  : `متبقي ${(plan.remainingWorkoutsCount * 45)} دقيقة تدريبية تقريباً`}
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-2xl bg-blue-500/10 text-blue-600">
              <Dumbbell className="size-6" />
            </span>
          </div>
        </div>

        {/* Meals Status */}
        <div className="card p-5 border-l-4 border-l-amber-500 bg-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                حالة الوجبات اليومية
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  {completedMealsCount}
                </p>
                <span className="text-sm font-semibold text-foreground-muted">
                  / {totalMealsCount} وجبة مسجلة
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-foreground-muted">
                {remainingMealsCount > 0
                  ? `متبقي ${remainingMealsCount} وجبة اليوم`
                  : 'تم استيفاء جميع الوجبات المقررة اليوم'}
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-2xl bg-amber-500/10 text-amber-600">
              <Utensils className="size-6" />
            </span>
          </div>
        </div>

        {/* Rest & Recovery Days */}
        <div className="card p-5 border-l-4 border-l-indigo-500 bg-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                أيام الراحة والاستشفاء
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {7 - plan.totalWorkoutsCount}
                </p>
                <span className="text-sm font-semibold text-foreground-muted">
                  أيام استشفاء أسبوعياً
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-foreground-muted">
                إصلاح الألياف العضلية وتجديد الجليكوجين
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600">
              <Clock3 className="size-6" />
            </span>
          </div>
        </div>
      </div>

      {/* ── Switcher Navigation (Split vs Meals) ── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'split'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 text-foreground-muted hover:text-foreground dark:bg-slate-800'
            }`}
          >
            <CalendarDays className="size-4" />
            المخطط الزمني الأسبوعي (Weekly Split Matrix)
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
              {plan.completedWorkoutsCount}/{plan.totalWorkoutsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('meals')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'meals'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 text-foreground-muted hover:text-foreground dark:bg-slate-800'
            }`}
          >
            <Utensils className="size-4" />
            جدول الوجبات والنظام الغذائي (Meals Plan)
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
              {completedMealsCount}/{totalMealsCount}
            </span>
          </button>
        </div>

        <p className="hidden text-xs text-foreground-muted sm:block">
          💡 يمكنك النقر على أي يوم أو وجبة لتغيير حالتها بين مكتمل ومتبقي
        </p>
      </div>

      {/* ── TAB 1: Weekly Split Matrix (7 Days) ── */}
      {activeTab === 'split' && (
        <div className="space-y-4 animate-fade-up">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-extrabold text-foreground">
              جدول الأيام السبعة: التدريب والراحة ومستوى الإنجاز
            </h4>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-foreground-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-500" /> مكتمل ({plan.completedWorkoutsCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-blue-500" /> متبقي ({plan.remainingWorkoutsCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-slate-400" /> يوم راحة
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {plan.splitDays.map((day) => {
              const isRest = day.type === 'rest'
              const isCompleted = day.status === 'completed'
              const isRemaining = day.status === 'remaining'

              return (
                <div
                  key={day.id}
                  className={`card relative flex flex-col justify-between overflow-hidden p-5 transition hover:shadow-md ${
                    isCompleted
                      ? 'border-emerald-500/40 bg-emerald-500/[0.03] dark:bg-emerald-950/10'
                      : isRemaining
                      ? 'border-blue-500/40 bg-blue-500/[0.03] dark:bg-blue-950/10'
                      : 'border-border/70 bg-slate-50/50 dark:bg-slate-900/30 opacity-80'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-xl bg-slate-900 px-2.5 py-1 text-xs font-black text-white dark:bg-slate-800">
                          {day.dayShort}
                        </span>
                        <span className="text-xs font-extrabold text-foreground">
                          {day.dayName}
                        </span>
                      </div>

                      {/* Status Badge */}
                      {isRest ? (
                        <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          💤 يوم راحة (Rest)
                        </span>
                      ) : isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                          <Check className="size-3" /> تم الإنجاز
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
                          ⏳ متبقي للتنفيذ
                        </span>
                      )}
                    </div>

                    {/* Workout Title & Focus */}
                    <div>
                      <h5 className="text-sm font-black text-foreground">
                        {day.title}
                      </h5>
                      <p className="mt-0.5 text-xs text-primary font-semibold">
                        التركيز: {day.focus}
                      </p>
                      {day.estimatedMinutes > 0 && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-foreground-muted font-medium">
                          <Clock3 className="size-3" /> {day.estimatedMinutes} دقيقة مقدرة
                        </p>
                      )}
                    </div>

                    {/* Exercises List */}
                    <div className="space-y-1.5 pt-1 border-t border-border/50">
                      <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
                        {isRest ? 'أنشطة الاستشفاء المقترحة' : 'الحركات والتمارين المقررة'}
                      </p>
                      <div className="space-y-1">
                        {day.exercises.map((ex, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-xl bg-card px-2.5 py-1.5 text-xs border border-border/40"
                          >
                            <span className="truncate text-foreground font-semibold">
                              {ex.name}
                            </span>
                            <span className="shrink-0 text-[11px] font-bold text-foreground-muted ml-2">
                              {ex.sets} × {ex.reps}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button (Toggle status) */}
                  {!isRest && onToggleDay && (
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => handleDayClick(day.id)}
                        disabled={togglingDayId === day.id}
                        className={`w-full rounded-xl py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-primary text-white hover:bg-primary/90 shadow-xs'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <RotateCcw className="size-3.5" />
                            إلغاء التحديد (تغيير إلى متبقي)
                          </>
                        ) : (
                          <>
                            <Check className="size-3.5" />
                            تحديد كـ "تم الإنجاز" ✓
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: Meals & Nutrition ── */}
      {activeTab === 'meals' && (
        <div className="space-y-5 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="text-base font-extrabold text-foreground">
                خطة الوجبات اليومية والمغذيات الكبرى (Macros)
              </h4>
              <p className="text-xs text-foreground-muted">
                تم توزيع {plan.targetCalories} سعرة حرارية و {plan.targetProtein}g بروتين على مدار اليوم
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                تم تناول: {completedMealsCount} وجبة
              </span>
              <span className="rounded-xl bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-300/40">
                متبقي: {remainingMealsCount} وجبة
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {plan.meals.map((meal) => {
              const isEaten = meal.status === 'completed'

              return (
                <div
                  key={meal.id}
                  className={`card flex flex-col justify-between p-5 border transition ${
                    isEaten
                      ? 'border-emerald-500/40 bg-emerald-500/[0.03] dark:bg-emerald-950/10'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-xl px-2.5 py-1 text-xs font-black ${
                            meal.mealType === 'Breakfast'
                              ? 'bg-amber-500/15 text-amber-600'
                              : meal.mealType === 'Lunch'
                              ? 'bg-blue-500/15 text-blue-600'
                              : meal.mealType === 'Dinner'
                              ? 'bg-purple-500/15 text-purple-600'
                              : 'bg-emerald-500/15 text-emerald-600'
                          }`}
                        >
                          {meal.mealType === 'Breakfast'
                            ? 'الفطور'
                            : meal.mealType === 'Lunch'
                            ? 'الغداء'
                            : meal.mealType === 'Dinner'
                            ? 'العشاء'
                            : 'سناك خفيف'}
                        </span>
                        <h5 className="font-extrabold text-foreground text-sm">
                          {meal.name}
                        </h5>
                      </div>

                      {isEaten ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <Check className="size-3" /> تم التناول
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-foreground-muted dark:bg-slate-800">
                          ⏳ متبقية
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-foreground-muted leading-relaxed">
                      {meal.description}
                    </p>

                    {/* Macro pills */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/50 text-center">
                      <div className="rounded-xl bg-slate-100/70 p-2 dark:bg-slate-800/50">
                        <p className="text-[10px] text-foreground-muted font-bold">السعرات</p>
                        <p className="text-xs font-black text-foreground mt-0.5">{meal.calories} kcal</p>
                      </div>
                      <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                        <p className="text-[10px] font-bold">بروتين</p>
                        <p className="text-xs font-black mt-0.5">{meal.protein}g</p>
                      </div>
                      <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                        <p className="text-[10px] font-bold">كارب</p>
                        <p className="text-xs font-black mt-0.5">{meal.carbs}g</p>
                      </div>
                      <div className="rounded-xl bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
                        <p className="text-[10px] font-bold">دهون</p>
                        <p className="text-xs font-black mt-0.5">{meal.fat}g</p>
                      </div>
                    </div>
                  </div>

                  {onToggleMeal && (
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <button
                        type="button"
                        onClick={() => handleMealClick(meal.id)}
                        disabled={togglingMealId === meal.id}
                        className={`w-full rounded-xl py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isEaten
                            ? 'bg-slate-100 text-foreground-muted hover:text-foreground dark:bg-slate-800'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        }`}
                      >
                        {isEaten ? (
                          <>
                            <RotateCcw className="size-3.5" />
                            تغيير إلى وجبة متبقية
                          </>
                        ) : (
                          <>
                            <Check className="size-3.5" />
                            تسجيل تناول الوجبة ✓
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

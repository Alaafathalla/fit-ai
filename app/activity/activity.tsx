'use client'

import { Shell } from '@/components/shell'
import { Spinner } from '@/components/spinner'
import { getActivity, type ActivityItem } from '@/lib/api'
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  Layers3,
  PlayCircle,
  Utensils,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Filter = 'all' | ActivityItem['kind']

export function ActivityPage() {
  const [items,        setItems]        = useState<ActivityItem[]>([])
  const [filter,       setFilter]       = useState<Filter>('all')
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null)

  useEffect(() => {
    getActivity(50)
      .then(setItems)
      .catch(() => setError('Could not load activity history.'))
      .finally(() => setLoading(false))
  }, [])

  const visible       = filter === 'all' ? items : items.filter((i) => i.kind === filter)
  const workoutCount  = items.filter((i) => i.kind === 'workout').length
  const mealCount     = items.filter((i) => i.kind === 'meal').length
  const totalCalories = items.reduce((s, i) => s + (i.calories ?? 0), 0)

  const groups = useMemo(() =>
    visible.reduce<Record<string, ActivityItem[]>>((acc, item) => {
      const label = new Date(item.timestamp).toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric',
      })
      ;(acc[label] ??= []).push(item)
      return acc
    }, {}),
  [visible])

  const FILTERS: [Filter, string][] = [['all', 'All'], ['workout', 'Workouts'], ['meal', 'Meals']]

  const KIND_GRADIENTS = {
    workout: '#2563eb',
    meal:    '#059669',
  }

  return (
    <Shell title="Activity">
      <div className="p-5 sm:p-8">

        {/* Hero */}
        <div className="animate-fade-up mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
              Your history
            </p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Training &amp; nutrition log
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              A unified timeline of completed workouts and logged meals.
            </p>
          </div>
          <div className="flex gap-2">
            {FILTERS.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95"
                style={filter === value
                  ? { background: 'var(--foreground)', color: '#fff', boxShadow: 'var(--shadow-sm)' }
                  : { background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Spinner label="Loading activity…" /> : error ? (
          <div className="card p-8 text-center text-sm" style={{ color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Completed workouts', value: workoutCount,                icon: Dumbbell, gradient: '#2563eb' },
                { label: 'Meals logged',        value: mealCount,                  icon: Utensils, gradient: '#059669' },
                { label: 'Tracked calories',    value: totalCalories.toLocaleString(), icon: Flame, gradient: '#ea580c' },
              ].map(({ label, value, icon: Icon, gradient }, i) => (
                <div
                  key={label}
                  className="animate-fade-up card flex items-center gap-4 p-5"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="icon-box size-11 shrink-0" style={{ background: gradient, color: '#fff' }}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {visible.length === 0 ? (
              <div className="card flex flex-col items-center justify-center p-14 text-center">
                <div className="icon-box size-16 mb-4" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Activity className="size-7" />
                </div>
                <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>No activity yet</h3>
                <p className="mt-1 max-w-sm text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  Complete a workout or log a meal and it will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groups).map(([date, dayItems]) => (
                  <section key={date} className="animate-fade-up">
                    <div className="mb-3 flex items-center gap-2">
                      <CalendarDays className="size-4" style={{ color: 'var(--foreground-muted)' }} />
                      <span className="text-xs font-bold" style={{ color: 'var(--foreground-muted)' }}>{date}</span>
                    </div>
                    <div
                      className="overflow-hidden rounded-2xl"
                      style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                    >
                      {dayItems.map((item, idx) => {
                        const IconFallback = item.kind === 'workout' ? Dumbbell : Utensils
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setSelectedItem(item)
                              }
                            }}
                            className="flex items-center gap-4 p-4 sm:p-5 transition-all cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/50 group select-none"
                            style={{ borderTop: idx ? '1px solid var(--border-subtle)' : undefined }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt=""
                                className="size-14 shrink-0 rounded-2xl object-cover shadow-xs sm:size-16 transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div
                                className="icon-box size-14 shrink-0 rounded-2xl sm:size-16 shadow-xs transition-transform group-hover:scale-105"
                                style={{ background: KIND_GRADIENTS[item.kind], color: '#fff' }}
                              >
                                <IconFallback className="size-5" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-black text-foreground group-hover:text-primary transition-colors">
                                  {item.title}
                                </p>
                                <span
                                  className={`badge ${item.kind === 'workout' ? 'badge-primary' : 'badge-success'} text-[10px]`}
                                >
                                  {item.kind === 'workout' ? 'تمرين (Workout)' : 'وجبة (Meal)'}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-foreground-muted">
                                {item.subtitle} · {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="hidden shrink-0 text-right sm:block">
                                {item.duration ? (
                                  <p className="text-sm font-black text-foreground">{item.duration} min</p>
                                ) : null}
                                {item.calories ? (
                                  <p className="text-xs font-bold text-foreground-muted">{item.calories} kcal</p>
                                ) : null}
                              </div>

                              <div className="grid size-8 place-items-center rounded-xl bg-slate-100 text-foreground-muted group-hover:bg-primary group-hover:text-white transition-all dark:bg-slate-800">
                                <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Rich Activity Detail Modal ── */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSelectedItem(null)
            }}
          >
            <div className="animate-scale-in w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
              {/* Header with Image & Title */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  {selectedItem.image ? (
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="size-16 shrink-0 rounded-2xl object-cover shadow-sm"
                    />
                  ) : (
                    <div
                      className="grid size-16 shrink-0 place-items-center rounded-2xl shadow-sm text-white"
                      style={{ background: KIND_GRADIENTS[selectedItem.kind] }}
                    >
                      {selectedItem.kind === 'workout' ? (
                        <Dumbbell className="size-7" />
                      ) : (
                        <Utensils className="size-7" />
                      )}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${
                          selectedItem.kind === 'workout' ? 'badge-primary' : 'badge-success'
                        } text-[10px]`}
                      >
                        {selectedItem.kind === 'workout' ? 'تمرين مكتمل' : 'وجبة مسجلة'}
                      </span>
                      {selectedItem.workoutDetails?.level && (
                        <span className="badge badge-secondary text-[10px]">
                          {selectedItem.workoutDetails.level}
                        </span>
                      )}
                      {selectedItem.mealDetails?.mealType && (
                        <span className="badge badge-secondary text-[10px]">
                          {selectedItem.mealDetails.mealType}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-lg font-black text-foreground truncate">
                      {selectedItem.title}
                    </h3>
                    <p className="text-xs text-foreground-muted flex items-center gap-1.5 mt-0.5">
                      <CalendarDays className="size-3" />
                      {new Date(selectedItem.timestamp).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      ·{' '}
                      {new Date(selectedItem.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="btn-ghost !p-2 text-foreground-muted hover:text-foreground rounded-xl shrink-0"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Workout Specific Details */}
              {selectedItem.kind === 'workout' && (
                <div className="space-y-4">
                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-2xl bg-blue-500/10 p-3 text-center border border-blue-500/20">
                      <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">المدة</p>
                      <p className="text-base font-black text-foreground mt-0.5">
                        {selectedItem.duration || 30} min
                      </p>
                    </div>
                    <div className="rounded-2xl bg-amber-500/10 p-3 text-center border border-amber-500/20">
                      <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">السعرات المحروقة</p>
                      <p className="text-base font-black text-foreground mt-0.5">
                        {selectedItem.calories || 260} kcal
                      </p>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/10 p-3 text-center border border-emerald-500/20">
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">المجموعات والتمارين</p>
                      <p className="text-base font-black text-foreground mt-0.5">
                        {selectedItem.workoutDetails?.sets || 4} sets · {selectedItem.workoutDetails?.exercises || 6} ex
                      </p>
                    </div>
                  </div>

                  {/* Workout description */}
                  <div className="rounded-2xl bg-slate-100/60 p-4 dark:bg-slate-800/40 border border-border/50 space-y-1.5">
                    <p className="text-xs font-bold text-foreground">وصف الجلسة التدريبية</p>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      {selectedItem.workoutDetails?.description ||
                        `${selectedItem.title} - جلسة تدريبية مكثفة مصممة لزيادة القوة البدنية وتحسين التحمل العضلي ومعدل الحرق.`}
                    </p>
                  </div>

                  {/* Tags */}
                  {selectedItem.workoutDetails?.tags && selectedItem.workoutDetails.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.workoutDetails.tags.map((tag, i) => (
                        <span key={i} className="rounded-xl bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-foreground-muted">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="btn-ghost !text-xs !h-10"
                    >
                      إغلاق
                    </button>
                    <Link
                      href={`/workouts/${selectedItem.targetId || 'w1'}`}
                      className="btn btn-primary !text-xs !h-10 inline-flex items-center gap-2 shadow-xs"
                    >
                      <PlayCircle className="size-4" />
                      فتح صفحة التمرين بالكامل
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Meal Specific Details */}
              {selectedItem.kind === 'meal' && (
                <div className="space-y-4">
                  {/* Macros Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="rounded-2xl bg-slate-100/70 p-3 dark:bg-slate-800/60 border border-border/50">
                      <p className="text-[10px] font-bold text-foreground-muted uppercase">السعرات</p>
                      <p className="text-base font-black text-foreground mt-0.5">
                        {selectedItem.calories || 350}
                      </p>
                      <span className="text-[9px] text-foreground-muted">kcal</span>
                    </div>

                    <div className="rounded-2xl bg-blue-500/10 p-3 border border-blue-500/20">
                      <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">بروتين</p>
                      <p className="text-base font-black text-blue-600 dark:text-blue-400 mt-0.5">
                        {selectedItem.mealDetails?.protein || 32}g
                      </p>
                      <span className="text-[9px] text-foreground-muted">عضلات</span>
                    </div>

                    <div className="rounded-2xl bg-amber-500/10 p-3 border border-amber-500/20">
                      <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">كارب</p>
                      <p className="text-base font-black text-amber-600 dark:text-amber-400 mt-0.5">
                        {selectedItem.mealDetails?.carbs || 45}g
                      </p>
                      <span className="text-[9px] text-foreground-muted">طاقة</span>
                    </div>

                    <div className="rounded-2xl bg-emerald-500/10 p-3 border border-emerald-500/20">
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">دهون</p>
                      <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {selectedItem.mealDetails?.fat || 12}g
                      </p>
                      <span className="text-[9px] text-foreground-muted">هرمونات</span>
                    </div>
                  </div>

                  {/* Nutrition Progress Distribution */}
                  <div className="space-y-1.5 rounded-2xl bg-slate-100/50 p-3.5 dark:bg-slate-800/30 border border-border/40">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>توزيع المغذيات الكبرى (Macros Ratio)</span>
                      <span className="text-[11px] text-foreground-muted">
                        وقت التحضير: {selectedItem.mealDetails?.prepTime || 15} دقيقة
                      </span>
                    </div>
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="bg-blue-500" style={{ width: '40%' }} title="بروتين" />
                      <div className="bg-amber-500" style={{ width: '40%' }} title="كارب" />
                      <div className="bg-emerald-500" style={{ width: '20%' }} title="دهون" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-semibold text-foreground-muted pt-1">
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-blue-500" /> بروتين 40%
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-amber-500" /> كاربوهيدرات 40%
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-emerald-500" /> دهون صحية 20%
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedItem.mealDetails?.tags && selectedItem.mealDetails.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.mealDetails.tags.map((tag, i) => (
                        <span key={i} className="rounded-xl bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-foreground-muted">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="btn-ghost !text-xs !h-10"
                    >
                      إغلاق
                    </button>
                    <Link
                      href="/nutrition"
                      className="btn btn-primary !text-xs !h-10 inline-flex items-center gap-2 shadow-xs"
                    >
                      <Utensils className="size-4" />
                      الانتقال إلى سجل التغذية والوجبات
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}

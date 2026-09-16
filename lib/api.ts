/**
 * FitAI Client API
 * All functions call the Next.js API routes which query PostgreSQL via Prisma.
 * Signatures are identical to the old fake API so no page code needs to change.
 */

export type WorkoutType    = 'Strength' | 'Cardio' | 'Mobility' | 'HIIT'
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Workout {
  id: string
  title: string
  type: WorkoutType
  duration: number
  level: DifficultyLevel
  calories: number
  exercises: number
  sets: number
  image: string
  video?: string
  description: string
  tags: string[]
  rating: number
  completedCount: number
}

export interface Meal {
  id: string
  name: string
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  calories: number
  protein: number
  carbs: number
  fat: number
  prepTime: number
  image: string
  tags: string[]
}

export interface DailyStats {
  date: string
  weight: number
  calories: number
  calorieGoal: number
  workoutMinutes: number
  steps: number
  hydration: number
  sleepHours: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarInitials: string
  avatarColor: string
  plan: 'Free' | 'Pro' | 'Elite'
  goal: string
  currentWeight: number
  targetWeight: number
  streak: number
  fitnessScore: number
  joinedAt: string
}

export interface WeeklyProgress {
  day: string
  caloriesBurned: number
  workoutMinutes: number
  steps: number
}

export interface ProgressMetric {
  label: string
  current: string
  previous: string
  change: string
  positive: boolean
}

export interface CoachMessage {
  id: string
  from: 'ai' | 'user'
  text: string
  timestamp: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    : ''
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`)
  return res.json() as Promise<T>
}

// ─── Workouts ─────────────────────────────────────────────────────────────────

export async function getWorkouts(filter?: WorkoutType | 'All'): Promise<Workout[]> {
  const qs = filter && filter !== 'All' ? `?type=${filter}` : ''
  return apiFetch<Workout[]>(`/api/workouts${qs}`)
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  try {
    return await apiFetch<Workout>(`/api/workouts/${id}`)
  } catch {
    return null
  }
}

export async function completeWorkout(workoutId: string): Promise<{ ok: boolean }> {
  return apiFetch('/api/workouts/complete', {
    method: 'POST',
    body: JSON.stringify({ workoutId }),
  })
}

// ─── Meals ────────────────────────────────────────────────────────────────────

export async function getMeals(mealType?: Meal['mealType'] | 'All'): Promise<Meal[]> {
  const qs = mealType && mealType !== 'All' ? `?mealType=${mealType}` : ''
  return apiFetch<Meal[]>(`/api/meals${qs}`)
}

export async function logMeal(mealId: string): Promise<{ ok: boolean }> {
  return apiFetch('/api/meals/log', {
    method: 'POST',
    body: JSON.stringify({ mealId }),
  })
}

// ─── Daily Stats ──────────────────────────────────────────────────────────────

export async function getDailyStats(days = 7): Promise<DailyStats[]> {
  return apiFetch<DailyStats[]>(`/api/stats?days=${days}`)
}

export async function updateHydration(hydration: number): Promise<{ ok: boolean; hydration: number }> {
  return apiFetch('/api/stats/hydration', {
    method: 'PATCH',
    body: JSON.stringify({ hydration }),
  })
}

// ─── User ─────────────────────────────────────────────────────────────────────

export async function getUserProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/user')
}

export async function updateUserProfile(data: {
  name?: string
  email?: string
  goal?: string
  currentWeight?: number
  targetWeight?: number
}): Promise<{ ok: boolean }> {
  return apiFetch('/api/user', { method: 'PATCH', body: JSON.stringify(data) })
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function getWeeklyProgress(): Promise<WeeklyProgress[]> {
  const data = await apiFetch<{ weekly: WeeklyProgress[]; metrics: ProgressMetric[] }>('/api/progress')
  return data.weekly
}

export async function getProgressMetrics(): Promise<ProgressMetric[]> {
  const data = await apiFetch<{ weekly: WeeklyProgress[]; metrics: ProgressMetric[] }>('/api/progress')
  return data.metrics
}

// ─── Nutrition ────────────────────────────────────────────────────────────────

export async function getTodayNutrition(): Promise<{
  calories: number
  calorieGoal: number
  protein: number
  carbs: number
  fat: number
}> {
  return apiFetch('/api/nutrition')
}

// ─── Coach ────────────────────────────────────────────────────────────────────

export async function getChatHistory(): Promise<CoachMessage[]> {
  return apiFetch<CoachMessage[]>('/api/coach')
}

export async function sendCoachMessage(message: string): Promise<CoachMessage> {
  return apiFetch<CoachMessage>('/api/coach', {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

/**
 * FitAI frontend API client.
 *
 * This project is frontend-only. All data is loaded from the external backend
 * configured in NEXT_PUBLIC_API_BASE_URL (for example: http://localhost:8000/api).
 */

export type WorkoutType = 'Strength' | 'Cardio' | 'Mobility' | 'HIIT'
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
  video?: string | null
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

export interface ActivityItem {
  id: string
  kind: 'workout' | 'meal'
  title: string
  subtitle: string
  timestamp: string
  calories?: number
  duration?: number
  image?: string | null
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getApiBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()

  if (!value) {
    throw new ApiError(
      'NEXT_PUBLIC_API_BASE_URL is not configured. Add it to .env.local, for example http://localhost:8000/api',
      0,
    )
  }

  return value.replace(/\/+$/, '')
}

function buildApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl()}${cleanPath}`
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('Accept', 'application/json')

  if (init?.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // If the external API uses bearer auth, save the token as `access_token`.
  if (typeof window !== 'undefined' && !headers.has('Authorization')) {
    const token = window.localStorage.getItem('access_token')
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response

  try {
    response = await fetch(buildApiUrl(path), {
      ...init,
      headers,
    })
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? `API connection failed: ${error.message}` : 'API connection failed',
      0,
    )
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`

    try {
      const body = await response.json() as { error?: string; message?: string }
      message = body.message ?? body.error ?? message
    } catch {
      // Keep the generic message if the API did not return JSON.
    }

    throw new ApiError(message, response.status)
  }

  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

// GET /workouts
export async function getWorkouts(filter?: WorkoutType | 'All'): Promise<Workout[]> {
  const qs = filter && filter !== 'All' ? `?type=${encodeURIComponent(filter)}` : ''
  return apiFetch<Workout[]>(`/workouts${qs}`)
}

// GET /workouts/:id
export async function getWorkoutById(id: string): Promise<Workout | null> {
  try {
    return await apiFetch<Workout>(`/workouts/${encodeURIComponent(id)}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

// POST /workouts/complete
export async function completeWorkout(workoutId: string): Promise<{ ok: boolean }> {
  return apiFetch('/workouts/complete', {
    method: 'POST',
    body: JSON.stringify({ workoutId }),
  })
}

// GET /meals
export async function getMeals(mealType?: Meal['mealType'] | 'All'): Promise<Meal[]> {
  const qs = mealType && mealType !== 'All' ? `?mealType=${encodeURIComponent(mealType)}` : ''
  return apiFetch<Meal[]>(`/meals${qs}`)
}

// POST /meals/log
export async function logMeal(mealId: string): Promise<{ ok: boolean; logId: string }> {
  return apiFetch('/meals/log', {
    method: 'POST',
    body: JSON.stringify({ mealId }),
  })
}

// GET /stats?days=N
export async function getDailyStats(days = 7): Promise<DailyStats[]> {
  const safeDays = Math.max(1, Math.min(90, Math.trunc(days) || 7))
  return apiFetch<DailyStats[]>(`/stats?days=${safeDays}`)
}

// PATCH /stats/hydration
export async function updateHydration(hydration: number): Promise<{ ok: boolean; hydration: number }> {
  return apiFetch('/stats/hydration', {
    method: 'PATCH',
    body: JSON.stringify({ hydration }),
  })
}

// GET /user
export async function getUserProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/user')
}

// PATCH /user
export async function updateUserProfile(data: {
  name?: string
  email?: string
  goal?: string
  currentWeight?: number
  targetWeight?: number
}): Promise<{ ok: boolean; name: string }> {
  return apiFetch('/user', { method: 'PATCH', body: JSON.stringify(data) })
}

// GET /progress
export async function getWeeklyProgress(): Promise<WeeklyProgress[]> {
  const data = await apiFetch<{ weekly: WeeklyProgress[]; metrics: ProgressMetric[] }>('/progress')
  return data.weekly
}

// GET /progress
export async function getProgressMetrics(): Promise<ProgressMetric[]> {
  const data = await apiFetch<{ weekly: WeeklyProgress[]; metrics: ProgressMetric[] }>('/progress')
  return data.metrics
}

// GET /nutrition
export async function getTodayNutrition(): Promise<{
  calories: number
  calorieGoal: number
  protein: number
  carbs: number
  fat: number
}> {
  return apiFetch('/nutrition')
}

// GET /coach
export async function getChatHistory(): Promise<CoachMessage[]> {
  return apiFetch<CoachMessage[]>('/coach')
}

// POST /coach
export async function sendCoachMessage(message: string): Promise<CoachMessage> {
  return apiFetch<CoachMessage>('/coach', {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

// GET /activity?limit=N
export async function getActivity(limit = 30): Promise<ActivityItem[]> {
  const safeLimit = Math.max(1, Math.min(100, Math.trunc(limit) || 30))
  return apiFetch<ActivityItem[]>(`/activity?limit=${safeLimit}`)
}

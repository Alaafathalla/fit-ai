/**
 * FitAI fake API.
 *
 * The app is frontend-only. There is no database, Prisma client, API route,
 * external backend, or NEXT_PUBLIC_API_BASE_URL requirement.
 *
 * Data is seeded locally and browser mutations are persisted in localStorage
 * so the demo behaves like a small API while staying completely standalone.
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

type InternalUser = UserProfile & { calorieGoal: number }

type WorkoutSession = {
  id: string
  workoutId: string
  completedAt: string
  duration: number
}

type MealLog = {
  id: string
  mealId: string
  loggedAt: string
}

type FakeState = {
  user: InternalUser
  workouts: Workout[]
  meals: Meal[]
  stats: DailyStats[]
  workoutSessions: WorkoutSession[]
  mealLogs: MealLog[]
  chatMessages: CoachMessage[]
}

const STORAGE_KEY = 'fitai-fake-api-v1'
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const NETWORK_DELAY_MS = 120

const WORKOUTS: Workout[] = [
  {
    id: 'w1',
    title: 'Full Body Strength',
    type: 'Strength',
    duration: 42,
    level: 'Intermediate',
    calories: 320,
    exercises: 8,
    sets: 24,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=640&q=80',
    video: 'https://videos.pexels.com/video-files/4761433/4761433-uhd_2560_1440_25fps.mp4',
    description: 'A balanced full-body session targeting all major muscle groups with compound lifts.',
    tags: ['Compound', 'Barbell', 'Hypertrophy'],
    rating: 4.8,
    completedCount: 1240,
  },
  {
    id: 'w2',
    title: 'HIIT Cardio Blast',
    type: 'HIIT',
    duration: 28,
    level: 'Advanced',
    calories: 410,
    exercises: 6,
    sets: 18,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=640&q=80',
    video: 'https://videos.pexels.com/video-files/6550900/6550900-uhd_2560_1440_25fps.mp4',
    description: 'High-intensity intervals designed to maximize calorie burn and boost your VO2 max.',
    tags: ['Cardio', 'Fat Burn', 'No Equipment'],
    rating: 4.7,
    completedCount: 980,
  },
  {
    id: 'w3',
    title: 'Mobility Reset',
    type: 'Mobility',
    duration: 18,
    level: 'Beginner',
    calories: 110,
    exercises: 10,
    sets: 10,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=640&q=80',
    video: 'https://videos.pexels.com/video-files/5319268/5319268-uhd_2560_1440_25fps.mp4',
    description: 'Gentle flow to open tight hips, shoulders, and hamstrings. Perfect for recovery days.',
    tags: ['Recovery', 'Flexibility', 'Yoga'],
    rating: 4.9,
    completedCount: 2100,
  },
  {
    id: 'w4',
    title: 'Upper Body Power',
    type: 'Strength',
    duration: 38,
    level: 'Advanced',
    calories: 295,
    exercises: 7,
    sets: 21,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=640&q=80',
    video: 'https://videos.pexels.com/video-files/4761429/4761429-uhd_2560_1440_25fps.mp4',
    description: 'Chest, back, shoulders, and arms — build upper-body strength and definition.',
    tags: ['Push', 'Pull', 'Dumbbell'],
    rating: 4.6,
    completedCount: 870,
  },
  {
    id: 'w5',
    title: 'Core & Abs Circuit',
    type: 'Strength',
    duration: 22,
    level: 'Intermediate',
    calories: 180,
    exercises: 9,
    sets: 27,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=640&q=80',
    video: 'https://videos.pexels.com/video-files/5319267/5319267-uhd_2560_1440_25fps.mp4',
    description: 'Build a strong, stable core with targeted exercises for abs, obliques, and lower back.',
    tags: ['Core', 'No Equipment', 'Abs'],
    rating: 4.5,
    completedCount: 1560,
  },
  {
    id: 'w6',
    title: 'Morning Run Prep',
    type: 'Cardio',
    duration: 30,
    level: 'Beginner',
    calories: 260,
    exercises: 4,
    sets: 4,
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=640&q=80',
    video: 'https://videos.pexels.com/video-files/5319266/5319266-uhd_2560_1440_25fps.mp4',
    description: 'A steady-state cardio session to build endurance and start the day with energy.',
    tags: ['Cardio', 'Endurance', 'Outdoor'],
    rating: 4.4,
    completedCount: 720,
  },
]

const MEALS: Meal[] = [
  {
    id: 'm1',
    name: 'Green Power Bowl',
    mealType: 'Breakfast',
    calories: 420,
    protein: 28,
    carbs: 48,
    fat: 12,
    prepTime: 10,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640&q=80',
    tags: ['Vegan', 'High Protein', 'Quick'],
  },
  {
    id: 'm2',
    name: 'Salmon & Quinoa',
    mealType: 'Lunch',
    calories: 610,
    protein: 42,
    carbs: 52,
    fat: 18,
    prepTime: 20,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=640&q=80',
    tags: ['Omega-3', 'Gluten Free', 'High Protein'],
  },
  {
    id: 'm3',
    name: 'Turkey Pesto Wrap',
    mealType: 'Dinner',
    calories: 540,
    protein: 36,
    carbs: 46,
    fat: 16,
    prepTime: 15,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=640&q=80',
    tags: ['Lean Protein', 'Meal Prep'],
  },
  {
    id: 'm4',
    name: 'Greek Yogurt Parfait',
    mealType: 'Snack',
    calories: 220,
    protein: 18,
    carbs: 26,
    fat: 5,
    prepTime: 5,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=640&q=80',
    tags: ['Probiotic', 'Quick', 'High Protein'],
  },
  {
    id: 'm5',
    name: 'Avocado Egg Toast',
    mealType: 'Breakfast',
    calories: 380,
    protein: 22,
    carbs: 34,
    fat: 18,
    prepTime: 12,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=640&q=80',
    tags: ['Healthy Fats', 'Quick'],
  },
  {
    id: 'm6',
    name: 'Chicken Stir-Fry',
    mealType: 'Dinner',
    calories: 580,
    protein: 46,
    carbs: 44,
    fat: 14,
    prepTime: 25,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=640&q=80',
    tags: ['Lean Protein', 'Veggie-Rich'],
  },
]

const DAILY_TEMPLATES = [
  { weight: 80.2, calories: 1920, workoutMinutes: 45, steps: 8200, hydration: 2100, sleepHours: 7.2 },
  { weight: 80.0, calories: 1840, workoutMinutes: 0, steps: 5400, hydration: 1800, sleepHours: 6.8 },
  { weight: 79.7, calories: 2050, workoutMinutes: 52, steps: 9100, hydration: 2400, sleepHours: 7.5 },
  { weight: 79.5, calories: 1760, workoutMinutes: 38, steps: 7800, hydration: 2000, sleepHours: 8.0 },
  { weight: 79.2, calories: 1990, workoutMinutes: 60, steps: 11200, hydration: 2600, sleepHours: 7.0 },
  { weight: 78.8, calories: 1680, workoutMinutes: 42, steps: 6200, hydration: 2300, sleepHours: 7.8 },
  { weight: 78.4, calories: 1250, workoutMinutes: 0, steps: 3100, hydration: 1100, sleepHours: 7.5 },
]

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function dayStart(value = new Date()): Date {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

function isoDate(value: Date): string {
  const date = dayStart(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function dateDaysAgo(daysAgo: number, hour = 0): Date {
  const date = dayStart()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, 0, 0, 0)
  return date
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000)
}

function makeDefaultState(): FakeState {
  const stats = DAILY_TEMPLATES.map((template, index) => {
    const daysAgo = DAILY_TEMPLATES.length - 1 - index
    return {
      date: isoDate(dateDaysAgo(daysAgo)),
      calorieGoal: 2000,
      ...template,
    }
  })

  return {
    user: {
      id: 'u1',
      name: 'Mahmoud',
      email: 'mahmoud@fitai.app',
      avatarInitials: 'MA',
      avatarColor: 'bg-[#ffd9c5] text-[#8d4b2e]',
      plan: 'Pro',
      goal: 'Lose fat & build muscle',
      currentWeight: 78.4,
      targetWeight: 75,
      streak: 12,
      fitnessScore: 84,
      joinedAt: isoDate(dateDaysAgo(120)),
      calorieGoal: 2000,
    },
    workouts: clone(WORKOUTS),
    meals: clone(MEALS),
    stats,
    workoutSessions: [
      { id: 'ws-1', workoutId: 'w1', duration: 42, completedAt: dateDaysAgo(1, 18).toISOString() },
      { id: 'ws-2', workoutId: 'w3', duration: 18, completedAt: dateDaysAgo(2, 18).toISOString() },
      { id: 'ws-3', workoutId: 'w4', duration: 38, completedAt: dateDaysAgo(3, 18).toISOString() },
      { id: 'ws-4', workoutId: 'w2', duration: 28, completedAt: dateDaysAgo(5, 18).toISOString() },
    ],
    mealLogs: [
      { id: 'ml-1', mealId: 'm1', loggedAt: hoursAgo(6).toISOString() },
      { id: 'ml-2', mealId: 'm2', loggedAt: hoursAgo(3).toISOString() },
      { id: 'ml-3', mealId: 'm4', loggedAt: hoursAgo(1).toISOString() },
      { id: 'ml-4', mealId: 'm5', loggedAt: dateDaysAgo(1, 8).toISOString() },
      { id: 'ml-5', mealId: 'm6', loggedAt: dateDaysAgo(1, 19).toISOString() },
      { id: 'ml-6', mealId: 'm1', loggedAt: dateDaysAgo(2, 8).toISOString() },
    ],
    chatMessages: [],
  }
}

let memoryState: FakeState | null = null

function normalizeStateDates(state: FakeState): FakeState {
  // Old demo data may have been saved on another day. Keep the fake dataset
  // useful by resetting only when today's row is missing.
  const today = isoDate(new Date())
  if (state.stats.some((item) => item.date === today)) return state
  return makeDefaultState()
}

function getState(): FakeState {
  if (typeof window === 'undefined') {
    if (!memoryState) memoryState = makeDefaultState()
    return memoryState
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = normalizeStateDates(JSON.parse(stored) as FakeState)
      memoryState = parsed
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
      return parsed
    }
  } catch {
    // If localStorage is unavailable/corrupted, fall back to memory-only demo data.
  }

  const initial = makeDefaultState()
  memoryState = initial
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  } catch {
    // Ignore storage errors; the demo can still run in memory.
  }
  return initial
}

function saveState(state: FakeState): void {
  memoryState = state
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Keep the current in-memory state if storage is unavailable.
  }
}

async function fakeDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS))
}

function ensureTodayStat(state: FakeState): DailyStats {
  const today = isoDate(new Date())
  let stat = state.stats.find((item) => item.date === today)
  if (!stat) {
    stat = {
      date: today,
      weight: state.user.currentWeight,
      calories: 0,
      calorieGoal: state.user.calorieGoal,
      workoutMinutes: 0,
      steps: 0,
      hydration: 0,
      sleepHours: 0,
    }
    state.stats.push(stat)
  }
  return stat
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
}

function publicUser(user: InternalUser): UserProfile {
  const { calorieGoal: _calorieGoal, ...profile } = user
  return clone(profile)
}

export async function getWorkouts(filter?: WorkoutType | 'All'): Promise<Workout[]> {
  await fakeDelay()
  const workouts = getState().workouts
  const filtered = filter && filter !== 'All' ? workouts.filter((workout) => workout.type === filter) : workouts
  return clone(filtered)
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  await fakeDelay()
  const workout = getState().workouts.find((item) => item.id === id)
  return workout ? clone(workout) : null
}

export async function completeWorkout(workoutId: string): Promise<{ ok: boolean }> {
  await fakeDelay()
  const state = getState()
  const workout = state.workouts.find((item) => item.id === workoutId)
  if (!workout) throw new Error('Workout not found')

  state.workoutSessions.unshift({
    id: makeId('workout'),
    workoutId: workout.id,
    duration: workout.duration,
    completedAt: new Date().toISOString(),
  })
  workout.completedCount += 1
  ensureTodayStat(state).workoutMinutes += workout.duration
  state.user.streak = Math.max(1, state.user.streak)
  saveState(state)
  return { ok: true }
}

export async function getMeals(mealType?: Meal['mealType'] | 'All'): Promise<Meal[]> {
  await fakeDelay()
  const meals = getState().meals
  const filtered = mealType && mealType !== 'All' ? meals.filter((meal) => meal.mealType === mealType) : meals
  return clone(filtered)
}

export async function logMeal(mealId: string): Promise<{ ok: boolean; logId: string }> {
  await fakeDelay()
  const state = getState()
  const meal = state.meals.find((item) => item.id === mealId)
  if (!meal) throw new Error('Meal not found')

  const logId = makeId('meal')
  state.mealLogs.unshift({ id: logId, mealId: meal.id, loggedAt: new Date().toISOString() })
  ensureTodayStat(state).calories += meal.calories
  saveState(state)
  return { ok: true, logId }
}

export async function getDailyStats(days = 7): Promise<DailyStats[]> {
  await fakeDelay()
  const safeDays = Math.max(1, Math.min(90, Math.trunc(days) || 7))
  const stats = [...getState().stats]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-safeDays)
  return clone(stats)
}

export async function updateHydration(hydration: number): Promise<{ ok: boolean; hydration: number }> {
  await fakeDelay()
  const value = Math.max(0, Math.min(10_000, Math.trunc(hydration)))
  const state = getState()
  ensureTodayStat(state).hydration = value
  saveState(state)
  return { ok: true, hydration: value }
}

export async function getUserProfile(): Promise<UserProfile> {
  await fakeDelay()
  return publicUser(getState().user)
}

export async function updateUserProfile(data: {
  name?: string
  email?: string
  goal?: string
  currentWeight?: number
  targetWeight?: number
}): Promise<{ ok: boolean; name: string }> {
  await fakeDelay()
  const state = getState()

  if (data.name !== undefined) {
    const name = data.name.trim()
    if (!name) throw new Error('Name is required.')
    state.user.name = name
    state.user.avatarInitials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
  }

  if (data.email !== undefined) {
    const email = data.email.trim()
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Please enter a valid email address.')
    state.user.email = email
  }

  if (data.goal !== undefined) state.user.goal = data.goal.trim()
  if (data.currentWeight !== undefined) {
    state.user.currentWeight = data.currentWeight
    ensureTodayStat(state).weight = data.currentWeight
  }
  if (data.targetWeight !== undefined) state.user.targetWeight = data.targetWeight

  saveState(state)
  return { ok: true, name: state.user.name }
}

function progressPayload(state: FakeState): { weekly: WeeklyProgress[]; metrics: ProgressMetric[] } {
  const stats = [...state.stats].sort((a, b) => a.date.localeCompare(b.date)).slice(-7)

  const weekly = stats.map((stat) => ({
    day: DAY_LABELS[new Date(`${stat.date}T12:00:00`).getDay()],
    caloriesBurned: Math.round(stat.workoutMinutes * 8.5),
    workoutMinutes: stat.workoutMinutes,
    steps: stat.steps,
  }))

  const first = stats[0]
  const last = stats[stats.length - 1]
  if (!first || !last) return { weekly, metrics: [] }

  const stepDelta = Math.round(((last.steps - first.steps) / Math.max(first.steps, 1)) * 100)

  const metrics: ProgressMetric[] = [
    {
      label: 'Body Weight',
      current: `${last.weight} kg`,
      previous: `${first.weight} kg`,
      change: `${last.weight < first.weight ? '↓' : last.weight > first.weight ? '↑' : '→'} ${Math.abs(last.weight - first.weight).toFixed(1)} kg`,
      positive: last.weight <= first.weight,
    },
    {
      label: 'Daily Steps',
      current: Math.round(average(stats.map((item) => item.steps))).toLocaleString(),
      previous: first.steps.toLocaleString(),
      change: `${stepDelta >= 0 ? '↑' : '↓'} ${Math.abs(stepDelta)}%`,
      positive: last.steps >= first.steps,
    },
    {
      label: 'Workout Minutes',
      current: `${stats.reduce((sum, item) => sum + item.workoutMinutes, 0)} min`,
      previous: `${first.workoutMinutes} min`,
      change: `${Math.round(average(stats.map((item) => item.workoutMinutes)))} min/day avg`,
      positive: stats.some((item) => item.workoutMinutes > 0),
    },
    {
      label: 'Avg Sleep',
      current: `${average(stats.map((item) => item.sleepHours)).toFixed(1)} h`,
      previous: `${first.sleepHours} h`,
      change: last.sleepHours >= 7 ? 'Goal range' : 'Below 7 h',
      positive: last.sleepHours >= 7,
    },
    {
      label: 'Hydration',
      current: `${last.hydration} ml`,
      previous: `${first.hydration} ml`,
      change: last.hydration >= 2500 ? 'Goal met' : `${2500 - last.hydration} ml to go`,
      positive: last.hydration >= 2500,
    },
    {
      label: 'Calories',
      current: `${last.calories} kcal`,
      previous: `${first.calories} kcal`,
      change: `Goal: ${last.calorieGoal} kcal`,
      positive: Math.abs(last.calories - last.calorieGoal) <= Math.max(150, last.calorieGoal * 0.1),
    },
  ]

  return { weekly, metrics }
}

export async function getWeeklyProgress(): Promise<WeeklyProgress[]> {
  await fakeDelay()
  return clone(progressPayload(getState()).weekly)
}

export async function getProgressMetrics(): Promise<ProgressMetric[]> {
  await fakeDelay()
  return clone(progressPayload(getState()).metrics)
}

export async function getTodayNutrition(): Promise<{
  calories: number
  calorieGoal: number
  protein: number
  carbs: number
  fat: number
}> {
  await fakeDelay()
  const state = getState()
  const today = isoDate(new Date())
  const todayLogs = state.mealLogs.filter((log) => isoDate(new Date(log.loggedAt)) === today)
  const todayMeals = todayLogs
    .map((log) => state.meals.find((meal) => meal.id === log.mealId))
    .filter((meal): meal is Meal => Boolean(meal))

  const stat = ensureTodayStat(state)
  return {
    calories: stat.calories,
    calorieGoal: state.user.calorieGoal,
    protein: Math.round(todayMeals.reduce((sum, meal) => sum + meal.protein, 0)),
    carbs: Math.round(todayMeals.reduce((sum, meal) => sum + meal.carbs, 0)),
    fat: Math.round(todayMeals.reduce((sum, meal) => sum + meal.fat, 0)),
  }
}

export async function getChatHistory(): Promise<CoachMessage[]> {
  await fakeDelay()
  return clone(getState().chatMessages)
}

export async function sendCoachMessage(message: string): Promise<CoachMessage> {
  await fakeDelay()
  const text = message.trim()
  if (!text) throw new Error('Message is required.')

  const state = getState()
  const now = new Date().toISOString()
  state.chatMessages.push({ id: makeId('user'), from: 'user', text, timestamp: now })

  const latest = [...state.stats].sort((a, b) => a.date.localeCompare(b.date)).at(-1)
  const reply: CoachMessage = {
    id: makeId('ai'),
    from: 'ai',
    text: buildCoachReply(text, {
      goal: state.user.goal,
      calorieGoal: state.user.calorieGoal,
      sleepHours: latest?.sleepHours ?? 0,
      hydration: latest?.hydration ?? 0,
      workoutMinutes: latest?.workoutMinutes ?? 0,
    }),
    timestamp: new Date().toISOString(),
  }

  state.chatMessages.push(reply)
  saveState(state)
  return clone(reply)
}

function buildCoachReply(message: string, context: {
  goal: string
  calorieGoal: number
  sleepHours: number
  hydration: number
  workoutMinutes: number
}): string {
  const text = message.toLowerCase()

  if (text.includes('sleep') || text.includes('recover')) {
    const sleepNote = context.sleepHours
      ? `Your latest sleep entry is ${context.sleepHours} hours.`
      : 'You do not have a recent sleep entry yet.'
    return `${sleepNote} Aim for a consistent 7.5–9 hour window, keep tonight’s session lighter if fatigue is high, and use the Recovery page before adding intensity.`
  }

  if (text.includes('calorie') || text.includes('food') || text.includes('nutrition') || text.includes('meal')) {
    return `Your current calorie target is ${context.calorieGoal.toLocaleString()} kcal/day. Keep protein consistent, build meals around minimally processed foods, and adjust portions based on your weekly trend rather than a single day.`
  }

  if (text.includes('workout') || text.includes('plan') || text.includes('strength') || text.includes('cardio')) {
    const recoveryHint = context.sleepHours >= 7 && context.hydration >= 2_000
      ? 'Your latest recovery markers support a normal training day.'
      : 'Your recovery markers suggest keeping today’s intensity controlled.'
    return `${recoveryHint} For your goal${context.goal ? ` (${context.goal})` : ''}, use 3–5 structured training days, keep at least one recovery day between demanding sessions, and progress volume gradually.`
  }

  if (text.includes('water') || text.includes('hydrat')) {
    return `Your latest hydration entry is ${context.hydration.toLocaleString()} ml. A practical daily target is around 2.5 L, with more fluid around longer or hotter training sessions.`
  }

  return `For ${context.goal || 'your current fitness goal'}, focus on consistency first: progressive training, enough protein, regular sleep, and a weekly trend check. I can help you turn that into a workout plan, nutrition target, or recovery routine.`
}

export async function getActivity(limit = 30): Promise<ActivityItem[]> {
  await fakeDelay()
  const safeLimit = Math.max(1, Math.min(100, Math.trunc(limit) || 30))
  const state = getState()

  const workoutActivity: ActivityItem[] = state.workoutSessions.map((session) => {
    const workout = state.workouts.find((item) => item.id === session.workoutId)
    return {
      id: `workout-${session.id}`,
      kind: 'workout',
      title: workout?.title ?? 'Workout',
      subtitle: `${workout?.type ?? 'Training'} workout`,
      timestamp: session.completedAt,
      calories: workout?.calories,
      duration: session.duration,
      image: workout?.image ?? null,
    }
  })

  const mealActivity: ActivityItem[] = state.mealLogs.map((log) => {
    const meal = state.meals.find((item) => item.id === log.mealId)
    return {
      id: `meal-${log.id}`,
      kind: 'meal',
      title: meal?.name ?? 'Meal',
      subtitle: `${meal?.mealType ?? 'Meal'} logged`,
      timestamp: log.loggedAt,
      calories: meal?.calories,
      image: meal?.image ?? null,
    }
  })

  return clone(
    [...workoutActivity, ...mealActivity]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, safeLimit),
  )
}

/** Optional helper for development/testing. */
export function resetFakeApi(): void {
  const state = makeDefaultState()
  saveState(state)
}

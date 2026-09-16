/**
 * FitAI Fake API
 * Simulates async API calls with realistic data and latency.
 */

export type WorkoutType = 'Strength' | 'Cardio' | 'Mobility' | 'HIIT'
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Workout {
  id: string
  title: string
  type: WorkoutType
  duration: number // minutes
  level: DifficultyLevel
  calories: number
  exercises: number
  sets: number
  image: string
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
  protein: number // grams
  carbs: number
  fat: number
  prepTime: number // minutes
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
  hydration: number // ml
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

// ─── Mock Data ────────────────────────────────────────────────────────────────

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
    image: '/fitai-athlete.png',
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
    image: '/fitai-athlete.png',
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
    image: '/fitai-athlete.png',
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
    image: '/fitai-athlete.png',
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
    image: '/fitai-athlete.png',
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
    image: '/fitai-athlete.png',
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
    image: '/placeholder.jpg',
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
    image: '/placeholder.jpg',
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
    image: '/placeholder.jpg',
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
    image: '/placeholder.jpg',
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
    image: '/placeholder.jpg',
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
    image: '/placeholder.jpg',
    tags: ['Lean Protein', 'Veggie-Rich'],
  },
]

const DAILY_STATS: DailyStats[] = [
  { date: '2025-06-18', weight: 80.2, calories: 1920, calorieGoal: 2000, workoutMinutes: 45, steps: 8200, hydration: 2100, sleepHours: 7.2 },
  { date: '2025-06-19', weight: 80.0, calories: 1840, calorieGoal: 2000, workoutMinutes: 0,  steps: 5400, hydration: 1800, sleepHours: 6.8 },
  { date: '2025-06-20', weight: 79.7, calories: 2050, calorieGoal: 2000, workoutMinutes: 52, steps: 9100, hydration: 2400, sleepHours: 7.5 },
  { date: '2025-06-21', weight: 79.5, calories: 1760, calorieGoal: 2000, workoutMinutes: 38, steps: 7800, hydration: 2000, sleepHours: 8.0 },
  { date: '2025-06-22', weight: 79.2, calories: 1990, calorieGoal: 2000, workoutMinutes: 60, steps: 11200, hydration: 2600, sleepHours: 7.0 },
  { date: '2025-06-23', weight: 78.8, calories: 1680, calorieGoal: 2000, workoutMinutes: 0,  steps: 6200, hydration: 1900, sleepHours: 7.8 },
  { date: '2025-06-24', weight: 78.4, calories: 1240, calorieGoal: 2000, workoutMinutes: 0,  steps: 3100, hydration: 1100, sleepHours: 7.5 },
]

const USER_PROFILE: UserProfile = {
  id: 'u1',
  name: 'Mahmoud',
  email: 'mahmoud@fitai.app',
  avatarInitials: 'MA',
  avatarColor: 'bg-[#ffd9c5] text-[#8d4b2e]',
  plan: 'Pro',
  goal: 'Lose fat & build muscle',
  currentWeight: 78.4,
  targetWeight: 75.0,
  streak: 12,
  fitnessScore: 84,
  joinedAt: '2025-01-15',
}

const WEEKLY_PROGRESS: WeeklyProgress[] = [
  { day: 'Mon', caloriesBurned: 380, workoutMinutes: 45, steps: 8200 },
  { day: 'Tue', caloriesBurned: 210, workoutMinutes: 0,  steps: 5400 },
  { day: 'Wed', caloriesBurned: 510, workoutMinutes: 52, steps: 9100 },
  { day: 'Thu', caloriesBurned: 340, workoutMinutes: 38, steps: 7800 },
  { day: 'Fri', caloriesBurned: 620, workoutMinutes: 60, steps: 11200 },
  { day: 'Sat', caloriesBurned: 190, workoutMinutes: 0,  steps: 6200 },
  { day: 'Sun', caloriesBurned: 90,  workoutMinutes: 0,  steps: 3100 },
]

const PROGRESS_METRICS: ProgressMetric[] = [
  { label: 'Body Weight',    current: '78.4 kg', previous: '80.2 kg', change: '↓ 1.8 kg',   positive: true  },
  { label: 'Body Fat %',     current: '18.2 %',  previous: '19.8 %',  change: '↓ 1.6 %',    positive: true  },
  { label: 'Muscle Mass',    current: '38.6 kg', previous: '37.9 kg', change: '↑ 0.7 kg',   positive: true  },
  { label: 'Resting HR',     current: '62 bpm',  previous: '66 bpm',  change: '↓ 4 bpm',    positive: true  },
  { label: 'Daily Steps',    current: '7,286',   previous: '6,100',   change: '↑ 19.4 %',   positive: true  },
  { label: 'Workout Volume', current: '12,480',  previous: '11,200',  change: '↑ 11.4 %',   positive: true  },
]

const AI_RESPONSES = [
  "Great question! Based on your recent training data, I'd recommend adding 10% more volume this week.",
  "Your recovery looks excellent. You're ready for a high-intensity session today.",
  "To hit your goal faster, try cycling your carbs — high on training days, moderate on rest days.",
  "I noticed your sleep average dipped below 7 hours this week. Prioritizing sleep will dramatically boost your gains.",
  "Your bench press has been plateauing for 2 weeks. Time for a deload — reduce weight by 20% for 5 days.",
  "Excellent consistency! You've completed 85% of your planned workouts this month.",
  "Based on your body metrics, I've adjusted your calorie target to 1,950 kcal for optimal fat loss.",
]

// ─── Async API Helpers ────────────────────────────────────────────────────────

function delay(ms = 400 + Math.random() * 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Exported API Functions ───────────────────────────────────────────────────

export async function getWorkouts(filter?: WorkoutType | 'All'): Promise<Workout[]> {
  await delay()
  if (!filter || filter === 'All') return WORKOUTS
  return WORKOUTS.filter((w) => w.type === filter)
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  await delay(200)
  return WORKOUTS.find((w) => w.id === id) ?? null
}

export async function getMeals(mealType?: Meal['mealType'] | 'All'): Promise<Meal[]> {
  await delay()
  if (!mealType || mealType === 'All') return MEALS
  return MEALS.filter((m) => m.mealType === mealType)
}

export async function getDailyStats(days = 7): Promise<DailyStats[]> {
  await delay()
  return DAILY_STATS.slice(-days)
}

export async function getUserProfile(): Promise<UserProfile> {
  await delay(200)
  return USER_PROFILE
}

export async function getWeeklyProgress(): Promise<WeeklyProgress[]> {
  await delay()
  return WEEKLY_PROGRESS
}

export async function getProgressMetrics(): Promise<ProgressMetric[]> {
  await delay()
  return PROGRESS_METRICS
}

export async function sendCoachMessage(message: string): Promise<CoachMessage> {
  await delay(600 + Math.random() * 400)
  const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]
  return {
    id: `msg-${Date.now()}`,
    from: 'ai',
    text: randomResponse,
    timestamp: new Date().toISOString(),
  }
}

export async function getTodayNutrition(): Promise<{
  calories: number
  calorieGoal: number
  protein: number
  carbs: number
  fat: number
}> {
  await delay(200)
  const today = DAILY_STATS[DAILY_STATS.length - 1]
  return {
    calories: today.calories,
    calorieGoal: today.calorieGoal,
    protein: 126,
    carbs: 148,
    fat: 42,
  }
}

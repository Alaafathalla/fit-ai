export interface AthleteSplitExercise {
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
  completed?: boolean
}

export interface AthleteSplitDay {
  id: string
  dayNumber: number
  dayName: string
  dayShort: string
  title: string
  focus: string
  type: 'training' | 'rest'
  status: 'completed' | 'remaining' | 'rest'
  estimatedMinutes: number
  exercises: AthleteSplitExercise[]
}

export interface AthleteMealItem {
  id: string
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  description: string
  status: 'completed' | 'remaining'
}

export interface AthleteWeeklyPlan {
  programTitle: string
  level: string
  goal: string
  daysPerWeek: number
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
  completedWorkoutsCount: number
  totalWorkoutsCount: number
  remainingWorkoutsCount: number
  completionPercentage: number
  splitDays: AthleteSplitDay[]
  meals: AthleteMealItem[]
}

export function calculatePlanStats(plan: AthleteWeeklyPlan): AthleteWeeklyPlan {
  const trainingDays = plan.splitDays.filter((d) => d.type === 'training')
  const total = trainingDays.length
  const completed = trainingDays.filter((d) => d.status === 'completed').length
  const remaining = Math.max(0, total - completed)
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    ...plan,
    totalWorkoutsCount: total,
    completedWorkoutsCount: completed,
    remainingWorkoutsCount: remaining,
    completionPercentage: percentage,
  }
}

export function toggleSplitDayStatus(plan: AthleteWeeklyPlan, dayId: string): AthleteWeeklyPlan {
  const nextDays = plan.splitDays.map((d) => {
    if (d.id !== dayId) return d
    if (d.type === 'rest') return d
    const nextStatus = d.status === 'completed' ? 'remaining' : 'completed'
    return {
      ...d,
      status: nextStatus as 'completed' | 'remaining',
      exercises: d.exercises.map((ex) => ({ ...ex, completed: nextStatus === 'completed' })),
    }
  })

  return calculatePlanStats({
    ...plan,
    splitDays: nextDays,
  })
}

export function toggleMealStatus(plan: AthleteWeeklyPlan, mealId: string): AthleteWeeklyPlan {
  const nextMeals = plan.meals.map((m) => {
    if (m.id !== mealId) return m
    return {
      ...m,
      status: (m.status === 'completed' ? 'remaining' : 'completed') as 'completed' | 'remaining',
    }
  })

  return {
    ...plan,
    meals: nextMeals,
  }
}

export function createDefaultUserPlan(input?: {
  name?: string
  goal?: string
  currentWeight?: number
  targetWeight?: number
}): AthleteWeeklyPlan {
  const goal = input?.goal || 'Lean Muscle & Body Recomposition'
  const weight = input?.currentWeight || 78
  const targetCalories = Math.round(weight * 28)
  const protein = Math.round(weight * 2.0)
  const fat = Math.round((targetCalories * 0.25) / 9)
  const carbs = Math.max(100, Math.round((targetCalories - (protein * 4 + fat * 9)) / 4))

  const splitDays: AthleteSplitDay[] = [
    {
      id: 'day-mon',
      dayNumber: 1,
      dayName: 'Monday',
      dayShort: 'Mon',
      title: 'Upper Body Power & Push',
      focus: 'Chest, Shoulders & Triceps',
      type: 'training',
      status: 'completed',
      estimatedMinutes: 50,
      exercises: [
        { name: 'Barbell Flat Bench Press', sets: 4, reps: '6-8', rest: '2-3 min', notes: 'Maintain leg drive & packed scapulae', completed: true },
        { name: 'Incline Dumbbell Press (30°)', sets: 3, reps: '8-10', rest: '90s', notes: 'Full clavicular stretch', completed: true },
        { name: 'Standing Overhead Barbell Press', sets: 3, reps: '8', rest: '2 min', notes: 'Squeeze glutes to protect spine', completed: true },
        { name: 'Cable Lateral Raise', sets: 4, reps: '12-15', rest: '60s', notes: 'Constant continuous tension', completed: true },
        { name: 'Overhead Cable Triceps Extension', sets: 3, reps: '12', rest: '60s', notes: 'Full elbow extension', completed: true },
      ],
    },
    {
      id: 'day-tue',
      dayNumber: 2,
      dayName: 'Tuesday',
      dayShort: 'Tue',
      title: 'Lower Body Quad & Core Dominant',
      focus: 'Quads, Adductors & Abs',
      type: 'training',
      status: 'completed',
      estimatedMinutes: 55,
      exercises: [
        { name: 'Barbell Back Squat', sets: 4, reps: '6-8', rest: '3 min', notes: 'Drive through midfoot, knees track toes', completed: true },
        { name: 'Bulgarian Split Squat', sets: 3, reps: '10/leg', rest: '90s', notes: 'Deep unilateral quad burn', completed: true },
        { name: 'Leg Extension Machine', sets: 3, reps: '12-15', rest: '60s', notes: '2-second peak isometric hold', completed: true },
        { name: 'Standing Calf Raise', sets: 4, reps: '15', rest: '60s', notes: 'Pause at full stretch', completed: true },
        { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', rest: '60s', notes: 'Roll pelvis upward', completed: true },
      ],
    },
    {
      id: 'day-wed',
      dayNumber: 3,
      dayName: 'Wednesday',
      dayShort: 'Wed',
      title: 'Active Recovery & Mobility',
      focus: 'Hip Openers, Thoracic Spine & Light Walk',
      type: 'rest',
      status: 'rest',
      estimatedMinutes: 30,
      exercises: [
        { name: '90/90 Hip Flow', sets: 3, reps: '60s/side', rest: '30s', notes: 'Internal & external rotation' },
        { name: 'Thoracic Foam Rolling', sets: 3, reps: '10 sweeps', rest: '30s', notes: 'Extend across midback' },
        { name: 'Zone 2 Incline Walking', sets: 1, reps: '25 min', rest: '—', notes: 'HR at 120-130 BPM' },
      ],
    },
    {
      id: 'day-thu',
      dayNumber: 4,
      dayName: 'Thursday',
      dayShort: 'Thu',
      title: 'Upper Body Hypertrophy & Pull',
      focus: 'Lats, Rhomboids, Biceps & Rear Delts',
      type: 'training',
      status: 'completed',
      estimatedMinutes: 45,
      exercises: [
        { name: 'Weighted Neutral Pull-ups', sets: 4, reps: '6-8', rest: '2 min', notes: 'Full bottom hang stretch', completed: true },
        { name: 'Chest-Supported Row', sets: 4, reps: '10', rest: '90s', notes: 'Squeeze back together', completed: true },
        { name: 'Face Pulls with Rope', sets: 4, reps: '15', rest: '60s', notes: 'High elbow rotation', completed: true },
        { name: 'Incline Dumbbell Biceps Curls', sets: 3, reps: '10-12', rest: '60s', notes: 'Long head stretch', completed: true },
      ],
    },
    {
      id: 'day-fri',
      dayNumber: 5,
      dayName: 'Friday',
      dayShort: 'Fri',
      title: 'Posterior Chain & Hamstring Power',
      focus: 'Hamstrings, Glutes & Traps',
      type: 'training',
      status: 'remaining',
      estimatedMinutes: 50,
      exercises: [
        { name: 'Romanian Deadlift (RDL)', sets: 4, reps: '8-10', rest: '2-3 min', notes: 'Neutral neck, hinge back smoothly', completed: false },
        { name: 'Barbell Hip Thrust', sets: 4, reps: '10-12', rest: '90s', notes: 'Posterior pelvic tilt at apex', completed: false },
        { name: 'Seated Leg Curl', sets: 3, reps: '12', rest: '60s', notes: 'Controlled 3s negative', completed: false },
        { name: 'Heavy Farmer Carries', sets: 4, reps: '40m', rest: '90s', notes: 'Braced core, upright carriage', completed: false },
      ],
    },
    {
      id: 'day-sat',
      dayNumber: 6,
      dayName: 'Saturday',
      dayShort: 'Sat',
      title: 'Metabolic Finisher or Play',
      focus: 'Optional HIIT / Outdoor Run / Mobility',
      type: 'rest',
      status: 'rest',
      estimatedMinutes: 30,
      exercises: [
        { name: 'Light Kettlebell Swings', sets: 4, reps: '15', rest: '60s', notes: 'Snappy hip hinge' },
        { name: 'Deep Diaphragmatic Breathwork', sets: 1, reps: '10 min', rest: '—', notes: 'Parasympathetic shift' },
      ],
    },
    {
      id: 'day-sun',
      dayNumber: 7,
      dayName: 'Sunday',
      dayShort: 'Sun',
      title: 'Complete Rest & Weekly Reset',
      focus: 'Central Nervous System Rest & Meal Prep',
      type: 'rest',
      status: 'rest',
      estimatedMinutes: 0,
      exercises: [
        { name: 'Full Rest Day', sets: 1, reps: 'All day', rest: '—', notes: 'Sleep, hydrate and replenish glycogen' },
      ],
    },
  ]

  const meals: AthleteMealItem[] = [
    {
      id: 'm1',
      mealType: 'Breakfast',
      name: 'Power Scramble & Rolled Oats Bowl',
      calories: 520,
      protein: 42,
      carbs: 58,
      fat: 14,
      description: '3 whole eggs + 3 egg whites with baby spinach, 70g organic oats with blueberries & raw honey.',
      status: 'completed',
    },
    {
      id: 'm2',
      mealType: 'Lunch',
      name: 'Herb-Grilled Chicken & Roasted Sweet Potato',
      calories: 640,
      protein: 54,
      carbs: 68,
      fat: 16,
      description: '200g tender grilled chicken breast, 220g baked sweet potato wedges, steamed asparagus with olive oil.',
      status: 'completed',
    },
    {
      id: 'm3',
      mealType: 'Dinner',
      name: 'Pan-Seared Salmon & Quinoa Medley',
      calories: 580,
      protein: 46,
      carbs: 45,
      fat: 22,
      description: '180g wild Atlantic salmon fillet, 1 cup cooked tri-color quinoa, roasted zucchini and lemon drizzle.',
      status: 'remaining',
    },
    {
      id: 'm4',
      mealType: 'Snack',
      name: 'Greek Yogurt Crunch & Whey Parfait',
      calories: 310,
      protein: 32,
      carbs: 26,
      fat: 8,
      description: '220g 0% Greek yogurt, 1/2 scoop vanilla isolate, 15g sliced almonds, and fresh cinnamon.',
      status: 'remaining',
    },
  ]

  return calculatePlanStats({
    programTitle: '4-Day Athletic Hypertrophy & Power Split',
    level: 'Intermediate',
    goal,
    daysPerWeek: 4,
    targetCalories,
    targetProtein: protein,
    targetCarbs: carbs,
    targetFat: fat,
    completedWorkoutsCount: 3,
    totalWorkoutsCount: 4,
    remainingWorkoutsCount: 1,
    completionPercentage: 75,
    splitDays,
    meals,
  })
}

// Pre-seeded plans for coach roster clients
export const SEED_CLIENT_PLANS: Record<string, AthleteWeeklyPlan> = {
  // Maya Hassan - Strength & Recomposition (3 done, 1 left)
  c1: {
    programTitle: 'Push-Pull-Legs Hypertrophy Protocol',
    level: 'Advanced',
    goal: 'Strength & Recomposition',
    daysPerWeek: 4,
    targetCalories: 2150,
    targetProtein: 155,
    targetCarbs: 230,
    targetFat: 65,
    completedWorkoutsCount: 3,
    totalWorkoutsCount: 4,
    remainingWorkoutsCount: 1,
    completionPercentage: 75,
    splitDays: [
      {
        id: 'c1-mon',
        dayNumber: 1,
        dayName: 'Monday',
        dayShort: 'Mon',
        title: 'Upper Push & Delts Hypertrophy',
        focus: 'Chest, Anterior Delts & Triceps',
        type: 'training',
        status: 'completed',
        estimatedMinutes: 50,
        exercises: [
          { name: 'Barbell Incline Bench Press', sets: 4, reps: '8', rest: '2 min', completed: true },
          { name: 'Flat Dumbbell Press', sets: 4, reps: '10', rest: '90s', completed: true },
          { name: 'Lateral Cable Deltoid Raise', sets: 4, reps: '15', rest: '60s', completed: true },
          { name: 'Overhead Rope Extension', sets: 3, reps: '12', rest: '60s', completed: true },
        ],
      },
      {
        id: 'c1-tue',
        dayNumber: 2,
        dayName: 'Tuesday',
        dayShort: 'Tue',
        title: 'Posterior Chain & Deadlift',
        focus: 'Hamstrings, Glutes & Upper Back',
        type: 'training',
        status: 'completed',
        estimatedMinutes: 55,
        exercises: [
          { name: 'Conventional Deadlift', sets: 4, reps: '5', rest: '3 min', completed: true },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10/side', rest: '90s', completed: true },
          { name: 'Lying Hamstring Curls', sets: 4, reps: '12', rest: '60s', completed: true },
        ],
      },
      {
        id: 'c1-wed',
        dayNumber: 3,
        dayName: 'Wednesday',
        dayShort: 'Wed',
        title: 'Active Mobility & Core Stability',
        focus: 'Spine, Hips & Walk',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 25,
        exercises: [
          { name: 'Cat-Cow & Thoracic Rotations', sets: 3, reps: '10 reps', rest: '30s' },
          { name: 'Paloff Press', sets: 3, reps: '15/side', rest: '60s' },
        ],
      },
      {
        id: 'c1-thu',
        dayNumber: 4,
        dayName: 'Thursday',
        dayShort: 'Thu',
        title: 'Upper Pull & Lat Volume',
        focus: 'Lats, Rhomboids & Biceps',
        type: 'training',
        status: 'completed',
        estimatedMinutes: 45,
        exercises: [
          { name: 'Weighted Pull-ups', sets: 4, reps: '6', rest: '2 min', completed: true },
          { name: 'Chest-Supported Row', sets: 4, reps: '10', rest: '90s', completed: true },
          { name: 'Spider Curls', sets: 3, reps: '12', rest: '60s', completed: true },
        ],
      },
      {
        id: 'c1-fri',
        dayNumber: 5,
        dayName: 'Friday',
        dayShort: 'Fri',
        title: 'Quad Dominance & Squat Depth',
        focus: 'Squat, Lunges & Calves',
        type: 'training',
        status: 'remaining',
        estimatedMinutes: 50,
        exercises: [
          { name: 'Barbell Back Squat (Depth Focus)', sets: 4, reps: '6-8', rest: '3 min', completed: false, notes: 'Coach note: Maintain vertical torso' },
          { name: 'Leg Press with High Feet', sets: 3, reps: '12', rest: '90s', completed: false },
          { name: 'Walking Dumbbell Lunges', sets: 3, reps: '12 steps', rest: '60s', completed: false },
        ],
      },
      {
        id: 'c1-sat',
        dayNumber: 6,
        dayName: 'Saturday',
        dayShort: 'Sat',
        title: 'Rest & Parasympathetic Recovery',
        focus: 'Hydration & Sauna',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 0,
        exercises: [{ name: 'Sauna Session & Cold Splash', sets: 3, reps: '15m', rest: '5m' }],
      },
      {
        id: 'c1-sun',
        dayNumber: 7,
        dayName: 'Sunday',
        dayShort: 'Sun',
        title: 'Weekly Check-in & Macro Prep',
        focus: 'Rest & Recovery',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 0,
        exercises: [{ name: 'Weekly Progress Photo & Weigh-in', sets: 1, reps: 'Morning', rest: '—' }],
      },
    ],
    meals: [
      {
        id: 'c1-m1',
        mealType: 'Breakfast',
        name: 'Egg White Frittata with Feta & Avocado Toast',
        calories: 490,
        protein: 38,
        carbs: 42,
        fat: 18,
        description: '4 egg whites + 1 whole egg frittata with tomatoes and 1 slice sourdough with 40g avocado.',
        status: 'completed',
      },
      {
        id: 'c1-m2',
        mealType: 'Lunch',
        name: 'Turkey Breast & Basmati Rice Power Bowl',
        calories: 630,
        protein: 52,
        carbs: 72,
        fat: 14,
        description: '190g sliced turkey breast, 1.5 cups steamed basmati rice with cucumber yogurt tzatziki.',
        status: 'completed',
      },
      {
        id: 'c1-m3',
        mealType: 'Dinner',
        name: 'Lean Sirloin Steak & Roasted Asparagus',
        calories: 590,
        protein: 48,
        carbs: 35,
        fat: 26,
        description: '180g lean beef sirloin, roasted rosemary baby potatoes and steamed garlic asparagus.',
        status: 'completed',
      },
      {
        id: 'c1-m4',
        mealType: 'Snack',
        name: 'Whey Isolate Shake & Rice Cakes',
        calories: 280,
        protein: 30,
        carbs: 28,
        fat: 3,
        description: '1 scoop hydrolyzed whey isolate with 2 chocolate rice cakes and sliced banana.',
        status: 'remaining',
      },
    ],
  },

  // Omar Saleh - Fat loss & metabolic conditioning (2 done, 2 left)
  c2: {
    programTitle: 'Metabolic Conditioning & Fat Shred Split',
    level: 'Intermediate',
    goal: 'Fat Loss & Conditioning',
    daysPerWeek: 4,
    targetCalories: 1980,
    targetProtein: 175,
    targetCarbs: 165,
    targetFat: 55,
    completedWorkoutsCount: 2,
    totalWorkoutsCount: 4,
    remainingWorkoutsCount: 2,
    completionPercentage: 50,
    splitDays: [
      {
        id: 'c2-mon',
        dayNumber: 1,
        dayName: 'Monday',
        dayShort: 'Mon',
        title: 'Full Body Density Circuit A',
        focus: 'Compound Strength & Intervals',
        type: 'training',
        status: 'completed',
        estimatedMinutes: 45,
        exercises: [
          { name: 'Trap Bar Deadlift', sets: 4, reps: '8', rest: '90s', completed: true },
          { name: 'Kettlebell Push Press', sets: 4, reps: '10', rest: '60s', completed: true },
          { name: 'Battle Ropes Intervals', sets: 5, reps: '30s on / 30s off', rest: '30s', completed: true },
        ],
      },
      {
        id: 'c2-tue',
        dayNumber: 2,
        dayName: 'Tuesday',
        dayShort: 'Tue',
        title: 'Zone 2 Cardio & Core Circuit',
        focus: 'Fat Oxidation & Core Bracing',
        type: 'training',
        status: 'completed',
        estimatedMinutes: 50,
        exercises: [
          { name: 'Incline Treadmill March', sets: 1, reps: '35 min', rest: '—', completed: true },
          { name: 'Hanging Knee Tucks', sets: 3, reps: '15', rest: '60s', completed: true },
          { name: 'Plank Hold with Reach', sets: 3, reps: '45s', rest: '45s', completed: true },
        ],
      },
      {
        id: 'c2-wed',
        dayNumber: 3,
        dayName: 'Wednesday',
        dayShort: 'Wed',
        title: 'Rest & Active Walk',
        focus: '10,000 Steps Baseline',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 30,
        exercises: [{ name: 'Outdoor Leisure Walk', sets: 1, reps: '40 min', rest: '—' }],
      },
      {
        id: 'c2-thu',
        dayNumber: 4,
        dayName: 'Thursday',
        dayShort: 'Thu',
        title: 'Full Body Density Circuit B',
        focus: 'Chest, Back & Legs Complex',
        type: 'training',
        status: 'remaining',
        estimatedMinutes: 45,
        exercises: [
          { name: 'Goblet Squats with Dumbbell', sets: 4, reps: '12', rest: '60s', completed: false },
          { name: 'Dumbbell Renegade Rows', sets: 4, reps: '10/side', rest: '60s', completed: false },
          { name: 'Assault Bike Sprints', sets: 6, reps: '20s max / 40s easy', rest: '40s', completed: false },
        ],
      },
      {
        id: 'c2-fri',
        dayNumber: 5,
        dayName: 'Friday',
        dayShort: 'Fri',
        title: 'Steady State Cardio & Mobility',
        focus: 'Rowing Machine & Flexibility',
        type: 'training',
        status: 'remaining',
        estimatedMinutes: 40,
        exercises: [
          { name: 'Concept2 Rower 5000m', sets: 1, reps: '24 min', rest: '—', completed: false },
          { name: 'Foam Rolling Hamstrings & ITB', sets: 1, reps: '15 min', rest: '—', completed: false },
        ],
      },
      {
        id: 'c2-sat',
        dayNumber: 6,
        dayName: 'Saturday',
        dayShort: 'Sat',
        title: 'Rest & Calorie Control',
        focus: 'Hydration & Mindful Eating',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 0,
        exercises: [{ name: 'Rest Day & Meal Prep', sets: 1, reps: '—', rest: '—' }],
      },
      {
        id: 'c2-sun',
        dayNumber: 7,
        dayName: 'Sunday',
        dayShort: 'Sun',
        title: 'Rest & Coach Review',
        focus: 'Check-in Logging',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 0,
        exercises: [{ name: 'Log Weight & Measurements', sets: 1, reps: '—', rest: '—' }],
      },
    ],
    meals: [
      {
        id: 'c2-m1',
        mealType: 'Breakfast',
        name: 'Spinach & Turkey Bacon Egg Omelet',
        calories: 420,
        protein: 44,
        carbs: 18,
        fat: 16,
        description: '2 whole eggs + 4 egg whites with lean turkey bacon strips and sliced baby tomatoes.',
        status: 'completed',
      },
      {
        id: 'c2-m2',
        mealType: 'Lunch',
        name: 'Crispy Air-Fried Chicken Bowl',
        calories: 580,
        protein: 56,
        carbs: 48,
        fat: 14,
        description: '220g skinless chicken strips air-fried, mixed green salad, 150g steamed jasmine rice with hot sauce.',
        status: 'completed',
      },
      {
        id: 'c2-m3',
        mealType: 'Dinner',
        name: 'Baked White Fish with Roasted Broccoli',
        calories: 460,
        protein: 48,
        carbs: 26,
        fat: 12,
        description: '220g cod or tilapia fillet baked with lemon, 250g garlic roasted broccoli florets with balsamic glaze.',
        status: 'remaining',
      },
      {
        id: 'c2-m4',
        mealType: 'Snack',
        name: 'Casein Protein & Mixed Berries Bowl',
        calories: 230,
        protein: 28,
        carbs: 22,
        fat: 3,
        description: '1 scoop slow-release micellar casein mixed thick with 100g frozen raspberries.',
        status: 'remaining',
      },
    ],
  },

  // Nadia Kareem - 5K race performance (4 done, 1 left)
  c3: {
    programTitle: '5K Race Pace & Athletic Endurance Split',
    level: 'Advanced',
    goal: '5K Race Performance',
    daysPerWeek: 5,
    targetCalories: 2300,
    targetProtein: 135,
    targetCarbs: 310,
    targetFat: 58,
    completedWorkoutsCount: 4,
    totalWorkoutsCount: 5,
    remainingWorkoutsCount: 1,
    completionPercentage: 80,
    splitDays: [
      {
        id: 'c3-mon',
        dayNumber: 1,
        dayName: 'Monday',
        dayShort: 'Mon',
        title: 'Track Intervals & Speed Economy',
        focus: '800m Repeats at 5K Pace',
        type: 'training',
        status: 'completed',
        estimatedMinutes: 50,
        exercises: [
          { name: '15m Dynamic Running Warmup', sets: 1, reps: '15m', rest: '—', completed: true },
          { name: '800m Track Repeats', sets: 5, reps: '3m 15s', rest: '2 min jog', completed: true },
          { name: 'Strides on Infield Grass', sets: 4, reps: '100m', rest: 'Walk back', completed: true },
        ],
      },
      {
        id: 'c3-tue',
        dayNumber: 2,
        dayName: 'Tuesday',
        dayShort: 'Tue',
        title: 'Single-Leg Strength & Core Stability',
        focus: 'Glute Medius & Ankle Stiffness',
        type: 'training',
        status: 'completed',
        estimatedMinutes: 40,
        exercises: [
          { name: 'Single-Leg Romanian Deadlift', sets: 3, reps: '8/leg', rest: '90s', completed: true },
          { name: 'Step-ups with Knee Drive', sets: 3, reps: '10/leg', rest: '60s', completed: true },
          { name: 'Side Plank with Leg Lift', sets: 3, reps: '30s/side', rest: '45s', completed: true },
        ],
      },
      {
        id: 'c3-wed',
        dayNumber: 3,
        dayName: 'Wednesday',
        dayShort: 'Wed',
        title: 'Mid-Week Aerobic Threshold Run',
        focus: '7km Zone 2 Recovery Pace',
        type: 'training',
        status: 'completed',
        estimatedMinutes: 45,
        exercises: [{ name: '7km Continuous Aerobic Run', sets: 1, reps: 'Pace: 5:30/km', rest: '—', completed: true }],
      },
      {
        id: 'c3-thu',
        dayNumber: 4,
        dayName: 'Thursday',
        dayShort: 'Thu',
        title: 'Tempo Threshold Intervals',
        focus: 'Lactate Clearing Capacity',
        type: 'training',
        status: 'completed',
        estimatedMinutes: 45,
        exercises: [
          { name: '2km Warmup Run', sets: 1, reps: 'Warmup', rest: '—', completed: true },
          { name: '3x 1.5km at 10K Pace', sets: 3, reps: '6m 20s', rest: '90s rest', completed: true },
        ],
      },
      {
        id: 'c3-fri',
        dayNumber: 5,
        dayName: 'Friday',
        dayShort: 'Fri',
        title: 'Pre-Race Shakeout & Strides',
        focus: 'Neuromuscular Priming',
        type: 'training',
        status: 'remaining',
        estimatedMinutes: 25,
        exercises: [
          { name: 'Easy 3km Shakeout Jog', sets: 1, reps: 'Easy jog', rest: '—', completed: false },
          { name: 'Accelerations (Strides)', sets: 4, reps: '80m at 90%', rest: 'Full rest', completed: false },
        ],
      },
      {
        id: 'c3-sat',
        dayNumber: 6,
        dayName: 'Saturday',
        dayShort: 'Sat',
        title: 'Saturday Race Simulation / Time Trial',
        focus: 'Peak Effort',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 0,
        exercises: [{ name: 'Race Event or Rest', sets: 1, reps: 'Event', rest: '—' }],
      },
      {
        id: 'c3-sun',
        dayNumber: 7,
        dayName: 'Sunday',
        dayShort: 'Sun',
        title: 'Deep Recovery & Joint Restoration',
        focus: 'Epsom Salt Bath & Stretching',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 0,
        exercises: [{ name: 'Foam Roll Calves & Plantar Fascia', sets: 1, reps: '20 min', rest: '—' }],
      },
    ],
    meals: [
      {
        id: 'c3-m1',
        mealType: 'Breakfast',
        name: 'Overnight Steel-Cut Oats with Berries & Honey',
        calories: 550,
        protein: 28,
        carbs: 88,
        fat: 10,
        description: '80g oats soaked in almond milk, 1 scoop plant protein, 1 sliced banana, and 2 tsp chia seeds.',
        status: 'completed',
      },
      {
        id: 'c3-m2',
        mealType: 'Lunch',
        name: 'Whole Wheat Pasta with Lean Beef Bolognese',
        calories: 720,
        protein: 46,
        carbs: 94,
        fat: 16,
        description: '140g dry whole wheat penne, 160g 95% lean beef mince in rich tomato basil marinara sauce.',
        status: 'completed',
      },
      {
        id: 'c3-m3',
        mealType: 'Dinner',
        name: 'Honey-Glazed Salmon & Jasmine Rice',
        calories: 610,
        protein: 42,
        carbs: 70,
        fat: 18,
        description: '170g grilled salmon fillet, 1.5 cups jasmine rice, steamed sugar snap peas with sesame.',
        status: 'completed',
      },
      {
        id: 'c3-m4',
        mealType: 'Snack',
        name: 'Pre-Run Energy Dates & Peanut Butter',
        calories: 320,
        protein: 10,
        carbs: 52,
        fat: 10,
        description: '3 Medjool dates stuffed with 20g natural peanut butter and a pinch of Celtic sea salt.',
        status: 'remaining',
      },
    ],
  },

  // Adam Nabil - Mobility & spinal recovery (1 done, 2 left)
  c4: {
    programTitle: 'Spine Decompression & Functional Mobility',
    level: 'Beginner',
    goal: 'Spine & Hip Recovery',
    daysPerWeek: 3,
    targetCalories: 2100,
    targetProtein: 150,
    targetCarbs: 210,
    targetFat: 68,
    completedWorkoutsCount: 1,
    totalWorkoutsCount: 3,
    remainingWorkoutsCount: 2,
    completionPercentage: 33,
    splitDays: [
      {
        id: 'c4-mon',
        dayNumber: 1,
        dayName: 'Monday',
        dayShort: 'Mon',
        title: 'Spinal Decompression & Glute Activation',
        focus: 'Anti-Extension & Pelvic Control',
        type: 'training',
        status: 'completed',
        estimatedMinutes: 40,
        exercises: [
          { name: 'McGill Big 3 (Bird-Dog, Curl-up, Side Plank)', sets: 3, reps: '8 reps with 8s holds', rest: '60s', completed: true },
          { name: 'Glute Bridges on Bench', sets: 4, reps: '12', rest: '60s', completed: true },
          { name: 'Dead Hangs from Pull-up Bar', sets: 4, reps: '30s', rest: '60s', completed: true },
        ],
      },
      {
        id: 'c4-tue',
        dayNumber: 2,
        dayName: 'Tuesday',
        dayShort: 'Tue',
        title: 'Rest & Gentle Walking',
        focus: 'Low Impact Movement',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 20,
        exercises: [{ name: 'Casual 30m Walk', sets: 1, reps: '30m', rest: '—' }],
      },
      {
        id: 'c4-wed',
        dayNumber: 3,
        dayName: 'Wednesday',
        dayShort: 'Wed',
        title: 'Hip Openers & Quadratus Lumborum Flow',
        focus: 'Hip Rotations & Hamstring Length',
        type: 'training',
        status: 'remaining',
        estimatedMinutes: 35,
        exercises: [
          { name: 'Half-Kneeling Hip Flexor Stretch with Reach', sets: 3, reps: '45s/side', rest: '30s', completed: false },
          { name: 'Single-Leg Cable Pull-Throughs', sets: 3, reps: '12', rest: '60s', completed: false },
          { name: 'Farmer Carry with Light Dumbbells', sets: 4, reps: '30m', rest: '60s', completed: false },
        ],
      },
      {
        id: 'c4-thu',
        dayNumber: 4,
        dayName: 'Thursday',
        dayShort: 'Thu',
        title: 'Rest & Lumbar Neutral Posture',
        focus: 'Postural Reset',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 0,
        exercises: [{ name: 'Prone Cobra on Floor', sets: 3, reps: '30s hold', rest: '30s' }],
      },
      {
        id: 'c4-fri',
        dayNumber: 5,
        dayName: 'Friday',
        dayShort: 'Fri',
        title: 'Posterior Activation & Upper Back Tension',
        focus: 'Trap 3, Rhomboids & Hamstring Safety',
        type: 'training',
        status: 'remaining',
        estimatedMinutes: 35,
        exercises: [
          { name: 'Chest-Supported Incline Y-Raises', sets: 3, reps: '12', rest: '60s', completed: false },
          { name: 'Romanian Deadlift with Light Dumbbells (Tempo 3-1-1)', sets: 3, reps: '10', rest: '90s', completed: false },
          { name: 'Suitcase Carry', sets: 3, reps: '25m/side', rest: '60s', completed: false },
        ],
      },
      {
        id: 'c4-sat',
        dayNumber: 6,
        dayName: 'Saturday',
        dayShort: 'Sat',
        title: 'Thermal Therapy & Rest',
        focus: 'Heat Pad & Soft Tissue',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 0,
        exercises: [{ name: 'Contrast Shower & Foam Rolling', sets: 1, reps: '15m', rest: '—' }],
      },
      {
        id: 'c4-sun',
        dayNumber: 7,
        dayName: 'Sunday',
        dayShort: 'Sun',
        title: 'Weekly Recovery Check-in',
        focus: 'Soreness Level Logging',
        type: 'rest',
        status: 'rest',
        estimatedMinutes: 0,
        exercises: [{ name: 'Check-in with Coach', sets: 1, reps: '—', rest: '—' }],
      },
    ],
    meals: [
      {
        id: 'c4-m1',
        mealType: 'Breakfast',
        name: 'Avocado & Soft-Boiled Eggs on Seed Bread',
        calories: 460,
        protein: 30,
        carbs: 38,
        fat: 22,
        description: '3 organic eggs soft-boiled, 1/2 mashed avocado on sprouted seed bread with turmeric olive oil.',
        status: 'completed',
      },
      {
        id: 'c4-m2',
        mealType: 'Lunch',
        name: 'Lemon Herb Grilled Chicken with Roasted Veggies',
        calories: 610,
        protein: 50,
        carbs: 52,
        fat: 18,
        description: '190g chicken breast marinated in oregano and garlic, roasted sweet potatoes, and steamed green beans.',
        status: 'remaining',
      },
      {
        id: 'c4-m3',
        mealType: 'Dinner',
        name: 'Grass-Fed Beef Patty with Large Garden Salad',
        calories: 580,
        protein: 44,
        carbs: 34,
        fat: 24,
        description: '180g lean beef burger patty, baby spinach, cherry tomatoes, cucumbers, walnuts, and extra virgin olive oil.',
        status: 'remaining',
      },
      {
        id: 'c4-m4',
        mealType: 'Snack',
        name: 'Collagen Peptide & Blueberry Smoothie',
        calories: 250,
        protein: 24,
        carbs: 28,
        fat: 4,
        description: '20g hydrolyzed collagen peptides blended with 120g wild blueberries, almond milk, and ground flaxseed.',
        status: 'remaining',
      },
    ],
  },
}

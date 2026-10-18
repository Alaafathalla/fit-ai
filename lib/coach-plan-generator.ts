export interface CustomExercise {
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
}

export interface CustomWorkoutDay {
  dayNumber: number
  title: string
  focus: string
  estimatedMinutes: number
  exercises: CustomExercise[]
}

export interface CustomMealItem {
  mealType: string
  name: string
  calories: number
  protein: number
  description: string
}

export interface CustomFitnessPlan {
  id: string
  title: string
  description: string
  goal: string
  level: string
  daysPerWeek: number
  createdAt: string
  workoutPlan: {
    days: CustomWorkoutDay[]
  }
  nutritionPlan: {
    dailyCalories: number
    macros: {
      proteinGrams: number
      carbsGrams: number
      fatGrams: number
    }
    guidelines: string[]
    suggestedMeals: CustomMealItem[]
  }
}

export function generateCustomFitnessPlan(input: {
  athleteName?: string
  goal?: string
  currentWeight?: number
  targetWeight?: number
  daysPerWeek?: number
  level?: string
}): CustomFitnessPlan {
  const weight = input.currentWeight && input.currentWeight > 0 ? input.currentWeight : 78.4
  const targetWeight = input.targetWeight && input.targetWeight > 0 ? input.targetWeight : 75.0
  const isLoss = targetWeight < weight
  const isGain = targetWeight > weight
  const days = Math.max(3, Math.min(6, input.daysPerWeek || 4))
  const level = input.level || 'Intermediate'
  const goalStr = input.goal?.trim() || (isLoss ? 'Fat Loss & Muscle Retention' : isGain ? 'Hypertrophy & Lean Bulk' : 'Athletic Body Recomposition')

  let targetCalories = Math.round(weight * 30)
  if (isLoss) targetCalories = Math.round(weight * 26)
  else if (isGain) targetCalories = Math.round(weight * 34)

  const proteinGrams = Math.round(weight * 2.0)
  const fatGrams = Math.round((targetCalories * 0.25) / 9)
  const carbsGrams = Math.max(90, Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4))

  const workoutDays: CustomWorkoutDay[] = []

  if (days === 3) {
    workoutDays.push(
      {
        dayNumber: 1,
        title: 'Day 1: Full Body Strength & Power',
        focus: 'Chest, Quads, Upper Back',
        estimatedMinutes: 45,
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '6-8', rest: '2-3 min', notes: 'Core braced, drive through midfoot' },
          { name: 'Flat Dumbbell Bench Press', sets: 4, reps: '8-10', rest: '90s', notes: 'Full scapular depression' },
          { name: 'Chest-Supported Row', sets: 3, reps: '10-12', rest: '90s', notes: 'Squeeze rhomboids at peak contraction' },
          { name: 'Romanian Deadlift (RDL)', sets: 3, reps: '8-10', rest: '2 min', notes: 'Hamstrings loaded, neutral spine' },
          { name: 'Plank with Shoulder Taps', sets: 3, reps: '45s', rest: '60s', notes: 'Resist hip rotation' },
        ],
      },
      {
        dayNumber: 2,
        title: 'Day 2: Full Body Hypertrophy & Stability',
        focus: 'Hamstrings, Shoulders, Lats',
        estimatedMinutes: 45,
        exercises: [
          { name: 'Overhead Barbell Press', sets: 4, reps: '6-8', rest: '2 min', notes: 'Strict press from collarbones' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10/leg', rest: '90s', notes: 'Unilateral quad and glute focus' },
          { name: 'Neutral-Grip Lat Pulldown', sets: 4, reps: '8-10', rest: '90s', notes: 'Pull with elbows down' },
          { name: 'Dumbbell Lateral Raises', sets: 4, reps: '12-15', rest: '60s', notes: 'Slight forward torso lean' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', rest: '60s', notes: 'Posterior pelvic tilt' },
        ],
      },
      {
        dayNumber: 3,
        title: 'Day 3: Full Body Density & Conditioning',
        focus: 'Back, Chest, Glutes, Arms',
        estimatedMinutes: 40,
        exercises: [
          { name: 'Trap Bar Deadlift', sets: 3, reps: '5', rest: '3 min', notes: 'Primary hip hinge power' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '90s', notes: 'Clavicular head emphasis' },
          { name: 'Seated Cable Row', sets: 3, reps: '12', rest: '60s', notes: 'Full lat stretch at bottom' },
          { name: 'Bicep Curls & Tricep Pushdowns', sets: 3, reps: '12-15', rest: '60s', notes: 'Superset for arm endurance' },
        ],
      }
    )
  } else {
    workoutDays.push(
      {
        dayNumber: 1,
        title: 'Day 1: Upper Body Power & Push',
        focus: 'Chest, Delts, Triceps',
        estimatedMinutes: 45,
        exercises: [
          { name: 'Flat Barbell Bench Press', sets: 4, reps: '6-8', rest: '2-3 min', notes: 'Primary push strength' },
          { name: 'Incline Dumbbell Press (30°)', sets: 3, reps: '8-10', rest: '90s', notes: 'Upper chest hypertrophy' },
          { name: 'Barbell Bent-Over Row', sets: 4, reps: '8', rest: '2 min', notes: 'Strict horizontal pull' },
          { name: 'Cable Lateral Raise', sets: 4, reps: '12-15', rest: '60s', notes: 'Constant tension on side delts' },
          { name: 'Overhead Cable Tricep Extension', sets: 3, reps: '12', rest: '60s', notes: 'Full long-head stretch' },
        ],
      },
      {
        dayNumber: 2,
        title: 'Day 2: Lower Body Quad & Core Dominant',
        focus: 'Quads, Calves, Abs',
        estimatedMinutes: 50,
        exercises: [
          { name: 'Back Squat or Hack Squat', sets: 4, reps: '6-8', rest: '2-3 min', notes: 'Depth below parallel' },
          { name: 'Walking Dumbbell Lunges', sets: 3, reps: '12 steps/leg', rest: '90s', notes: 'Maintain upright posture' },
          { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '60s', notes: '2-second isometric peak squeeze' },
          { name: 'Standing Calf Raise', sets: 4, reps: '15', rest: '60s', notes: 'Full ankle dorsiflexion' },
          { name: 'Ab Wheel Rollouts', sets: 3, reps: '10-12', rest: '60s', notes: 'Controlled eccentric extension' },
        ],
      },
      {
        dayNumber: 3,
        title: 'Day 3: Upper Body Hypertrophy & Pull',
        focus: 'Lats, Rhomboids, Biceps, Rear Delts',
        estimatedMinutes: 45,
        exercises: [
          { name: 'Weighted Pull-ups or Lat Pulldown', sets: 4, reps: '8-10', rest: '2 min', notes: 'Full stretch at peak elevation' },
          { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '10/side', rest: '90s', notes: 'Full lat contraction' },
          { name: 'Low-to-High Cable Chest Fly', sets: 3, reps: '12-15', rest: '60s', notes: 'Squeeze inner chest fibers' },
          { name: 'Face Pulls with External Rotation', sets: 4, reps: '15', rest: '60s', notes: 'Scapular health & posture' },
          { name: 'Incline Dumbbell Bicep Curls', sets: 3, reps: '10-12', rest: '60s', notes: 'Long head bicep stretch' },
        ],
      },
      {
        dayNumber: 4,
        title: 'Day 4: Lower Body Posterior Chain & Conditioning',
        focus: 'Hamstrings, Glutes, Low Back',
        estimatedMinutes: 45,
        exercises: [
          { name: 'Romanian Deadlift (RDL)', sets: 4, reps: '8-10', rest: '2 min', notes: 'Hinge back with slight knee bend' },
          { name: 'Hip Thrust with Barbell', sets: 3, reps: '10-12', rest: '90s', notes: 'Full lockout at the top' },
          { name: 'Lying Leg Curls', sets: 3, reps: '12', rest: '60s', notes: 'Controlled 3-second negative' },
          { name: 'Farmer Walks with Heavy Dumbbells', sets: 4, reps: '40 meters', rest: '90s', notes: 'Core, grip & traps' },
        ],
      }
    )
  }

  return {
    id: `plan-${Date.now()}`,
    title: `${goalStr} Protocol (${days}-Day Split)`,
    description: `A customized athletic program precision-engineered for ${input.athleteName || 'Athlete'} targeting ${goalStr} at ${level} level.`,
    goal: goalStr,
    level,
    daysPerWeek: days,
    createdAt: new Date().toISOString(),
    workoutPlan: { days: workoutDays },
    nutritionPlan: {
      dailyCalories: targetCalories,
      macros: {
        proteinGrams,
        carbsGrams,
        fatGrams,
      },
      guidelines: [
        `Consume ~${proteinGrams}g protein daily evenly spaced across 3–4 meals (~35–45g/meal).`,
        `Daily caloric target: ${targetCalories} kcal (${isLoss ? 'moderate deficit for fat loss' : isGain ? 'lean surplus for hypertrophy' : 'energy balance'}).`,
        'Pre-workout nutrition: 30-40g complex carbs + 25g protein 90 minutes before lifting.',
        'Post-workout nutrition: 30g fast-digesting protein + 40-50g carbs within 45 minutes.',
        'Hydration baseline: Minimum 2.8 to 3.2 liters of water daily.',
      ],
      suggestedMeals: [
        { mealType: 'Breakfast', name: 'High-Protein Oat & Egg Bowl', calories: 480, protein: 38, description: '3 whole eggs + 2 egg whites with 60g rolled oats, cinnamon, and berries.' },
        { mealType: 'Lunch', name: 'Grilled Chicken & Sweet Potato Medley', calories: 620, protein: 52, description: '180g skinless chicken breast, 200g baked sweet potato, steamed broccoli with olive oil.' },
        { mealType: 'Dinner', name: 'Wild Salmon & Quinoa Super Bowl', calories: 580, protein: 44, description: '160g wild salmon fillet with 1 cup cooked quinoa and mixed dark leafy greens.' },
        { mealType: 'Snack', name: 'Greek Yogurt & Almond Crunch', calories: 280, protein: 26, description: '200g 0% Greek yogurt with 1 scoop whey, 15g raw almonds, and raw honey drizzle.' },
      ],
    },
  }
}

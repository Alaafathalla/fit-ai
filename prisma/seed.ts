import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── User ────────────────────────────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where: { email: 'mahmoud@fitai.app' },
    update: {},
    create: {
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
      calorieGoal: 2000,
    },
  })
  console.log(`✓ User: ${user.name}`)

  // ── Workouts ─────────────────────────────────────────────────────────────────
  const workoutsData = [
    {
      id: 'w1',
      title: 'Full Body Strength',
      type: 'Strength' as const,
      duration: 42,
      level: 'Intermediate' as const,
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
      type: 'HIIT' as const,
      duration: 28,
      level: 'Advanced' as const,
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
      type: 'Mobility' as const,
      duration: 18,
      level: 'Beginner' as const,
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
      type: 'Strength' as const,
      duration: 38,
      level: 'Advanced' as const,
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
      type: 'Strength' as const,
      duration: 22,
      level: 'Intermediate' as const,
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
      type: 'Cardio' as const,
      duration: 30,
      level: 'Beginner' as const,
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

  for (const w of workoutsData) {
    await prisma.workout.upsert({ where: { id: w.id }, update: w, create: w })
  }
  console.log(`✓ Workouts: ${workoutsData.length}`)

  // ── Meals ────────────────────────────────────────────────────────────────────
  const mealsData = [
    {
      id: 'm1',
      name: 'Green Power Bowl',
      mealType: 'Breakfast' as const,
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
      mealType: 'Lunch' as const,
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
      mealType: 'Dinner' as const,
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
      mealType: 'Snack' as const,
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
      mealType: 'Breakfast' as const,
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
      mealType: 'Dinner' as const,
      calories: 580,
      protein: 46,
      carbs: 44,
      fat: 14,
      prepTime: 25,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=640&q=80',
      tags: ['Lean Protein', 'Veggie-Rich'],
    },
  ]

  for (const m of mealsData) {
    await prisma.meal.upsert({ where: { id: m.id }, update: m, create: m })
  }
  console.log(`✓ Meals: ${mealsData.length}`)

  // ── Daily Stats ───────────────────────────────────────────────────────────────
  // Keep demo data relative to the seed date so dashboards always have a real "today".
  const dailyTemplates = [
    { weight: 80.2, calories: 1920, workoutMinutes: 45, steps: 8200,  hydration: 2100, sleepHours: 7.2 },
    { weight: 80.0, calories: 1840, workoutMinutes: 0,  steps: 5400,  hydration: 1800, sleepHours: 6.8 },
    { weight: 79.7, calories: 2050, workoutMinutes: 52, steps: 9100,  hydration: 2400, sleepHours: 7.5 },
    { weight: 79.5, calories: 1760, workoutMinutes: 38, steps: 7800,  hydration: 2000, sleepHours: 8.0 },
    { weight: 79.2, calories: 1990, workoutMinutes: 60, steps: 11200, hydration: 2600, sleepHours: 7.0 },
    { weight: 78.8, calories: 1680, workoutMinutes: 42, steps: 6200,  hydration: 2300, sleepHours: 7.8 },
    { weight: 78.4, calories: 1250, workoutMinutes: 0,  steps: 3100,  hydration: 1100, sleepHours: 7.5 },
  ]

  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)
  startDate.setDate(startDate.getDate() - (dailyTemplates.length - 1))

  const statsData = dailyTemplates.map((template, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    return { ...template, date }
  })

  for (const stat of statsData) {
    await prisma.dailyStats.upsert({
      where: { userId_date: { userId: user.id, date: stat.date } },
      update: { ...stat, calorieGoal: 2000 },
      create: { userId: user.id, ...stat, calorieGoal: 2000 },
    })
  }
  console.log(`✓ Daily stats: ${statsData.length} days`)

  // ── Recent activity ───────────────────────────────────────────────────────────
  // Re-create demo activity so the Activity page is useful immediately after seed.
  await prisma.workoutSession.deleteMany({ where: { userId: user.id } })
  await prisma.mealLog.deleteMany({ where: { userId: user.id } })

  const atTime = (daysAgo: number, hour: number) => {
    const date = new Date()
    date.setHours(hour, 0, 0, 0)
    date.setDate(date.getDate() - daysAgo)
    return date
  }

  for (const [workoutId, daysAgo, duration] of [
    ['w1', 1, 42],
    ['w3', 2, 18],
    ['w4', 3, 38],
    ['w2', 5, 28],
  ] as const) {
    await prisma.workoutSession.create({
      data: { userId: user.id, workoutId, duration, completedAt: atTime(daysAgo, 18) },
    })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (const [mealId, hour] of [['m1', 8], ['m2', 13], ['m4', 17]] as const) {
    await prisma.mealLog.create({
      data: { userId: user.id, mealId, date: today, loggedAt: atTime(0, hour) },
    })
  }

  for (const [mealId, daysAgo, hour] of [
    ['m5', 1, 8],
    ['m6', 1, 19],
    ['m1', 2, 8],
  ] as const) {
    const date = atTime(daysAgo, 0)
    date.setHours(0, 0, 0, 0)
    await prisma.mealLog.create({
      data: { userId: user.id, mealId, date, loggedAt: atTime(daysAgo, hour) },
    })
  }
  console.log('✓ Recent activity seeded')

  console.log('✅ Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

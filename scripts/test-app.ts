import { generateCustomFitnessPlan } from '../lib/coach-ai'
import {
  getCoachClients,
  getCustomFitnessPlan,
  getDailyStats,
  getProgressMetrics,
  getWeeklyProgress,
  updateCoachClient,
} from '../lib/fake-api'

async function runTests() {
  console.log('--- [FitAI System Verification & Automated Test Suite] ---')
  let passed = 0
  let failed = 0

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`✅ PASS: ${msg}`)
      passed++
    } else {
      console.error(`❌ FAIL: ${msg}`)
      failed++
    }
  }

  // 1. Test AI Coach Custom Plan Generation
  console.log('\n[Phase 03: AI Coach Custom Plan Generation]')
  const fatLossPlan = generateCustomFitnessPlan({
    athleteName: 'Tariq',
    goal: 'Fat Loss & HIIT',
    currentWeight: 88,
    targetWeight: 80,
    level: 'Intermediate',
    daysPerWeek: 4,
  })
  assert(fatLossPlan.workoutPlan.days.length >= 4, `Generates workout days (${fatLossPlan.workoutPlan.days.length} days)`)
  assert(fatLossPlan.nutritionPlan.dailyCalories > 0, `Generates calorie target (${fatLossPlan.nutritionPlan.dailyCalories} kcal)`)
  assert(fatLossPlan.nutritionPlan.macros.proteinGrams > 0, `Generates protein target (${fatLossPlan.nutritionPlan.macros.proteinGrams}g)`)
  assert(fatLossPlan.nutritionPlan.suggestedMeals.length > 0, 'Includes suggested meals blueprint')

  // Equal starting weight to test deficit vs surplus logic
  const cutPlan = generateCustomFitnessPlan({
    athleteName: 'Tariq',
    goal: 'Fat Loss & Deficit',
    currentWeight: 80,
    targetWeight: 75,
    level: 'Intermediate',
    daysPerWeek: 4,
  })
  const bulkPlan = generateCustomFitnessPlan({
    athleteName: 'Sara',
    goal: 'Muscle Hypertrophy & Bulk',
    currentWeight: 80,
    targetWeight: 85,
    level: 'Intermediate',
    daysPerWeek: 4,
  })
  assert(
    bulkPlan.nutritionPlan.dailyCalories > cutPlan.nutritionPlan.dailyCalories,
    `Hypertrophy target calories (${bulkPlan.nutritionPlan.dailyCalories} kcal) higher than deficit (${cutPlan.nutritionPlan.dailyCalories} kcal)`
  )

  // 2. Test Progress & Period Filtering (7d, 30d, 90d, 180d)
  console.log('\n[Phase 04: Dashboard & Progress Real Stats / Period Filters]')
  const stats7 = await getDailyStats(7)
  assert(stats7.length === 7, `getDailyStats(7) returns 7 days of telemetry (received ${stats7.length})`)

  const stats30 = await getDailyStats(30)
  assert(stats30.length === 30, `getDailyStats(30) returns 30 days of telemetry (received ${stats30.length})`)

  const stats90 = await getDailyStats(90)
  assert(stats90.length === 90, `getDailyStats(90) returns 90 days of telemetry (received ${stats90.length})`)

  const prog7 = await getWeeklyProgress(7)
  const prog30 = await getWeeklyProgress(30)
  assert(prog7.length === 7, `getWeeklyProgress(7) returns 7 days of breakdown`)
  assert(prog30.length === 30, `getWeeklyProgress(30) returns 30 days of breakdown`)

  const metrics = await getProgressMetrics(30)
  assert(metrics.length >= 4, `getProgressMetrics returns comprehensive telemetry cards (${metrics.length})`)

  // 3. Test Coach Portal Client Management
  console.log('\n[Phase 05: Coach Portal Management & Client Tracking]')
  const clients = await getCoachClients()
  assert(clients.length >= 4, `getCoachClients retrieves active roster (${clients.length} clients)`)

  const firstClient = clients[0]
  const updateRes = await updateCoachClient({
    athleteId: firstClient.id,
    notes: 'Auto-tested: Coach prescribed 400m repeat intervals and increased hydration.',
    status: 'Review',
  })
  assert(updateRes.ok === true, 'updateCoachClient returns ok: true')
  assert(updateRes.client?.status === 'Review', 'updateCoachClient updates status to Review')
  assert(updateRes.client?.notes?.includes('Auto-tested') === true, 'updateCoachClient persists coach notes')

  // Check reload persistence
  const reloadedClients = await getCoachClients()
  const reloadedFirst = reloadedClients.find((c) => c.id === firstClient.id)
  assert(reloadedFirst?.status === 'Review', 'Reloaded client reflects saved status')
  assert(reloadedFirst?.notes?.includes('Auto-tested') === true, 'Reloaded client retains notes')

  console.log(`\n========================================`)
  console.log(`Results: ${passed} Passed, ${failed} Failed`)
  console.log(`========================================`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err)
  process.exit(1)
})

import type { CoachContext } from './coach-ai'

/**
 * High-IQ Local Athletic Intelligence Engine
 */
export function buildExpertLocalReply(query: string, ctx: CoachContext): string {
  const q = query.toLowerCase()
  const weight = ctx.currentWeight || 75
  const proteinGramRange = `${Math.round(weight * 1.8)}–${Math.round(weight * 2.2)}g`
  const name = ctx.athleteName ? ` ${ctx.athleteName}` : ''
  const goalStr = ctx.goal || 'General Athletic Performance'

  // 1. Greetings & Introductions
  if (/^(hi|hello|hey|yo|morning|evening|greetings|howdy|sup)\b/.test(q)) {
    return `Hey${name}! I'm your **FitAI Training Advisor**.

Here is your current status:
• **Primary Goal:** ${goalStr}
• **Caloric Target:** ${ctx.calorieGoal.toLocaleString()} kcal/day
• **Daily Protein Benchmark:** ~${proteinGramRange}/day
• **Recent Recovery Telemetry:** ${ctx.sleepHours ? `${ctx.sleepHours} hrs sleep` : 'Log sleep for recovery score'}

What are we dialing in today?
1. **Workout Program:** Design a custom PPL, Upper/Lower, or HIIT routine
2. **Nutrition & Macros:** Calculate your cutting/bulking numbers or pre-workout meals
3. **Recovery & Form:** Fix exercise plateaus or mobility issues`
  }

  // 2. Injury, Joint Pain, Soreness
  if (q.includes('knee') || q.includes('pain') || q.includes('hurt') || q.includes('injury') || q.includes('sore') || q.includes('soreness') || q.includes('tendon')) {
    return `### Injury Screen & Mobility Check
*Note: Consult a licensed medical specialist for persistent sharp pain.*

**Joint Pain vs Muscle Soreness (DOMS):**
• **DOMS (Dull ache in muscle belly 24–48h post-lift):** Normal cellular remodeling. Light walking and hydration accelerate recovery.
• **Sharp Joint / Tendon Pain:** Back off immediately. Never load through sharp joint pain.

**Biomechanical Adjustments:**
1. **Knee Discomfort during Squats:**
   • Warm up ankles and hip flexors before loading.
   • Warm up on leg extensions with light weight (20+ reps) to circulate synovial fluid in the patella.
   • Ensure knees track outward over your middle toes rather than caving inward.
2. **Shoulder Pinching on Presses:**
   • Engage rotator cuffs with Face Pulls and Band Pull-Aparts before pressing.
   • Tuck elbows to 45°–60° instead of flaring at 90°.`
  }

  // 3. Sleep, Recovery & Deload
  if (q.includes('sleep') || q.includes('recover') || q.includes('rest') || q.includes('tired') || q.includes('fatigue') || q.includes('deload')) {
    const sleepNote = ctx.sleepHours
      ? `Your latest recorded sleep is **${ctx.sleepHours} hours**.`
      : 'Log your sleep in the Recovery dashboard for automated readiness scoring.'

    return `### Recovery & Bio-Readiness Protocol
${sleepNote}

**Evidence-Based Sleep Maximizers:**
1. **Sleep Window:** Target **7.5 to 8.5 hours** nightly. Growth Hormone (GH) release and protein synthesis peak during deep slow-wave sleep.
2. **Temperature:** Keep the room cool (~18–19°C / 65–67°F) to trigger core temperature reduction.
3. **Caffeine Curfew:** Cease caffeine intake at least 8 hours prior to bedtime.
4. **Deload Indicator:** If grip strength feels weak or training weights feel heavy for 3+ consecutive sessions, run a **Deload Week** (reduce working sets by 50% while maintaining moderate intensity).`
  }

  // 4. Water & Hydration
  if (q.includes('water') || q.includes('hydrat') || q.includes('drink')) {
    const hydrNote = ctx.hydration
      ? `Your latest entry is **${ctx.hydration.toLocaleString()} ml**.`
      : 'Aim for a consistent daily baseline.'

    return `### Athletic Hydration Benchmark
${hydrNote}

• **Daily Baseline:** **2,500 – 3,500 ml** per day.
• **Training Addition:** Add **500–750 ml** for every 45–60 minutes of high-intensity training.
• **Performance Impact:** A mere 2% drop in hydration can reduce muscular power output by up to **15%**.
• **Pro Tip:** Drink 500ml of water with a pinch of electrolyte salt within 15 minutes of waking.`
  }

  // 5. Creatine & Supplements
  if (q.includes('creatine') || q.includes('supplement') || q.includes('whey') || q.includes('caffeine') || q.includes('ashwagandha')) {
    return `### Evidence-Based Supplement Protocol

1. **Creatine Monohydrate (Gold Standard):**
   • **Dosage:** 5g daily (take with carbs or protein; timing is flexible).
   • **Mechanism:** Saturates intramuscular phosphocreatine to accelerate ATP regeneration, boosting power output by 5–15%. No loading phase is required.

2. **Whey Protein Isolate:**
   • Rapid digestion and high leucine content (3g+ per scoop). Use to ensure you hit your **${proteinGramRange}** daily protein mark.

3. **Caffeine Anhydrous:**
   • 3–5 mg/kg taken 45 minutes pre-workout. Increases motor unit recruitment and reduces rate of perceived exertion (RPE). Stop taking 8 hours before bed.

4. **Electrolytes & Sodium:**
   • 300–500mg sodium in your pre-workout fluid enhances intracellular water retention and muscle contraction efficiency.`
  }

  // 6. Pre & Post Workout Nutrition
  if (q.includes('pre workout') || q.includes('pre-workout') || q.includes('post workout') || q.includes('post-workout') || q.includes('eat before') || q.includes('eat after')) {
    return `### Peri-Workout Nutrition Protocol

**Pre-Workout (60–90 minutes prior):**
• **Goal:** Maximize liver and muscle glycogen without digestive distress.
• **Formula:** High easily-digestible carbs + moderate lean protein + low fat/fiber.
• **Option A:** 50g Cream of rice/oats + 1 scoop whey + sliced banana.
• **Option B:** 2 slices sourdough toast with honey + 3 boiled eggs.
• **Hydration:** 400–500ml water with pinch of pink salt.

**Post-Workout (within 2 hours):**
• **Goal:** Stimulate Muscle Protein Synthesis (MPS) and replenish glycogen.
• **Formula:** 35–45g high-quality protein + 50–75g complex carbohydrates.
• **Option:** Grilled chicken breast with jasmine rice and steamed greens, or a whey shake with oats and berries.`
  }

  // 7. Protein & Macros Calculation
  if (q.includes('protein') || q.includes('macro') || q.includes('grams') || q.includes('tdee') || q.includes('calorie target')) {
    const targetProtein = Math.round(weight * 2.0)
    const targetFat = Math.round(weight * 0.9)
    const carbCals = Math.max(400, ctx.calorieGoal - (targetProtein * 4 + targetFat * 9))
    const targetCarbs = Math.round(carbCals / 4)

    return `Here is your customized **Macro Distribution** for **${weight} kg**:

• **Total Calories:** **${ctx.calorieGoal.toLocaleString()} kcal**
• **Protein:** **${targetProtein}g** (approx. ${targetProtein * 4} kcal | 2.0g/kg)
• **Carbohydrates:** **${targetCarbs}g** (approx. ${targetCarbs * 4} kcal | training energy)
• **Fats:** **${targetFat}g** (approx. ${targetFat * 9} kcal | hormone & cell health)

**Top Tier Protein Sources:**
• 200g Chicken breast = ~62g protein
• 200g 0% Greek yogurt = ~20g protein
• 1 Scoop Whey isolate = ~25g protein
• 3 Whole eggs + 3 egg whites = ~30g protein
• 1 Can of Tuna = ~32g protein`
  }

  // 8. Fat Loss & Cutting
  if (q.includes('fat loss') || q.includes('lose fat') || q.includes('cut') || q.includes('cutting') || q.includes('deficit') || q.includes('lose weight')) {
    const deficitCalories = Math.max(1500, ctx.calorieGoal - 400)
    return `Here is your blueprint for **Fat Loss while preserving lean muscle**:

1. **Target Caloric Intake:**
   • Maintain a steady **300–400 kcal deficit**. Aim for around **${deficitCalories.toLocaleString()} kcal/day**.
   • Avoid drastic cuts (>600 kcal) which downregulate metabolic rate and spike cortisol.

2. **Protein Defense (${proteinGramRange}/day):**
   • Protein has the highest Thermic Effect of Food (TEF) and shields lean muscle mass during energy deficits.
   • Anchor every meal around 35–45g of high-leucine protein (chicken, egg whites, Greek yogurt, fish, whey).

3. **Training & Steps Strategy:**
   • **Lift Heavy (3–4 days/week):** Keep lifting intensity high so your body has a biological reason to retain muscle.
   • **NEAT & Steps (8,000–10,000 steps/day):** Low-impact caloric burn without interfering with central nervous system recovery.

4. **Hydration Benchmark:**
   • Drink at least **2.5–3.0 liters** of water daily. Often mild dehydration is misinterpreted as hunger signals.`
  }

  // 9. Muscle Gain & Bulking
  if (q.includes('bulk') || q.includes('muscle gain') || q.includes('build muscle') || q.includes('hypertrophy') || q.includes('gain weight')) {
    const surplusCalories = ctx.calorieGoal + 300
    return `Here is your blueprint for a **Clean Lean Bulk** to maximize muscle synthesis without excess body fat:

1. **Energy Surplus (+250 to +350 kcal/day):**
   • Target intake: **${surplusCalories.toLocaleString()} kcal/day**.
   • Ideal rate of gain: **0.25–0.5% of body weight per week** (~0.2–0.4 kg/week).

2. **Macronutrient Distribution:**
   • **Protein:** ~${proteinGramRange}/day (1.8–2.2g per kg).
   • **Carbohydrates:** 4–5g per kg (fuels high-glycogen resistance training).
   • **Fats:** 0.8–1.0g per kg (critical for hormonal optimization and joint health).

3. **Hypertrophy Stimulus:**
   • Train each muscle group **2x per week** with 10–18 total working sets per week.
   • Train between **1 to 2 Reps in Reserve (RIR)** — stop 1–2 reps before technical failure.
   • Track numbers weekly in your log. If reps or weight aren't climbing over 4 weeks, assess sleep and caloric intake.`
  }

  // 10. Push Pull Legs (PPL) Split
  if (q.includes('ppl') || (q.includes('push') && q.includes('pull')) || (q.includes('split') && q.includes('routine')) || q.includes('workout plan')) {
    return `Here is a battle-tested **3 to 6-Day Push / Pull / Legs (PPL)** program tailored for **${goalStr}**:

### Day 1: PUSH (Chest, Shoulders, Triceps)
• **Barbell Bench Press:** 4 sets × 6–8 reps (2–3 min rest)
• **Incline Dumbbell Press:** 3 sets × 8–10 reps
• **Standing Overhead Barbell Press:** 3 sets × 8–10 reps
• **Cable Lateral Raises:** 4 sets × 12–15 reps
• **Tricep Rope Pushdowns:** 3 sets × 10–12 reps (superset with Overhead Extensions)

### Day 2: PULL (Back, Rear Delts, Biceps)
• **Barbell Deadlift or Barbell Bent-Over Row:** 4 sets × 5–8 reps
• **Lat Pulldowns or Weighted Pull-ups:** 3 sets × 8–10 reps
• **Chest-Supported Row:** 3 sets × 10–12 reps
• **Face Pulls:** 4 sets × 15 reps (rotator cuff health)
• **Incline Dumbbell Bicep Curls:** 3 sets × 10–12 reps

### Day 3: LEGS & CORE (Quads, Hamstrings, Glutes, Abs)
• **Barbell Back Squat:** 4 sets × 6–8 reps
• **Romanian Deadlift (RDL):** 3 sets × 8–10 reps
• **Bulgarian Split Squats:** 3 sets × 10 reps/leg
• **Standing Calf Raises:** 4 sets × 12–15 reps
• **Hanging Knee/Leg Raises:** 3 sets × 12–15 reps

💡 **Progression Rule:** When you hit the top of the rep range on all sets with solid form, increase weight by 2.5–5 kg next session.`
  }

  // 11. 4-Day Upper / Lower Split
  if (q.includes('upper') || q.includes('lower') || q.includes('4 day') || q.includes('4-day')) {
    return `The **4-Day Upper / Lower Split** is optimal for balancing high mechanical tension with recovery.

**Schedule:**
• Mon: Upper A (Strength Focus)
• Tue: Lower A (Quad Dominant)
• Wed: Active Recovery (10k steps + mobility)
• Thu: Upper B (Hypertrophy Focus)
• Fri: Lower B (Posterior Chain Dominant)
• Sat/Sun: Rest & Bio-Readiness Recharge

**Core Keys:**
1. **Upper A:** Bench Press (4×6), Pendlay Row (4×6), Overhead Press (3×8), Pull-ups (3×8), Triceps/Biceps (3×10).
2. **Lower A:** Back Squat (4×6), Walking Lunges (3×10/leg), Leg Curls (3×12), Calf Raises (4×15).
3. **Upper B:** Incline Dumbbell Press (3×10), Lat Pulldown (3×10), Cable Lateral Raise (4×12), Chest Fly (3×12).
4. **Lower B:** Romanian Deadlift (4×8), Leg Press (3×10), Leg Extensions (3×12), Hanging Leg Raises (3×15).`
  }

  // 12. Chest / Bench Press
  if (q.includes('chest') || q.includes('bench press') || q.includes('pec')) {
    return `### Complete Chest Hypertrophy Guide
To fully develop the pectoralis major (clavicular head, sternal head, and abdominal head):

1. **Upper Chest (Clavicular Head):**
   • **Incline Dumbbell Press (30° bench):** 3 sets × 8–10 reps. Focus on deep stretch at the bottom and converging dumbbells at the top without touching.

2. **Mid & Overall Mass (Sternal Head):**
   • **Flat Barbell Bench Press:** 4 sets × 6–8 reps. Retract and depress scapulae, tuck elbows to ~45°, and plant heels firmly.

3. **Inner/Outer Stretch & Contraction:**
   • **Low-to-High Cable Flyes:** 3 sets × 12–15 reps. Squeeze at peak contraction for 1 second.
   • **Bodyweight Dips (slight forward torso lean):** 3 sets to failure. Focus on chest stretch.`
  }

  // 13. Back & Lats
  if (q.includes('back') || q.includes('lats') || q.includes('pull up') || q.includes('row')) {
    return `### V-Taper Back Development Protocol
A comprehensive back workout must hit vertical pulling, horizontal rowing, and scapular retraction:

1. **Vertical Pull (Lat Width):**
   • **Weighted Pull-ups or Neutral-Grip Lat Pulldown:** 4 sets × 8–10 reps. Pull with your elbows, not your hands. Depress shoulders before bending elbows.

2. **Horizontal Row (Lat & Rhomboid Thickness):**
   • **Chest-Supported T-Bar Row:** 4 sets × 8–10 reps. Removes lower back stabilization so you can overload lats cleanly.
   • **Single-Arm Dumbbell Row:** 3 sets × 10–12 reps.

3. **Upper Back & Posture:**
   • **Face Pulls with Cable Rope:** 4 sets × 15 reps. Key for shoulder longevity, rear deltoid thickness, and counteracting desk posture.`
  }

  // 14. Legs & Squats
  if (q.includes('leg') || q.includes('squat') || q.includes('quad') || q.includes('hamstring') || q.includes('glute')) {
    return `### High-Performance Lower Body Protocol
Balance quad dominance with posterior chain durability:

1. **Compound Foundation:**
   • **Barbell Back Squat or Hack Squat:** 4 sets × 6–8 reps. Push knees over toes in line with ankles; maintain a braced core and neutral lumbar.

2. **Posterior Chain (Hamstrings & Glutes):**
   • **Romanian Deadlift (RDL):** 3 sets × 8–10 reps. Hip hinge motion: push hips back like closing a car door with your glutes until you feel hamstring tension.
   • **Seated or Lying Leg Curl:** 3 sets × 10–12 reps.

3. **Unilateral Stability:**
   • **Bulgarian Split Squats:** 3 sets × 10 reps/leg. Eliminates side-to-side strength imbalances and engages stabilizing gluteus medius.`
  }

  // 15. Default assessment
  return `### Customized Coaching Assessment for ${name || 'Your Training'}

**Your Profile Telemetry:**
• **Current Goal:** ${goalStr}
• **Body Metrics:** ${ctx.currentWeight ? `${ctx.currentWeight} kg` : '78.4 kg'} ${ctx.targetWeight ? `(Target: ${ctx.targetWeight} kg)` : ''}
• **Caloric Intake:** ${ctx.calorieGoal.toLocaleString()} kcal/day
• **Recommended Daily Protein:** ~${proteinGramRange}/day

**3 Immediate Pillars for Rapid Progress:**
1. **Progressive Overload:** Track weights & reps on all compound movements. Aim for 1 extra rep or +1 kg weekly.
2. **Nutritional Precision:** Hit your daily protein mark (${proteinGramRange}) and stay consistent with your caloric target.
3. **Recovery Quality:** Ensure at least 7.5 hours of sleep to match your muscular repair demands.

Ask me for a specific **workout split (PPL, Upper/Lower)**, **macro breakdown**, **pre/post-workout meal plan**, or **recovery protocol** anytime!`
}

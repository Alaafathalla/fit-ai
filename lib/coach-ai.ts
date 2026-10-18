/**
 * FitAI Advanced Athletic Coaching Engine
 * Supports real-time Gemini / LLM API calls if an API key is configured,
 * and provides an extensive, high-performance evidence-based fitness reasoning engine.
 */

import { buildExpertLocalReply } from './coach-rules'

export { buildExpertLocalReply }
export {
  generateCustomFitnessPlan,
  type CustomExercise,
  type CustomWorkoutDay,
  type CustomMealItem,
  type CustomFitnessPlan,
} from './coach-plan-generator'

export interface CoachContext {
  athleteName?: string
  goal: string
  currentWeight?: number
  targetWeight?: number
  calorieGoal: number
  sleepHours: number
  hydration: number
  workoutMinutes: number
  streak?: number
  recentWorkouts?: string[]
}

async function callGeminiApi(prompt: string, context: CoachContext, apiKey: string): Promise<string> {
  const systemPrompt = `You are FitAI Coach, an elite Olympic-tier strength & conditioning coach and sports nutritionist.
The athlete you are coaching has the following telemetry:
- Name: ${context.athleteName || 'Athlete'}
- Goal: ${context.goal || 'Performance & Body Recomposition'}
- Current Weight: ${context.currentWeight ? `${context.currentWeight} kg` : 'Not logged'}
- Target Weight: ${context.targetWeight ? `${context.targetWeight} kg` : 'Not logged'}
- Daily Calorie Target: ${context.calorieGoal} kcal
- Recent Sleep: ${context.sleepHours ? `${context.sleepHours} hrs` : 'N/A'}
- Recent Hydration: ${context.hydration ? `${context.hydration} ml` : 'N/A'}

Provide concise, high-impact, science-backed guidance. Use bold text, clean bullet points, and numbered lists where appropriate for workouts or nutrition plans. Be encouraging, direct, and pragmatic.`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nAthlete Query: ${prompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`)
  }

  const data = await res.json()
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!reply) throw new Error('No reply from Gemini API')
  return reply.trim()
}

/**
 * Main entry point: Generates a high-quality coach reply.
 */
export async function generateCoachReply(message: string, context: CoachContext): Promise<string> {
  const trimmed = message.trim()
  if (!trimmed) return "Ask me anything about your training, nutrition targets, or recovery protocols."

  // 1. Try Gemini if API key is present
  const apiKey =
    (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY)) ||
    (typeof window !== 'undefined' ? localStorage.getItem('fitai-gemini-key') : null)

  if (apiKey) {
    try {
      return await callGeminiApi(trimmed, context, apiKey)
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local intelligence engine:', err)
    }
  }

  // 2. Local Athletic Intelligence Engine
  return buildExpertLocalReply(trimmed, context)
}

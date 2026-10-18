import Link from 'next/link'
import { CalorieRing, MacroBar } from '@/components/charts'

interface TodayNutritionCardProps {
  nutrition: {
    calories: number
    calorieGoal: number
    protein: number
    carbs: number
    fat: number
  } | null
  isNewAccount: boolean
}

export function TodayNutritionCard({ nutrition, isNewAccount }: TodayNutritionCardProps) {
  return (
    <div className="animate-fade-up card p-5" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Today's nutrition</h3>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--foreground-muted)' }}>Calories & macros</p>
        </div>
        <Link href="/nutrition" className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
          Full log →
        </Link>
      </div>

      {nutrition ? (
        <div className="mt-5 flex flex-col items-center gap-5">
          <CalorieRing calories={isNewAccount ? 0 : nutrition.calories} goal={nutrition.calorieGoal} />
          <div className="w-full space-y-3">
            <MacroBar label="Protein" current={isNewAccount ? 0 : nutrition.protein} goal={160} color="var(--primary)" />
            <MacroBar label="Carbs" current={isNewAccount ? 0 : nutrition.carbs} goal={200} color="var(--warning)" />
            <MacroBar label="Fat" current={isNewAccount ? 0 : nutrition.fat} goal={65} color="var(--accent)" />
          </div>
          <p className="w-full text-center text-sm font-semibold" style={{ color: 'var(--foreground-muted)' }}>
            {isNewAccount
              ? `${nutrition.calorieGoal.toLocaleString()} kcal remaining`
              : nutrition.calories <= nutrition.calorieGoal
              ? `${(nutrition.calorieGoal - nutrition.calories).toLocaleString()} kcal remaining`
              : `${(nutrition.calories - nutrition.calorieGoal).toLocaleString()} kcal over goal`}
          </p>
        </div>
      ) : (
        <div className="mt-5 text-center text-sm" style={{ color: 'var(--foreground-muted)' }}>No meals logged yet.</div>
      )}
    </div>
  )
}

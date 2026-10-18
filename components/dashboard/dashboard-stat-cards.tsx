import { Flame, HeartPulse, Target, Zap } from 'lucide-react'
import { StatCard } from '@/components/stat-card'

interface DashboardStatCardsProps {
  displayCurrentWeight: number
  weightDelta: string
  todayCalories: number
  todayCalorieGoal: number
  displayStreak: number
  displayFitnessScore: number
  isNewAccount: boolean
}

export function DashboardStatCards({
  displayCurrentWeight,
  weightDelta,
  todayCalories,
  todayCalorieGoal,
  displayStreak,
  displayFitnessScore,
  isNewAccount,
}: DashboardStatCardsProps) {
  const cards = [
    {
      label: 'Current weight',
      value: `${displayCurrentWeight} kg`,
      meta: isNewAccount ? 'Enter in profile' : `${Number(weightDelta) <= 0 ? '↓' : '↑'} ${Math.abs(Number(weightDelta))} kg`,
      metaPositive: isNewAccount ? false : Number(weightDelta) <= 0,
      icon: Target,
      gradient: 'linear-gradient(135deg,#0f172a,#1e293b)',
      style: { '--i': 0 } as React.CSSProperties,
    },
    {
      label: 'Calories today',
      value: todayCalories.toLocaleString(),
      meta: isNewAccount ? '0% of goal' : `${Math.round((todayCalories / todayCalorieGoal) * 100)}% of goal`,
      metaPositive: !isNewAccount,
      icon: Flame,
      gradient: 'linear-gradient(135deg,#ea580c,#c2410c)',
      style: { '--i': 1 } as React.CSSProperties,
    },
    {
      label: 'Workout streak',
      value: `${displayStreak} days`,
      meta: isNewAccount ? '0 days' : 'Keep it going 🔥',
      metaPositive: !isNewAccount,
      icon: Zap,
      gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
      style: { '--i': 2 } as React.CSSProperties,
    },
    {
      label: 'Performance score',
      value: `${displayFitnessScore}/100`,
      meta: isNewAccount ? 'Awaiting setup' : '+6 this week',
      metaPositive: !isNewAccount,
      icon: HeartPulse,
      gradient: 'linear-gradient(135deg,#059669,#047857)',
      style: { '--i': 3 } as React.CSSProperties,
    },
  ]

  return (
    <div className="stagger animate-fade-up grid gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: '60ms' }}>
      {cards.map(({ style, ...card }) => (
        <div key={card.label} className="animate-fade-up" style={style}>
          <StatCard {...card} />
        </div>
      ))}
    </div>
  )
}

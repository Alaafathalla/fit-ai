export interface ResourceArticle {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  published: string
  body: string[]
}

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    slug: 'progressive-overload-without-burnout',
    title: 'Progressive overload without burning out',
    excerpt: 'How FitAI balances training volume with recovery so athletes can add load without losing consistency.',
    category: 'Training',
    readTime: '6 min',
    published: 'Oct 4, 2026',
    body: [
      'Progressive overload only works if the athlete can actually recover. Adding sets, load, or density every week looks productive on paper and often collapses in week four.',
      'Start with a weekly volume target, not a daily grind. FitAI planners treat rest days as programmed work: sleep, hydration, and mobility still count toward the plan.',
      'Use readiness scores to decide whether to push, hold, or deload. A missed session that preserves next week is better than a forced session that creates two days of soreness.',
      'Coaches should review trends, not isolated workouts. A 4% volume increase with stable sleep is a green light. The same increase with falling hydration is a programming problem.',
    ],
  },
  {
    slug: 'macro-targets-that-athletes-actually-hit',
    title: 'Macro targets athletes will actually hit',
    excerpt: 'Set protein, carbs, and calories around real meals instead of perfect spreadsheets.',
    category: 'Nutrition',
    readTime: '5 min',
    published: 'Sep 18, 2026',
    body: [
      'Most nutrition plans fail because they assume every meal is prepared from scratch. Athletes eat on campus, on the road, and after late sessions.',
      'Anchor the day on protein first. FitAI meal logging treats protein as the non-negotiable, then fills remaining calories with carbs around training and fats for satiety.',
      'If an athlete consistently undershoots by 400 calories, the target is wrong — not the athlete. Adjust the goal, then ask for two logged meals a day instead of six.',
      'Coaches can review meal quality without policing every snack. Look for training-day carbs, evening protein, and hydration before criticizing dessert.',
    ],
  },
  {
    slug: 'coach-checkins-that-take-ten-minutes',
    title: 'Coach check-ins that take ten minutes',
    excerpt: 'A repeatable weekly review for coaches who manage more than a handful of athletes.',
    category: 'Coaching',
    readTime: '7 min',
    published: 'Aug 29, 2026',
    body: [
      'A useful check-in is a triage, not a therapy session. FitAI’s coach portal surfaces who is on track, who needs review, and who is slipping before you open a chat.',
      'Spend two minutes on adherence: sessions completed, meals logged, sleep hours. Spend three minutes on flags: soreness, missed days, sudden weight swings.',
      'Leave five minutes for a single programming change. One clear adjustment beats five vague suggestions the athlete cannot remember.',
      'Write the next action in the athlete’s plan, not only in a message. If it is not on the weekly calendar, it did not happen.',
    ],
  },
]

export function getResource(slug: string) {
  return RESOURCE_ARTICLES.find((article) => article.slug === slug)
}

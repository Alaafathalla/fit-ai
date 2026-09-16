import { MoreHorizontal, type LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  meta: string
  icon: LucideIcon
  tone: string
  positive?: boolean
}

export function StatCard({ label, value, meta, icon: Icon, tone, positive = true }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(45,54,88,0.06)] transition-transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
          <Icon className="size-5" />
        </span>
        <MoreHorizontal className="size-4 text-slate-300" />
      </div>
      <p className="mt-5 text-sm text-slate-500">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <strong className="text-2xl font-semibold tracking-tight text-slate-900">{value}</strong>
        <span className={`mb-1 text-xs font-semibold ${positive ? 'text-[#31ad75]' : 'text-[#f27455]'}`}>
          {meta}
        </span>
      </div>
    </div>
  )
}

import { Sparkles } from 'lucide-react'

export function Logo() {
  return (
    <div className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-[10px] bg-[#111827] text-white">
        <Sparkles className="size-4" />
      </span>
      <span>
        fit<span className="text-[#4e6bff]">ai</span>
      </span>
    </div>
  )
}

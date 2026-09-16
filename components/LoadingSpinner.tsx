export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <div className="size-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#596bff]" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

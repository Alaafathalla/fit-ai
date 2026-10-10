export function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none group">
      <div className="flex size-9 items-center justify-center rounded-xl bg-[#090d16] text-white border border-slate-800/80 shadow-xs transition-transform duration-200 group-hover:scale-105">
        <svg viewBox="0 0 48 48" className="size-5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 6 24 H 14 L 18 31 L 25 11 L 32 37 L 36 24 H 42"
            stroke="url(#logoPulse)"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="25" cy="11" r="2" fill="#ffffff" />
          <circle cx="25" cy="11" r="1" fill="#38bdf8" />
          <defs>
            <linearGradient id="logoPulse" x1="6" y1="24" x2="42" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="0.5" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="flex items-baseline tracking-tight">
        <span className="text-base font-black text-foreground">FIT</span>
        <span className="text-base font-black text-primary">AI</span>
      </div>
    </div>
  )
}

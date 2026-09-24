import { Spinner } from '@/components/spinner'

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center" style={{ background: 'var(--background)' }}>
      <Spinner label="Loading FitAI…" />
    </div>
  )
}

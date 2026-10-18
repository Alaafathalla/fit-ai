import { useState } from 'react'
import { Scale, X } from 'lucide-react'
import { updateUserProfile } from '@/lib/api'

interface QuickSetupModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => Promise<void> | void
}

export function QuickSetupModal({ open, onClose, onSuccess }: QuickSetupModalProps) {
  const [setupCurrentWeight, setSetupCurrentWeight] = useState('')
  const [setupTargetWeight, setSetupTargetWeight] = useState('')
  const [setupGoal, setSetupGoal] = useState('Lose fat & build lean muscle')
  const [setupSaving, setSetupSaving] = useState(false)
  const [setupError, setSetupError] = useState('')

  if (!open) return null

  const handleQuickSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSetupSaving(true)
    setSetupError('')

    const cw = parseFloat(setupCurrentWeight)
    const tw = parseFloat(setupTargetWeight)

    if (isNaN(cw) || cw <= 0) {
      setSetupError('Please enter a valid current weight (e.g., 75 kg).')
      setSetupSaving(false)
      return
    }

    if (!setupGoal.trim()) {
      setSetupError('Please enter or select a fitness goal.')
      setSetupSaving(false)
      return
    }

    try {
      await updateUserProfile({
        currentWeight: cw,
        targetWeight: !isNaN(tw) && tw > 0 ? tw : undefined,
        goal: setupGoal.trim(),
      })
      await onSuccess()
      onClose()
    } catch (cause) {
      setSetupError(cause instanceof Error ? cause.message : 'Failed to save profile.')
    } finally {
      setSetupSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(8px)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="animate-scale-in w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary-light text-primary">
              <Scale className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">Set Up Your Profile</h3>
              <p className="text-xs text-foreground-muted">Configure weight & fitness goal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost !p-1.5 text-foreground-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {setupError && (
          <div className="mt-4 rounded-xl bg-danger-light p-3 text-xs font-semibold text-danger">
            {setupError}
          </div>
        )}

        <form onSubmit={handleQuickSetupSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground">Current Body Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              min="20"
              max="300"
              value={setupCurrentWeight}
              onChange={(e) => setSetupCurrentWeight(e.target.value)}
              placeholder="e.g. 76.5"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background-alt px-4 py-2.5 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">Target Weight (kg) - Optional</label>
            <input
              type="number"
              step="0.1"
              min="20"
              max="300"
              value={setupTargetWeight}
              onChange={(e) => setSetupTargetWeight(e.target.value)}
              placeholder="e.g. 72.0"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background-alt px-4 py-2.5 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">Primary Fitness Goal</label>
            <select
              value={setupGoal}
              onChange={(e) => setSetupGoal(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-border bg-background-alt px-4 py-2.5 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:bg-white"
            >
              <option value="Lose fat & build lean muscle">Lose fat & build lean muscle</option>
              <option value="Strength & hypertrophy">Strength & hypertrophy</option>
              <option value="5K / 10K running endurance">5K / 10K running endurance</option>
              <option value="Mobility, core & posture recovery">Mobility, core & posture recovery</option>
              <option value="General cardiovascular fitness">General cardiovascular fitness</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline !text-xs !h-10"
            >
              Cancel
            </button>
            <button type="submit" disabled={setupSaving} className="btn-primary !text-xs !h-10">
              {setupSaving ? 'Saving…' : 'Save & Activate Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { MarketingShell } from '@/components/marketing/marketing-shell'
import { CheckCircle2, Mail, MapPin, Send } from 'lucide-react'
import { FormEvent, useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('Product question')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <MarketingShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="section-label">Contact</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">We’ll get back with a real answer.</h1>
          <p className="mt-4 text-sm leading-7 text-foreground-muted">
            Product questions, coaching workspace demos, and account issues all come through here. This demo stores the message locally so you can see the full flow.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Mail className="size-4 text-primary" /> hello@fitai.app
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <MapPin className="size-4 text-primary" /> Remote — athletes and coaches worldwide
            </p>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          {sent ? (
            <div className="grid min-h-[280px] place-items-center text-center">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-success-light text-success">
                  <CheckCircle2 className="size-6" />
                </span>
                <h2 className="mt-4 text-xl font-black">Message received</h2>
                <p className="mt-2 text-sm text-foreground-muted">
                  Thanks, {name || 'there'}. We’ll reply to {email || 'your email'} about “{topic}”.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-semibold">
                  Name
                  <input required value={name} onChange={(e) => setName(e.target.value)} className="input-base w-full px-3 py-2.5 font-medium" />
                </label>
                <label className="space-y-1.5 text-sm font-semibold">
                  Email
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base w-full px-3 py-2.5 font-medium" />
                </label>
              </div>
              <label className="block space-y-1.5 text-sm font-semibold">
                Topic
                <select value={topic} onChange={(e) => setTopic(e.target.value)} className="input-base w-full px-3 py-2.5 font-medium">
                  <option>Product question</option>
                  <option>Coach workspace demo</option>
                  <option>Billing</option>
                  <option>Account access</option>
                </select>
              </label>
              <label className="block space-y-1.5 text-sm font-semibold">
                Message
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-base w-full px-3 py-2.5 font-medium"
                />
              </label>
              <button type="submit" className="btn-primary w-full sm:w-auto">
                <Send className="size-4" /> Send message
              </button>
            </form>
          )}
        </div>
      </section>
    </MarketingShell>
  )
}

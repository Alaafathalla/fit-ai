'use client'

import { AppHeader } from '@/components/app-header'
import { Sidebar } from '@/components/sidebar'
import { getCurrentAuthUser, getRoleHome, subscribeToAuth, type AuthRole } from '@/lib/auth'
import type { UserProfile } from '@/lib/api'
import { getUserProfile } from '@/lib/api'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ShellProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  allowedRoles?: AuthRole[]
}

export function Shell({ title, subtitle, children, allowedRoles }: ShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const allowedRoleKey = allowedRoles?.join('|') || ''

  useEffect(() => {
    let cancelled = false

    const syncAuth = async () => {
      const authUser = getCurrentAuthUser()

      if (!authUser) {
        setAuthReady(false)
        const next = pathname ? `?next=${encodeURIComponent(pathname)}` : ''
        router.replace(`/auth/login${next}`)
        return
      }

      if (allowedRoles?.length && !allowedRoles.includes(authUser.role)) {
        router.replace(getRoleHome(authUser.role))
        return
      }

      try {
        const profile = await getUserProfile()
        if (!cancelled) setUser(profile)
      } catch {
        if (!cancelled) {
          setUser({
            id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            avatarInitials: authUser.avatarInitials,
            avatarColor: 'bg-[#eef0ff] text-[#4f5fed]',
            plan: authUser.plan,
            goal: '',
            currentWeight: 0,
            targetWeight: 0,
            streak: 0,
            fitnessScore: 0,
            joinedAt: authUser.createdAt,
            role: authUser.role,
          })
        }
      } finally {
        if (!cancelled) setAuthReady(true)
      }
    }

    void syncAuth()
    const unsubscribe = subscribeToAuth(() => void syncAuth())

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [allowedRoleKey, pathname, router])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  if (!authReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <span className="size-7 animate-spin rounded-full border-[3px] border-primary/15 border-t-primary" />
          <p className="text-xs font-semibold text-foreground-muted">Preparing your workspace…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar user={user} />
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="animate-fade-in absolute inset-0"
            style={{ background: 'rgba(10,15,30,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setDrawerOpen(false)}
          />
          <div className="animate-slide-left absolute left-0 top-0 h-full shadow-2xl">
            <Sidebar user={user} onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader title={title} subtitle={subtitle} onMenuOpen={() => setDrawerOpen(true)} role={user?.role === 'COACH' ? 'COACH' : 'USER'} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

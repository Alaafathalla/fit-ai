'use client'

import { getCurrentAuthUser, getRoleHome } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentAuthUser()
    router.replace(user ? getRoleHome(user.role) : '/auth/login')
  }, [router])

  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <span className="size-7 animate-spin rounded-full border-[3px] border-primary/15 border-t-primary" />
    </div>
  )
}

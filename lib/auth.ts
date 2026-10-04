export type AuthRole = 'USER' | 'COACH'
export type AuthPlan = 'Free' | 'Pro' | 'Elite'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: AuthRole
  avatarInitials: string
  plan: AuthPlan
  createdAt: string
}

interface StoredAccount extends AuthUser {
  passwordHash: string
}

interface AuthSession {
  user: AuthUser
  createdAt: string
  expiresAt: string
  remember: boolean
}

interface ResetRequest {
  email: string
  token: string
  expiresAt: string
}

const ACCOUNTS_KEY = 'fitai-auth-accounts-v1'
const SESSION_KEY = 'fitai-auth-session-v1'
const RESET_KEY = 'fitai-auth-reset-v1'
const AUTH_EVENT = 'fitai-auth-changed'

const DEMO_ACCOUNTS: Array<{
  id: string
  name: string
  email: string
  role: AuthRole
  password: string
  plan: AuthPlan
}> = [
  {
    id: 'demo-athlete',
    name: 'Mahmoud Ahmed',
    email: 'athlete@fitai.app',
    role: 'USER',
    password: 'FitAI123!',
    plan: 'Pro',
  },
  {
    id: 'demo-coach',
    name: 'Sarah Miller',
    email: 'coach@fitai.app',
    role: 'COACH',
    password: 'FitAI123!',
    plan: 'Elite',
  },
]

function isBrowser() {
  return typeof window !== 'undefined'
}

function normalizeEmail(email: string) {
  return String(email || '').trim().toLowerCase()
}

export function getInitials(name: string) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!parts.length) return 'FA'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase()
}

async function hashPassword(password: string) {
  const value = String(password || '')

  if (isBrowser() && window.crypto?.subtle) {
    const data = new TextEncoder().encode(value)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  }

  // Frontend-only demo fallback. Real deployments should authenticate against
  // a server and never keep credential verifiers in browser storage.
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return `fallback-${(hash >>> 0).toString(16)}`
}

function readAccounts(): StoredAccount[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY)
    return raw ? (JSON.parse(raw) as StoredAccount[]) : []
  } catch {
    return []
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  if (!isBrowser()) return
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

async function ensureDemoAccounts() {
  if (!isBrowser()) return

  const accounts = readAccounts()
  let changed = false

  for (const demo of DEMO_ACCOUNTS) {
    if (accounts.some((account) => account.email === demo.email)) continue

    accounts.push({
      id: demo.id,
      name: demo.name,
      email: demo.email,
      role: demo.role,
      plan: demo.plan,
      avatarInitials: getInitials(demo.name),
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(demo.password),
    })
    changed = true
  }

  if (changed) writeAccounts(accounts)
}

function emitAuthChanged() {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent(AUTH_EVENT))
}

function parseSession(raw: string | null): AuthSession | null {
  if (!raw) return null

  try {
    const session = JSON.parse(raw) as AuthSession
    if (!session?.user?.id || !session.expiresAt) return null
    if (new Date(session.expiresAt).getTime() <= Date.now()) return null
    return session
  } catch {
    return null
  }
}

export function getCurrentAuthSession(): AuthSession | null {
  if (!isBrowser()) return null

  const sessionSession = parseSession(window.sessionStorage.getItem(SESSION_KEY))
  if (sessionSession) return sessionSession

  const localSession = parseSession(window.localStorage.getItem(SESSION_KEY))
  if (localSession) return localSession

  window.sessionStorage.removeItem(SESSION_KEY)
  window.localStorage.removeItem(SESSION_KEY)
  return null
}

export function getCurrentAuthUser(): AuthUser | null {
  return getCurrentAuthSession()?.user ?? null
}

function createSession(user: AuthUser, remember: boolean) {
  if (!isBrowser()) return

  const ttl = remember ? 30 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000
  const session: AuthSession = {
    user,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + ttl).toISOString(),
    remember,
  }

  window.localStorage.removeItem(SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)

  const storage = remember ? window.localStorage : window.sessionStorage
  storage.setItem(SESSION_KEY, JSON.stringify(session))
  emitAuthChanged()
}

export function getRoleHome(role: AuthRole) {
  return role === 'COACH' ? '/coach-portal' : '/dashboard'
}

export async function loginWithPassword(input: {
  email: string
  password: string
  role: AuthRole
  remember?: boolean
}): Promise<AuthUser> {
  await ensureDemoAccounts()

  const email = normalizeEmail(input.email)
  const account = readAccounts().find((item) => item.email === email)
  const passwordHash = await hashPassword(input.password)

  if (!account || account.passwordHash !== passwordHash) {
    throw new Error('Incorrect email or password.')
  }

  if (account.role !== input.role) {
    throw new Error(
      input.role === 'COACH'
        ? 'This account is registered as an athlete. Switch to Athlete login.'
        : 'This account is registered as a coach. Switch to Coach login.'
    )
  }

  const { passwordHash: _passwordHash, ...user } = account
  createSession(user, Boolean(input.remember))
  return user
}

export async function registerAccount(input: {
  name: string
  email: string
  password: string
  role: AuthRole
  remember?: boolean
}): Promise<AuthUser> {
  await ensureDemoAccounts()

  const name = String(input.name || '').trim()
  const email = normalizeEmail(input.email)

  if (name.length < 2) throw new Error('Enter your full name.')
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email address.')
  if (input.password.length < 8) throw new Error('Password must be at least 8 characters.')
  if (!/[a-z]/.test(input.password) || !/[A-Z]/.test(input.password) || !/\d/.test(input.password)) {
    throw new Error('Use uppercase, lowercase, and at least one number in your password.')
  }

  const accounts = readAccounts()
  if (accounts.some((account) => account.email === email)) {
    throw new Error('An account already exists with this email.')
  }

  const account: StoredAccount = {
    id: `fitai-${input.role.toLowerCase()}-${Date.now().toString(36)}`,
    name,
    email,
    role: input.role,
    plan: input.role === 'COACH' ? 'Pro' : 'Free',
    avatarInitials: getInitials(name),
    createdAt: new Date().toISOString(),
    passwordHash: await hashPassword(input.password),
  }

  accounts.push(account)
  writeAccounts(accounts)

  const { passwordHash: _passwordHash, ...user } = account
  createSession(user, input.remember ?? true)
  return user
}

export async function requestPasswordReset(emailInput: string): Promise<{
  email: string
  token: string
}> {
  await ensureDemoAccounts()

  const email = normalizeEmail(emailInput)
  const account = readAccounts().find((item) => item.email === email)

  // Always create a generic request so the UI does not reveal whether an
  // account exists. The reset step validates the account again.
  const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
  const request: ResetRequest = {
    email,
    token,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  }

  if (isBrowser()) {
    window.sessionStorage.setItem(RESET_KEY, JSON.stringify(request))
  }

  // Keep the same response shape for known/unknown emails.
  void account
  return { email, token }
}

export async function resetPassword(input: {
  email: string
  token: string
  password: string
}) {
  await ensureDemoAccounts()

  if (!isBrowser()) throw new Error('Password reset is unavailable.')
  if (input.password.length < 8) throw new Error('Password must be at least 8 characters.')

  let request: ResetRequest | null = null
  try {
    const raw = window.sessionStorage.getItem(RESET_KEY)
    request = raw ? (JSON.parse(raw) as ResetRequest) : null
  } catch {
    request = null
  }

  const email = normalizeEmail(input.email)
  const validRequest =
    request &&
    request.email === email &&
    request.token === input.token &&
    new Date(request.expiresAt).getTime() > Date.now()

  if (!validRequest) {
    throw new Error('This reset link is invalid or has expired. Request a new one.')
  }

  const accounts = readAccounts()
  const index = accounts.findIndex((account) => account.email === email)
  if (index < 0) {
    throw new Error('This reset link is invalid or has expired. Request a new one.')
  }

  accounts[index] = {
    ...accounts[index],
    passwordHash: await hashPassword(input.password),
  }
  writeAccounts(accounts)
  window.sessionStorage.removeItem(RESET_KEY)
}

export function logout() {
  if (!isBrowser()) return
  window.localStorage.removeItem(SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)
  emitAuthChanged()
}

export function subscribeToAuth(callback: () => void) {
  if (!isBrowser()) return () => undefined

  const handler = () => callback()
  window.addEventListener(AUTH_EVENT, handler)
  window.addEventListener('storage', handler)

  return () => {
    window.removeEventListener(AUTH_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

export function getDemoCredentials(role: AuthRole) {
  const account = DEMO_ACCOUNTS.find((item) => item.role === role)!
  return { email: account.email, password: account.password }
}

export function updateCurrentAuthIdentity(input: { name?: string; email?: string }) {
  const current = getCurrentAuthSession()
  if (!current || !isBrowser()) return

  const nextUser: AuthUser = {
    ...current.user,
    name: input.name?.trim() || current.user.name,
    email: input.email ? normalizeEmail(input.email) : current.user.email,
    avatarInitials: input.name ? getInitials(input.name) : current.user.avatarInitials,
  }

  const accounts = readAccounts()
  const index = accounts.findIndex((account) => account.id === current.user.id)
  if (index >= 0) {
    accounts[index] = {
      ...accounts[index],
      name: nextUser.name,
      email: nextUser.email,
      avatarInitials: nextUser.avatarInitials,
    }
    writeAccounts(accounts)
  }

  createSession(nextUser, current.remember)
}

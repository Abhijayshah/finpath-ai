import { createContext, useContext } from 'react'

export type AuthUser = {
  name: string
  email: string
  avatar: string
}

export type AuthContextValue = {
  user: AuthUser | null
  isLoggedIn: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}

export function readStoredUser(): AuthUser | null {
  const raw = window.localStorage.getItem('finpath_user')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return null
    const u = parsed as Partial<AuthUser>
    if (!u.name || !u.email || !u.avatar) return null
    return { name: u.name, email: u.email, avatar: u.avatar }
  } catch {
    return null
  }
}

export function writeStoredUser(user: AuthUser) {
  window.localStorage.setItem('finpath_user', JSON.stringify(user))
}

export function clearStoredAuth() {
  window.localStorage.removeItem('finpath_user')
  window.localStorage.removeItem('finpath_display_name')
}

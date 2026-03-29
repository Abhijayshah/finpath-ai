import { useMemo, useState } from 'react'
import {
  AuthContext,
  type AuthContextValue,
  type AuthUser,
  clearStoredAuth,
  readStoredUser,
  writeStoredUser,
} from './authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isLoggedIn: Boolean(user),
      login: (u) => {
        writeStoredUser(u)
        setUser(u)
      },
      logout: () => {
        clearStoredAuth()
        setUser(null)
      },
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

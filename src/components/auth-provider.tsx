import { createContext, useEffect, useMemo, useState } from "react"
import type { AuthUser } from "@/types"
import { api, ApiError, clearToken, setToken } from "@/lib/api"

const STORAGE_KEY = "worklog-auth"

interface LoginResult {
  token: string
  user: AuthUser
}

interface AuthContextValue {
  user: AuthUser | null
  loginWithCredentials: (identifier: string, password: string) => Promise<boolean>
  loginWithGoogle: (idToken: string) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

function loadInitialUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadInitialUser)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loginWithCredentials: async (identifier, password) => {
        try {
          const result = await api.post<LoginResult>("/auth/login", { identifier, password })
          setToken(result.token)
          setUser(result.user)
          return true
        } catch (err) {
          if (err instanceof ApiError) return false
          throw err
        }
      },
      loginWithGoogle: async (idToken) => {
        try {
          const result = await api.post<LoginResult>("/auth/google", { idToken })
          setToken(result.token)
          setUser(result.user)
          return true
        } catch (err) {
          if (err instanceof ApiError) return false
          throw err
        }
      },
      logout: () => {
        clearToken()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

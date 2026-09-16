import { createContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { authStorage } from './auth.storage'
import type { AuthState, LoginResponse, UserInfo } from './auth.types'

export interface AuthContextValue extends AuthState {
  isLoggedIn: boolean
  login: (loginResponse: LoginResponse) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

/** 앱 최상단에 한 번만 배치하는 인증 상태 Provider입니다. */
export function AuthProvider({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState<AuthState>(() => authStorage.load())

  const value = useMemo<AuthContextValue>(() => ({
    ...auth,
    isLoggedIn: Boolean(auth.token),
    login(loginResponse) {
      setAuth(authStorage.save(loginResponse))
    },
    logout() {
      authStorage.clear()
      setAuth({ token: null, user: null })
    },
  }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export type { UserInfo }

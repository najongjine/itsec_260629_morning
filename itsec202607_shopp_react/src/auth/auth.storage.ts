import type { AuthState, LoginResponse, UserInfo } from './auth.types'

const AUTH_STORAGE_KEY = 'itsec.auth'

const emptyAuthState: AuthState = {
  token: null,
  user: null,
}

/**
 * localStorage를 숨기는 인증 저장소입니다.
 * 브라우저가 아닌 환경에서는 빈 인증 상태를 반환합니다.
 */
export const authStorage = {
  load(): AuthState {
    if (typeof window === 'undefined') return emptyAuthState

    try {
      const saved = window.localStorage.getItem(AUTH_STORAGE_KEY)
      if (!saved) return emptyAuthState

      const value: unknown = JSON.parse(saved)
      if (!isAuthState(value)) {
        this.clear()
        return emptyAuthState
      }

      return value
    } catch {
      return emptyAuthState
    }
  },

  save(loginResponse: LoginResponse): AuthState {
    const state: AuthState = {
      token: loginResponse.token,
      user: loginResponse.userinfo,
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
    return state
  },

  clear(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  },
}

function isAuthState(value: unknown): value is AuthState {
  if (!value || typeof value !== 'object') return false

  const auth = value as Partial<AuthState>
  return (
    (typeof auth.token === 'string' || auth.token === null) &&
    (auth.user === null || isUserInfo(auth.user))
  )
}

function isUserInfo(value: unknown): value is UserInfo {
  if (!value || typeof value !== 'object') return false

  const user = value as Partial<UserInfo>
  return (
    typeof user.id === 'number' &&
    typeof user.username === 'string' &&
    typeof user.password === 'string' &&
    typeof user.email === 'string' &&
    typeof user.gender === 'string' &&
    typeof user.created_dt === 'string'
  )
}

/** 서버의 로그인 응답에서 받는 사용자 정보입니다. */
export interface UserInfo {
  id: number
  username: string
  password: string
  email: string
  gender: string
  created_dt: string
}

/** 서버 로그인 API의 성공 응답 형식입니다. */
export interface LoginResponse {
  token: string
  userinfo: UserInfo
}

export interface AuthState {
  token: string | null
  user: UserInfo | null
}

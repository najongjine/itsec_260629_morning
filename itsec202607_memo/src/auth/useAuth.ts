import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

/**
 * 인증 기능의 화면용 퍼사드입니다.
 * token, user, isLoggedIn, login(), logout()만 이 훅으로 사용하세요.
 * 
 * import { useEffect } from 'react'
import { useAuth } from './auth'

function BoardList() {
  const { isLoggedIn, user, token, logout } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) return

    fetch('http://localhost:8000/boardlist', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }, [isLoggedIn, token])

  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>{user?.username} 님 로그인 중</p>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  )
}

export default BoardList
 */
export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.')
  }

  return auth
}

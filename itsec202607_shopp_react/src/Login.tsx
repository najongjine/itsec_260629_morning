import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from './auth';
import { apiUrl } from './api';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formdata = new URLSearchParams();
    formdata.append('username', username);
    formdata.append('password', password);

    let response: any = await fetch(apiUrl('/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formdata,
    });
    response = (await response?.json()) || {};

    if (!response?.success) {
      alert('아이디 또는 비밀번호를 확인해 주세요.');
      return;
    }

    response = response?.data || {};
    login({
      token: response?.token || '',
      userinfo: response?.userinfo || {},
    });
    navigate('/');
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <header className="auth-card__header">
          <p className="auth-card__eyebrow">WELCOME BACK</p>
          <h1>로그인</h1>
          <p>계정에 로그인하고 쇼핑을 계속하세요.</p>
        </header>

        <div className="auth-card__fields">
          <label className="auth-field" htmlFor="login-username">
            <span>아이디</span>
            <input
              id="login-username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="아이디를 입력하세요"
              autoComplete="username"
              required
            />
          </label>

          <label className="auth-field" htmlFor="login-password">
            <span>비밀번호</span>
            <input
              id="login-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        <button className="auth-card__submit" type="submit">
          로그인
        </button>

        <p className="auth-card__switch">
          아직 계정이 없으신가요? <Link to="/register">회원가입</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;

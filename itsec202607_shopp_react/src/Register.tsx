import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from './auth';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('m');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const formdata = new URLSearchParams();
    formdata.append('username', username);
    formdata.append('password', password);
    formdata.append('email', email);
    formdata.append('address', address);
    formdata.append('gender', gender);

    let response: any = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formdata,
    });
    response = (await response?.json()) || {};

    if (!response?.success) {
      alert(`회원가입에 실패했습니다. ${response?.msg || ''}`);
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
    <main className="auth-page auth-page--register">
      <form className="auth-card auth-card--wide" onSubmit={handleSubmit}>
        <header className="auth-card__header">
          <p className="auth-card__eyebrow">JOIN US</p>
          <h1>회원가입</h1>
          <p>간단한 정보 입력으로 계정을 만들어 보세요.</p>
        </header>

        <div className="auth-card__fields auth-card__fields--grid">
          <label className="auth-field auth-field--full" htmlFor="register-username">
            <span>아이디</span>
            <input
              id="register-username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="사용할 아이디"
              autoComplete="username"
              required
            />
          </label>

          <label className="auth-field" htmlFor="register-password">
            <span>비밀번호</span>
            <input
              id="register-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호 입력"
              autoComplete="new-password"
              required
            />
          </label>

          <label className="auth-field" htmlFor="register-password-confirm">
            <span>비밀번호 확인</span>
            <input
              id="register-password-confirm"
              name="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder="한 번 더 입력"
              autoComplete="new-password"
              required
            />
          </label>

          <label className="auth-field auth-field--full" htmlFor="register-email">
            <span>이메일</span>
            <input
              id="register-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field" htmlFor="register-address">
            <span>주소</span>
            <input
              id="register-address"
              name="address"
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="주소를 입력하세요"
              autoComplete="street-address"
              required
            />
          </label>

          <label className="auth-field" htmlFor="register-gender">
            <span>성별</span>
            <select
              id="register-gender"
              name="gender"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
            >
              <option value="m">남성</option>
              <option value="f">여성</option>
            </select>
          </label>
        </div>

        <button className="auth-card__submit" type="submit">
          회원가입
        </button>

        <p className="auth-card__switch">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;

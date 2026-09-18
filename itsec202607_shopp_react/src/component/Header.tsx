import { Link, NavLink } from 'react-router';
import { useAuth } from '../auth';
import './Header.css';

function Header() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" to="/" aria-label="SHOPP 홈">
          SHOPP<span aria-hidden="true">.</span>
        </Link>

        <nav className="site-header__nav" aria-label="주요 메뉴">
          <NavLink
            className={({ isActive }) =>
              `site-header__link${isActive ? ' site-header__link--active' : ''}`
            }
            to="/"
          >
            상품
          </NavLink>

          {!isLoggedIn ? (
            <div className="site-header__actions">
              <NavLink className="site-header__link" to="/login">
                로그인
              </NavLink>
              <NavLink className="site-header__button" to="/register">
                회원가입
              </NavLink>
            </div>
          ) : (
            <div className="site-header__actions">
              <span className="site-header__user">
                <span className="site-header__avatar" aria-hidden="true">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span className="site-header__username">{user?.username}</span>
              </span>
              <button className="site-header__logout" type="button" onClick={logout}>
                로그아웃
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

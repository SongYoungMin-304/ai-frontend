import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white transition-transform duration-300 ease-spring group-hover:rotate-[-6deg]">
            <span className="font-display text-lg font-bold leading-none">C</span>
          </span>
          <span className="font-display text-[22px] font-semibold tracking-tight text-ink-900">
            community
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={`/users/${user?.id}`}
                className="group flex items-center gap-2 rounded-full border border-ink-200/70 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 transition-all duration-200 ease-smooth hover:border-ink-300 hover:bg-ink-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-100 text-[11px] font-bold text-accent-700">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
                <span>{user?.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-500 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-900"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                to="/login"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-ink-600 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-900"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-ink-900 px-4 py-1.5 text-sm font-semibold text-white transition-all duration-200 ease-smooth hover:bg-ink-800 hover:shadow-card-hover"
              >
                회원가입
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

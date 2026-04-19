import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          커뮤니티
        </Link>

        <nav className="nav">
          {isAuthenticated ? (
            <div className="auth-menu">
              <Link to={`/users/${user?.id}`} className="username">
                {user?.username}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                로그아웃
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-link">
                로그인
              </Link>
              <Link to="/signup" className="signup-link">
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

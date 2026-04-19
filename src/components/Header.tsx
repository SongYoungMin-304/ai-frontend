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
    <header className="sticky top-0 z-100 bg-gray-100 border-b border-gray-300 py-4">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          커뮤니티
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to={`/users/${user?.id}`} className="text-gray-800 font-medium">
                {user?.username}
              </Link>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-50">
                로그인
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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

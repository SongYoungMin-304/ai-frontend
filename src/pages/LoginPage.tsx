import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ username, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-md">
        <h1 className="text-center mb-8 text-gray-800">로그인</h1>

        {error && <div className="bg-red-100 text-red-800 px-3 py-2 rounded text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-2 font-medium text-gray-800">사용자명</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 font-medium text-gray-800">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1234"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          계정이 없으신가요? <Link to="/signup" className="text-blue-600 font-medium hover:underline">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

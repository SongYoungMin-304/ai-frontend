import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      await signup({ username, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-md">
        <h1 className="text-center mb-8 text-gray-800">회원가입</h1>

        {error && <div className="bg-red-100 text-red-800 px-3 py-2 rounded text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-2 font-medium text-gray-800">사용자명</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={2}
              maxLength={20}
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
              minLength={4}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="passwordConfirm" className="mb-2 font-medium text-gray-800">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          이미 계정이 있으신가요? <Link to="/login" className="text-blue-600 font-medium hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

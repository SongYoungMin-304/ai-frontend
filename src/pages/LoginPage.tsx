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
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="card overflow-hidden p-8 sm:p-10">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
              Welcome back
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              로그인
            </h1>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm font-medium text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="username" className="label-text">
                사용자명
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label-text">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="input-field"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            계정이 없으신가요?{' '}
            <Link
              to="/signup"
              className="font-semibold text-accent-700 transition-colors hover:text-accent-800"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

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
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="card overflow-hidden p-8 sm:p-10">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
              Join community
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              회원가입
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
                minLength={2}
                maxLength={20}
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
                minLength={4}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="label-text">
                비밀번호 확인
              </label>
              <input
                type="password"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? '회원가입 중...' : '회원가입'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/login"
              className="font-semibold text-accent-700 transition-colors hover:text-accent-800"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

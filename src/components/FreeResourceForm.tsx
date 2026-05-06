import React, { useState } from 'react';
import { freeResourceService } from '../services/freeResourceService';

interface FreeResourceFormProps {
  className?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FreeResourceForm: React.FC<FreeResourceFormProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      await freeResourceService.subscribe(trimmed);
      setEmail('');
      setSubmitted(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        '구독 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={`flex items-start gap-3 rounded-xl border border-accent-200/70 bg-accent-50 px-4 py-3.5 text-[14px] font-medium text-accent-800 ${className ?? ''}`}
        role="status"
      >
        <svg
          className="mt-0.5 h-4 w-4 shrink-0"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 10.5l4 4 8-9" />
        </svg>
        <span>구독해주셔서 감사합니다. 곧 이메일로 보내드릴게요.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={className}
      aria-label="무료 자료 신청"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="free-resource-email" className="sr-only">
          이메일
        </label>
        <input
          id="free-resource-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={handleChange}
          placeholder="example@email.com"
          className="input-field flex-1"
          disabled={loading}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'free-resource-email-error' : undefined}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary sm:px-7"
        >
          {loading ? '신청 중...' : '무료로 받기'}
        </button>
      </div>
      {error && (
        <p
          id="free-resource-email-error"
          className="mt-2 text-sm font-medium text-rose-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
};

export default FreeResourceForm;

import React, { useState } from 'react';
import {
  digitalProductService,
  DigitalProductRequest,
} from '../services/digitalProductService';

interface ProductOption {
  value: string;
  label: string;
  price: string;
}

interface DigitalProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const productOptions: ProductOption[] = [
  { value: 'RESUME_TEMPLATE', label: '이력서 템플릿', price: '1만원' },
  { value: 'INTERVIEW_QUESTIONS', label: '면접 질문 모음', price: '1.2만원' },
  { value: 'SALARY_NEGOTIATION', label: '연봉 협상 스크립트', price: '1.5만원' },
];

interface DigitalProductFormData {
  name: string;
  email: string;
  phone: string;
  productType: string;
  message: string;
}

const initialForm: DigitalProductFormData = {
  name: '',
  email: '',
  phone: '',
  productType: '',
  message: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{9,}$/;

const DigitalProductModal: React.FC<DigitalProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form, setForm] = useState<DigitalProductFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const isValid =
    form.name.trim() !== '' &&
    EMAIL_REGEX.test(form.email.trim()) &&
    PHONE_REGEX.test(form.phone.trim()) &&
    form.productType !== '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }
    if (!PHONE_REGEX.test(form.phone.trim())) {
      setError('올바른 전화번호를 입력해주세요.');
      return;
    }
    if (!form.productType) {
      setError('받고 싶은 상품을 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      const request: DigitalProductRequest = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        productType: form.productType,
        message: form.message.trim() || undefined,
      };
      await digitalProductService.requestProduct(request);
      setSubmitted(true);
      setTimeout(() => {
        setForm(initialForm);
        setSubmitted(false);
        setLoading(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      setError(message);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setSubmitted(false);
    setLoading(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up"
      style={{ animationDuration: '200ms' }}
    >
      <div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="card relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 animate-fade-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
          aria-label="닫기"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <svg
              className="mx-auto mb-3 h-6 w-6 text-accent-700"
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
            <p className="font-medium text-accent-800">신청해주셨습니다.</p>
            <p className="mt-1 text-sm text-accent-700">
              곧 이메일로 자료를 보내드리겠습니다.
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-2 font-display text-2xl font-semibold tracking-tight text-ink-900">
              디지털 상품 신청하기
            </h2>
            <p className="mb-6 text-[15px] text-ink-500">
              필요한 자료를 선택하시면 이메일로 보내드릴게요.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="dp-name" className="label-text">
                    이름
                  </label>
                  <input
                    id="dp-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="홍길동"
                    className="input-field"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="dp-email" className="label-text">
                    이메일
                  </label>
                  <input
                    id="dp-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="input-field"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dp-phone" className="label-text">
                  전화번호
                </label>
                <input
                  id="dp-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              <fieldset className="space-y-3">
                <legend className="label-text">받고 싶은 상품</legend>
                {productOptions.map((opt) => {
                  const checked = form.productType === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                        checked
                          ? 'border-accent-400 bg-accent-50/60 ring-2 ring-accent-100'
                          : 'border-ink-200/70 hover:bg-ink-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="productType"
                        value={opt.value}
                        checked={checked}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-4 w-4"
                      />
                      <div>
                        <span className="font-medium text-ink-900">
                          {opt.label}
                        </span>
                        <span className="ml-2 text-xs text-ink-500">
                          {opt.price}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </fieldset>

              <div>
                <label htmlFor="dp-message" className="label-text">
                  추가 메시지{' '}
                  <span className="font-normal text-ink-400">(선택)</span>
                </label>
                <textarea
                  id="dp-message"
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="원하시는 부분이나 궁금한 점을 알려주세요"
                  className="input-field resize-none"
                  disabled={loading}
                />
              </div>

              {error && (
                <p
                  className="text-sm font-medium text-rose-600"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className="btn-primary w-full sm:w-auto sm:px-7"
                >
                  {loading ? '신청 중...' : '신청하기'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DigitalProductModal;

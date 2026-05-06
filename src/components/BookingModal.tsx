import React, { useState, useEffect } from 'react';
import { bookingService, BookingRequest } from '../services/bookingService';

interface ServiceOption {
  value: string;
  label: string;
  price: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const serviceOptions: ServiceOption[] = [
  { value: 'resume', label: '이력서 첨삭', price: '5만원' },
  { value: 'interview', label: '모의 면접', price: '7만원' },
  { value: 'full', label: '종합 컨설팅', price: '20만원' },
];

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const initialBookingForm: BookingFormData = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
};

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [bookingForm, setBookingForm] = useState<BookingFormData>(initialBookingForm);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const isBookingValid =
    bookingForm.name.trim() !== '' &&
    bookingForm.email.trim() !== '' &&
    bookingForm.phone.trim() !== '' &&
    bookingForm.service !== '';

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isBookingValid) return;

    try {
      setBookingLoading(true);
      const request: BookingRequest = {
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        serviceType: bookingForm.service,
        message: bookingForm.message || undefined,
      };
      await bookingService.submitBooking(request);
      setBookingSubmitted(true);
      setTimeout(() => {
        setBookingForm(initialBookingForm);
        setBookingSubmitted(false);
        setBookingLoading(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Booking submission failed:', error);
      setBookingLoading(false);
    }
  };

  const handleClose = () => {
    setBookingForm(initialBookingForm);
    setBookingSubmitted(false);
    setBookingLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up"
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

        {bookingSubmitted ? (
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
            <p className="mt-1 text-sm text-accent-700">24시간 이내에 연락드리겠습니다.</p>
          </div>
        ) : (
          <>
            <h2 className="mb-2 font-display text-2xl font-semibold tracking-tight text-ink-900">
              1:1 컨설팅 신청하기
            </h2>
            <p className="mb-6 text-[15px] text-ink-500">
              1시간 맞춤 상담으로 당신의 취업을 함께 준비해보세요.
            </p>

            <form onSubmit={handleBookingSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="booking-name" className="label-text">
                    이름
                  </label>
                  <input
                    id="booking-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={bookingForm.name}
                    onChange={handleBookingChange}
                    placeholder="홍길동"
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="booking-email" className="label-text">
                    이메일
                  </label>
                  <input
                    id="booking-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={bookingForm.email}
                    onChange={handleBookingChange}
                    placeholder="example@email.com"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="booking-phone" className="label-text">
                  전화번호
                </label>
                <input
                  id="booking-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={bookingForm.phone}
                  onChange={handleBookingChange}
                  placeholder="010-1234-5678"
                  className="input-field"
                />
              </div>

              <fieldset className="space-y-3">
                <legend className="label-text">희망 서비스</legend>
                {serviceOptions.map((opt) => {
                  const checked = bookingForm.service === opt.value;
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
                        name="service"
                        value={opt.value}
                        checked={checked}
                        onChange={handleBookingChange}
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
                <label htmlFor="booking-message" className="label-text">
                  추가 메시지{' '}
                  <span className="font-normal text-ink-400">(선택)</span>
                </label>
                <textarea
                  id="booking-message"
                  name="message"
                  rows={4}
                  value={bookingForm.message}
                  onChange={handleBookingChange}
                  placeholder="궁금한 점이나 특별한 상황을 알려주세요"
                  className="input-field resize-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={!isBookingValid || bookingLoading}
                  className="btn-primary w-full sm:w-auto sm:px-7"
                >
                  {bookingLoading ? '신청 중...' : '신청하기'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

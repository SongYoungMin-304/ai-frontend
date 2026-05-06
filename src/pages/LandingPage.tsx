import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import DigitalProductModal from '../components/DigitalProductModal';
import FreeResourceForm from '../components/FreeResourceForm';

interface TrustMetric {
  value: string;
  label: string;
}

interface ServiceItem {
  title: string;
  description: string;
  pricing: string[];
  icon: React.ReactNode;
}

interface FaqItem {
  question: string;
  answer: string;
}

const trustMetrics: TrustMetric[] = [
  { value: '8년+', label: '현직 경력' },
  { value: '5개사', label: '대기업·스타트업' },
  { value: '90%+', label: '서류 합격률' },
  { value: '1:1', label: '맞춤 컨설팅' },
];

const services: ServiceItem[] = [
  {
    title: '1:1 컨설팅',
    description: '이력서 첨삭, 모의 면접, 종합 컨설팅까지 — 1:1로 깊이 있게.',
    pricing: ['이력서 첨삭 · 5만원', '모의 면접 · 7만원', '종합 컨설팅 · 20만원'],
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 3v-3H5a2 2 0 0 1-2-2V5z" />
        <path d="M7 8h6M7 11h4" />
      </svg>
    ),
  },
  {
    title: '디지털 상품',
    description: '이력서 템플릿, 면접 질문 모음, 연봉 협상 스크립트.',
    pricing: ['1만원 ~ 1.5만원'],
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 2h7l4 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
        <path d="M12 2v4h4" />
        <path d="M10 9v6m0 0l-2.5-2.5M10 15l2.5-2.5" />
      </svg>
    ),
  },
];

const freeResources: string[] = [
  '이력서 템플릿 3종 (주니어/경력직/포트폴리오)',
  '기술 면접 질문 TOP 20',
  '기술 스택 학습 로드맵',
];

const faqs: FaqItem[] = [
  {
    question: '비전공자도 가능한가요?',
    answer:
      '네. 부트캠프 출신이나 비전공자분들과 함께한 경험이 있습니다. 가장 중요한 건 현재 위치와 목표를 정확히 파악하는 것입니다.',
  },
  {
    question: '컨설팅은 어떻게 진행되나요?',
    answer:
      '신청 → 사전 자료 공유 → 화상 미팅(1시간 내외) → 후속 피드백 순으로 진행됩니다. 모의 면접은 실제 면접과 비슷한 환경에서 진행하고 녹화본을 함께 리뷰합니다.',
  },
  {
    question: '환불 정책이 있나요?',
    answer:
      '첫 컨설팅 이후 만족하지 못하시면 100% 환불해드립니다. 그만큼 자신 있습니다.',
  },
  {
    question: '어떤 회사 지원에 도움이 되나요?',
    answer:
      '대기업 SI, IT 서비스, 스타트업까지 5개 회사를 직접 거치며 다양한 채용 프로세스를 경험했습니다. 직무 관련 도메인이라면 도움드릴 수 있습니다.',
  },
];

const CheckIcon: React.FC = () => (
  <svg
    className="mt-0.5 h-5 w-5 shrink-0 text-accent-600"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 10.5l4 4 8-9" />
  </svg>
);

const ChevronIcon: React.FC = () => (
  <svg
    className="h-4 w-4 shrink-0 text-ink-400 transition-transform duration-300 ease-smooth"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 8l5 5 5-5" />
  </svg>
);

const LandingPage: React.FC = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDigitalProductModal, setShowDigitalProductModal] = useState(false);

  return (
    <div className="min-h-screen pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-6">
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-10 right-[-12%] h-72 w-72 rounded-full bg-gradient-to-br from-accent-100 via-accent-50 to-ink-50 opacity-80 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.10),transparent_55%)]"
            aria-hidden="true"
          />

          <div className="relative">
            <p
              className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-accent-600 animate-fade-up"
              style={{ animationDelay: '0ms' }}
            >
              IT 커리어 컨설팅
            </p>
            <h1
              className="font-display text-4xl font-semibold leading-[1.25] tracking-tight text-ink-900 sm:text-5xl sm:leading-[1.2] lg:text-6xl lg:leading-[1.15] animate-fade-up"
              style={{ animationDelay: '60ms' }}
            >
              주니어 개발자 취업,
              <br />
              혼자 준비하지 마세요
            </h1>
            <p
              className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-500 animate-fade-up"
              style={{ animationDelay: '120ms' }}
            >
              대기업 · 중견 · 스타트업을 모두 거친 8년차 현직 개발자가 이력서부터 면접, 연봉 협상까지 함께합니다.
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up"
              style={{ animationDelay: '180ms' }}
            >
              <a href="#free-resources" className="btn-primary">
                무료 이력서 템플릿 받기
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 10h10M11 6l4 4-4 4" />
                </svg>
              </a>
              <Link to="/about" className="btn-secondary">
                내 이력 보기
              </Link>
              <a
                href="https://open.kakao.com/o/s6C7fWqf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2C5.58 2 2 4.69 2 8c0 2.06 1.17 3.86 3 4.68V17l3.5-2.01c.62.08 1.26.13 1.9.13 4.42 0 8-2.69 8-6s-3.58-6-8-6z" />
                </svg>
                오픈카톡 상담
              </a>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trustMetrics.map((metric, idx) => (
              <div
                key={metric.label}
                className="card flex flex-col items-center justify-center px-4 py-7 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover animate-fade-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <span className="font-display text-3xl font-semibold tabular-nums text-ink-900">
                  {metric.value}
                </span>
                <span className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-500">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <header className="mb-10 animate-fade-up">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
              Services
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              이렇게 도와드립니다
            </h2>
            <p className="mt-2 text-[15px] text-ink-500">
              90% 이상의 서류 합격률을 바탕으로, 1:1 맞춤 컨설팅과 디지털 자료로 당신의 취업을 응원합니다.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {services.map((service, idx) => (
              <article
                key={service.title}
                className="card flex flex-col p-6 transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card-lift animate-fade-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  {service.icon}
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-1.5 border-t border-ink-100 pt-4">
                  {service.pricing.map((line) => (
                    <li
                      key={line}
                      className="text-[13px] font-medium text-ink-500"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
                {service.title === '1:1 컨설팅' && (
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="btn-primary w-full"
                    >
                      신청하기
                    </button>
                  </div>
                )}
                {service.title === '디지털 상품' && (
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => setShowDigitalProductModal(true)}
                      className="btn-secondary w-full"
                    >
                      자료 신청하기
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
        <DigitalProductModal
          isOpen={showDigitalProductModal}
          onClose={() => setShowDigitalProductModal(false)}
        />

        <section id="free-resources" className="mt-24 scroll-mt-24">
          <header className="mb-10 animate-fade-up">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
              Free
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              먼저 무료로 받아보세요
            </h2>
            <p className="mt-2 text-[15px] text-ink-500">
              이메일만 남기시면 바로 보내드립니다.
            </p>
          </header>

          <div className="card relative overflow-hidden p-8 sm:p-10 animate-fade-up">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-accent-100 via-accent-50 to-transparent blur-2xl"
              aria-hidden="true"
            />
            <div className="relative">
              <ul className="space-y-3">
                {freeResources.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-700"
                  >
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <FreeResourceForm className="mt-7" />
            </div>
          </div>
        </section>

        <section className="mt-24">
          <header className="mb-8 animate-fade-up">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
              FAQ
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              자주 묻는 질문
            </h2>
          </header>

          <div className="card overflow-hidden px-6 sm:px-8 animate-fade-up">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-b border-ink-200/70 last:border-b-0 [&[open]>summary>svg]:rotate-180"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-semibold text-ink-900 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px]">{faq.question}</span>
                  <ChevronIcon />
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-ink-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-10 py-12 text-white shadow-card-lift sm:px-14 sm:py-16">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-500/30 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-700/30 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                지금 시작하세요
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-300">
                무료 상담으로 부담 없이 첫 단계를 떼어보세요.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#free-resources"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 transition-all duration-200 ease-smooth hover:bg-ink-100 hover:shadow-card-hover active:scale-[0.98]"
                >
                  무료 자료 받기
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 10h10M11 6l4 4-4 4" />
                  </svg>
                </a>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-smooth hover:bg-white/10"
                >
                  내 소개 보기
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;

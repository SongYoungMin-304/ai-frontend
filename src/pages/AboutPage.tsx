import React from 'react';
import { Link } from 'react-router-dom';

interface CareerEntry {
  period: string;
  company: string;
  tag: string;
  current?: boolean;
}

interface Strength {
  title: string;
  description: string;
}

const career: CareerEntry[] = [
  {
    period: '2026.04 ~ 현재',
    company: '물류·배송 플랫폼',
    tag: '대기업 · 백엔드',
    current: true,
  },
  {
    period: '2024.04 ~ 2026.04',
    company: '여행·숙박 O2O',
    tag: 'IT 서비스 · 백엔드',
  },
  {
    period: '2022.07 ~ 2024.04',
    company: '대기업 IT 계열사',
    tag: '대기업 · 시스템 개발',
  },
  {
    period: '2019.01 ~ 2022.04',
    company: '마케팅 플랫폼',
    tag: 'B2B 솔루션 · 백엔드',
  },
  {
    period: '2018.08 ~ 2019.01',
    company: '금융정보 인턴',
    tag: '인턴 · 데이터 분석',
  },
];

const strengths: Strength[] = [
  {
    title: '대기업 시스템 트랙',
    description:
      '대기업 SI 환경에서의 복잡한 시스템 개발, 면접 검증, 프로세스를 직접 경험했습니다.',
  },
  {
    title: '스타트업/IT 서비스 트랙',
    description:
      'O2O, B2B 등 빠른 속도의 서비스 회사에서 실무 중심 개발과 채용 문화를 경험했습니다.',
  },
  {
    title: '인턴부터 정직원까지',
    description:
      '인턴 신분부터 정직원으로 성장한 경로 — 첫 취업의 불안감과 그 이후 커리어 고민을 누구보다 잘 압니다.',
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-16 animate-fade-up">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-600">
            About
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-ink-900 sm:text-5xl">
            8년의 실무 경험,
            <br />5개 회사의 채용 인사이트
          </h1>
           <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
             대기업·스타트업·O2O 등 다양한 환경에서 직접 경험한 채용 프로세스와 기술 면접, 합격 전략을 나눕니다.
           </p>
        </header>

        <section>
          <header className="mb-8 animate-fade-up">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
              Career
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              경력
            </h2>
          </header>

          <div className="relative">
            <div
              className="absolute bottom-2 left-4 top-2 w-px bg-ink-200"
              aria-hidden="true"
            />
            <ol className="space-y-8">
              {career.map((entry, idx) => (
                <li
                  key={entry.company}
                  className="relative flex gap-6 pl-12 animate-fade-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <span
                    className={`absolute left-[10px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white ${
                      entry.current ? 'bg-accent-600' : 'bg-accent-500'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <p className="font-mono text-xs uppercase tracking-wider text-ink-500">
                      {entry.period}
                    </p>
                    <h3 className="mt-1 flex flex-wrap items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink-900">
                      {entry.company}
                      {entry.current && (
                        <span className="inline-flex rounded-full bg-accent-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent-700">
                          현재
                        </span>
                      )}
                    </h3>
                    <span className="mt-2 inline-flex rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">
                      {entry.tag}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-24">
          <header className="mb-8 animate-fade-up">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
              Strengths
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              이런 분들과 함께했습니다
            </h2>
           <p className="mt-2 text-[15px] text-ink-500">
               다양한 조직 문화와 채용 패턴을 직접 경험했기에, 당신의 강점을 어떻게 어필할지 알고 있습니다.
             </p>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {strengths.map((item, idx) => (
              <article
                key={item.title}
                className="card flex flex-col p-6 transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card-lift animate-fade-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <span
                  className="font-display text-3xl font-semibold tabular-nums text-accent-600"
                  aria-hidden="true"
                >
                  0{idx + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <div className="card relative overflow-hidden p-8 sm:p-10">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-accent-100 via-accent-50 to-transparent blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
                  함께 다음 단계를 만들어요
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-500">
                  무료 자료부터 1:1 컨설팅까지 — 지금 가장 필요한 것부터 시작하세요.
                </p>
              </div>
              <Link to="/" className="btn-primary shrink-0">
                서비스 보러가기
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
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;

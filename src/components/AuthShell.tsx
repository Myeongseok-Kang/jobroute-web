import Link from "next/link";
import { Sparkles, Target, FileCheck2 } from "lucide-react";
import { Logo } from "./Logo";

const HIGHLIGHTS = [
  {
    icon: Target,
    title: "AI 하이브리드 매칭",
    desc: "임베딩 + 키워드 + 가중치로 정확하게",
  },
  {
    icon: FileCheck2,
    title: "자소서·면접 준비",
    desc: "RAG를 활용한 자소서 작성·첨삭, 면접 질문까지",
  },
  {
    icon: Sparkles,
    title: "맞춤 공고 알림",
    desc: "내 이력서에 맞는 새 공고를 매일 메일로",
  },
];

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-violet-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-grid opacity-[0.07]" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div
          className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl animate-blob"
          style={{ animationDelay: "6s" }}
        />

        <Link href="/" className="relative">
          <span className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
                <circle cx="6" cy="6" r="2.4" fill="currentColor" />
                <circle cx="18" cy="18" r="2.4" fill="currentColor" />
                <path
                  d="M6 8.5v3.5a3 3 0 0 0 3 3h6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-lg font-extrabold text-white">JobRoute</span>
          </span>
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight text-white">
            흩어진 공고를 한곳에서,
            <br />
            나에게 꼭 맞는 길을 찾다.
          </h2>
          <p className="mt-4 max-w-md text-brand-100">
            전국 IT 직무 채용 공고를 한곳에 모으고, AI가 당신의 경력과 스킬에
            맞는 자리를 추천합니다.
          </p>
          <div className="mt-10 space-y-4">
            {HIGHLIGHTS.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.title}
                  className="flex items-start gap-3.5 animate-fade-in-up"
                  style={{ animationDelay: `${150 + i * 120}ms` }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur transition-transform hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-white">{h.title}</p>
                    <p className="text-sm text-brand-100">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative text-xs text-brand-200">
          © 2026 JobRoute. AI 채용 매칭 플랫폼.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8 lg:hidden">
            <Logo />
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-violet-50 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-soft">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium leading-snug text-ink-600">
                AI 하이브리드 매칭으로 딱 맞는 자리를 찾아드려요
              </p>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

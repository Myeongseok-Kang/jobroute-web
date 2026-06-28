"use client";

import Link from "next/link";
import {
  Sparkles,
  Search,
  FileText,
  PenLine,
  MessageSquareText,
  Bell,
  ArrowRight,
  Target,
  Layers,
  Brain,
  CheckCircle2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ScoreRing";
import { Reveal } from "@/components/Reveal";

const FEATURES = [
  {
    icon: Search,
    title: "통합 공고 탐색",
    desc: "전국에 흩어진 IT 채용 공고를 한곳에서 검색하고 북마크하세요.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "AI 하이브리드 매칭",
    desc: "임베딩·키워드 유사도에 가중치를 결합해 진짜 잘 맞는 공고를 추천해요.",
    color: "from-brand-500 to-violet-500",
  },
  {
    icon: PenLine,
    title: "AI 자소서 첨삭",
    desc: "합격 자소서를 검색·참고(RAG)해 AI가 초안을 만들고, 내 글을 첨삭해드려요.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: MessageSquareText,
    title: "맞춤 면접 질문",
    desc: "공고와 이력서를 분석해 예상 면접 질문과 준비 팁을 생성해요.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: FileText,
    title: "이력서 관리",
    desc: "여러 버전의 이력서를 저장하고 매칭·자소서·면접에 바로 활용하세요.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Bell,
    title: "매일 공고 알림",
    desc: "내 이력서에 맞는 새 공고를 매일 오전 9시 이메일로 받아보세요.",
    color: "from-indigo-500 to-blue-500",
  },
];

const STEPS = [
  {
    icon: Layers,
    title: "공고 통합",
    desc: "전국의 IT 직무 공고를 한 화면에 모아 비교합니다.",
  },
  {
    icon: Brain,
    title: "AI 분석",
    desc: "이력서 또는 텍스트·조건을 임베딩해 의미 기반으로 유사한 공고를 찾습니다.",
  },
  {
    icon: Target,
    title: "맞춤 추천",
    desc: "추천 이유와 함께, 합격까지 필요한 준비를 도와드립니다.",
  },
];

const VALUE_STRIP = [
  { icon: Brain, title: "하이브리드 매칭", sub: "임베딩 + 키워드 + 가중치" },
  { icon: FileText, title: "합격 자소서 RAG", sub: "실제 합격 사례 분석" },
  { icon: MessageSquareText, title: "맞춤 면접 질문", sub: "이력서 갭 분석" },
  { icon: Bell, title: "매일 공고 알림", sub: "새 공고를 메일로" },
];

export default function HomePage() {
  return (
    <div>
      <Link
        href="/feedback"
        className="block bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-95"
      >
        🎁 후기 남기고 네이버페이·싸이버거 받기 · 6/28~7/31 이벤트 진행 중 →
      </Link>
      <section className="relative overflow-hidden bg-aurora">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl animate-blob" />
        <div
          className="pointer-events-none absolute -right-16 top-28 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl animate-blob"
          style={{ animationDelay: "5s" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-brand-200 bg-gradient-to-r from-brand-50 to-violet-50 px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              <Sparkles className="h-4 w-4" />
              AI 하이브리드 검색 기반 채용 매칭
            </div>
            <h1 className="animate-fade-in text-[2.6rem] font-extrabold leading-[1.07] tracking-tight text-ink-900 sm:text-7xl">
              흩어진 IT 채용 공고,
              <br />
              <span className="text-gradient-animate">AI가 당신의 길</span>을
              찾아드려요
            </h1>
            <p className="mx-auto mt-6 max-w-3xl animate-fade-in text-base text-ink-600 sm:text-lg">
              임베딩과 키워드 유사도, 가중치를 결합한 하이브리드 매칭으로
              <br />
              전국에 흩어진 IT 공고에서 딱 맞는 자리를 추천받고,
              <br />
              실제 합격 자소서를 분석한 AI로 자소서 작성과 면접까지 한 번에 끝내세요.
            </p>
            <div className="mt-9 flex animate-fade-in flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/matching">
                <Button size="lg" className="w-full sm:w-auto">
                  AI 매칭 시작하기
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  공고 둘러보기
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex animate-fade-in flex-col items-center justify-center gap-2 text-sm text-ink-600">
              <span className="text-ink-500">원하는 방식으로 시작하세요</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { icon: FileText, label: "이력서 작성" },
                  { icon: PenLine, label: "텍스트 입력" },
                  { icon: Layers, label: "조건 선택" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1 font-medium text-ink-700 shadow-soft"
                  >
                    <Icon className="h-3.5 w-3.5 text-brand-500" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 flex animate-fade-in flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-500">
              {["모든 기능 무료", "전국 IT 공고 통합", "AI 매칭", "자소서·면접 준비"].map(
                (t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-4xl animate-fade-in">
            <div className="rounded-3xl border border-white/60 bg-white/70 p-2 shadow-lift backdrop-blur">
              <div className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-ink-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-brand-500" />
                    <span className="font-bold text-ink-900">매칭 결과 미리보기</span>
                  </div>
                  <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">
                    상위 20건 추천
                  </span>
                </div>
                <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/50 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-ink-700">
                    <UserRound className="h-3.5 w-3.5 text-brand-500" />
                    입력한 조건
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[
                      "백엔드 엔지니어",
                      "경력 3년",
                      "NestJS · PostgreSQL · AWS",
                      "정규직 희망",
                      "서울",
                    ].map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-ink-200 bg-white px-2.5 py-0.5 text-xs text-ink-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <PreviewMatch
                    title="백엔드 엔지니어 (Node.js)"
                    company="테크스타트업 A"
                    score={0.92}
                    reason="보유하신 NestJS·PostgreSQL 실무 경험이 핵심 요구사항과 정확히 일치합니다. 공고가 중요하게 본 '대용량 트래픽 처리'와 'RESTful API 설계' 경험이 이력서에 드러나 가산점을 받았어요. 우대사항인 AWS 인프라 경험을 자소서에서 한 번 더 강조하면 적합도가 더 올라갈 수 있어요."
                  />
                  <PreviewMatch
                    title="풀스택 개발자"
                    company="핀테크 B"
                    score={0.84}
                    reason="3년 경력 조건과 React 프론트엔드 역량이 잘 맞습니다. 요구되는 TypeScript·상태관리(Redux) 경험이 확인됐고, 백엔드 협업 경험도 강점으로 평가됐어요. TDD·테스트 코드 작성 경험을 추가로 어필하면 상위 후보로 올라설 가능성이 높습니다."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink-200/60 bg-white">
        <Reveal>
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-ink-100 sm:divide-x lg:grid-cols-4">
            {VALUE_STRIP.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex items-center gap-3 px-6 py-6 transition-colors hover:bg-ink-50/60">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink-900">
                      {v.title}
                    </p>
                    <p className="truncate text-xs text-ink-500">{v.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-500">
            <span className="h-1 w-6 rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
            올인원 구직 도구
            <span className="h-1 w-6 rounded-full bg-gradient-to-r from-violet-500 to-brand-500" />
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            구직의 모든 단계를 함께
          </h2>
          <p className="mt-4 text-ink-600">
            공고 탐색부터 매칭, 자소서, 면접 준비까지. 필요한 도구를 한곳에
            모았어요.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 70}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-card">
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${f.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  <div
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-500">
              <span className="h-1 w-6 rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
              How it works
              <span className="h-1 w-6 rounded-full bg-gradient-to-r from-violet-500 to-brand-500" />
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              세 걸음이면 충분해요
            </h2>
          </Reveal>
          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal
                  key={s.title}
                  delay={i * 90}
                  className="relative text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-glow transition-transform duration-300 hover:scale-105">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="mx-auto mt-4 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-500">{s.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-violet-700 px-6 py-16 text-center shadow-lift sm:px-16">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-blob" />
            <div
              className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl animate-blob"
              style={{ animationDelay: "6s" }}
            />
            <div className="relative">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              지금 바로 나에게 맞는 공고를 찾아보세요
            </h2>
            <p className="mx-auto mt-4 max-w-xl break-keep text-brand-100">
              AI가 당신의 다음 커리어를 안내해드릴게요.
            </p>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2.5">
              {["이력서·텍스트·조건 중 선택", "AI 공고 매칭", "자소서·면접 준비", "직무 지원"].map(
                (step, i, arr) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[13px] font-semibold text-white backdrop-blur">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-[10px] font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-brand-200" />
                    )}
                  </div>
                )
              )}
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full !bg-none !bg-white !text-brand-700 shadow-soft hover:!bg-brand-50 sm:w-auto"
                >
                  무료로 시작하기
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/matching">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full text-white hover:bg-white/10 sm:w-auto"
                >
                  먼저 매칭 체험하기
                </Button>
              </Link>
            </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function PreviewMatch({
  title,
  company,
  score,
  reason,
}: {
  title: string;
  company: string;
  score: number;
  reason: string;
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
      <div className="flex items-start gap-3">
        <ScoreRing score={score} size={48} stroke={4} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink-900">{title}</p>
          <p className="text-xs text-ink-500">{company}</p>
        </div>
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-ink-600">{reason}</p>
    </div>
  );
}

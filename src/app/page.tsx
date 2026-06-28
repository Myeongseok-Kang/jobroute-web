"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  FileText,
  PenLine,
  MessageSquareText,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
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

const HERO_EXAMPLES = [
  {
    label: "신입 백엔드",
    value:
      "신입 백엔드 개발자입니다. Java와 Spring을 공부했고, 서울에서 첫 직장을 찾고 있어요.",
  },
  {
    label: "3년차 프론트엔드",
    value:
      "3년차 프론트엔드 개발자입니다. React와 TypeScript를 주로 썼고, 핀테크나 커머스 도메인에 관심이 있어요.",
  },
  {
    label: "데이터·ML 신입",
    value:
      "Python으로 데이터 분석과 머신러닝을 공부한 신입입니다. 데이터 관련 직무로 취업하고 싶어요.",
  },
  {
    label: "DevOps·인프라",
    value:
      "AWS와 Docker, Kubernetes 경험이 있는 4년차 인프라 엔지니어입니다. DevOps 포지션을 찾고 있어요.",
  },
  {
    label: "비전공 전향",
    value:
      "비전공이지만 부트캠프를 수료하고 웹 개발자로 취업을 준비 중입니다. 신입 가능한 포지션을 찾고 있어요.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const startMatching = () => {
    const q = query.trim();
    if (q) sessionStorage.setItem("jobroute_prefill", q);
    router.push("/matching");
  };

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
        <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-brand-200 bg-gradient-to-r from-brand-50 to-violet-50 px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            AI 하이브리드 검색 기반 채용 매칭
          </div>
          <h1 className="animate-fade-in break-keep text-[2.6rem] font-extrabold leading-[1.12] tracking-tight text-ink-900 sm:text-6xl">
            흩어진 IT 채용 공고,
            <br />
            <span className="text-gradient-animate">AI가 당신의 길</span>을 찾아드려요
          </h1>
          <p className="mx-auto mt-5 max-w-xl animate-fade-in text-balance break-keep text-base text-ink-600 sm:text-lg">
            경력과 기술만 적으면 AI가 딱 맞는 IT 공고를 찾아드려요.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              startMatching();
            }}
            className="mx-auto mt-8 max-w-3xl animate-fade-in text-left"
          >
            <div className="rounded-2xl border border-ink-200/70 bg-white p-2 shadow-lift">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                placeholder="예) 3년차 백엔드 개발자입니다. NestJS와 PostgreSQL을 주로 썼고, 핀테크 백엔드 포지션을 찾고 있어요."
                className="w-full resize-none break-keep rounded-xl bg-transparent px-4 py-3 text-sm leading-relaxed text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              <div className="flex items-center justify-between gap-2 px-2 pb-1">
                <span className="hidden text-xs text-ink-400 sm:block">
                  이력서가 없어도 자유롭게 적어보세요
                </span>
                <Button type="submit" className="ml-auto">
                  <Sparkles className="h-4 w-4" />
                  AI로 공고 찾기
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="mb-2 text-xs font-medium text-ink-400">
                이렇게 적어보세요 (눌러서 채우기)
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {HERO_EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => setQuery(ex.value)}
                    className="break-keep rounded-full border border-ink-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-600 backdrop-blur transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 active:scale-95"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            공고 찾기부터 합격까지, 한곳에서
          </h2>
          <p className="mt-4 text-ink-600">
            매칭, 자소서, 면접 준비까지 구직에 필요한 도구를 모았어요.
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

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-violet-700 px-6 py-14 text-center shadow-lift sm:px-16">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="relative">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                지금 바로 나에게 맞는 공고를 찾아보세요
              </h2>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/matching">
                  <Button
                    size="lg"
                    className="w-full !bg-none !bg-white !text-brand-700 shadow-soft hover:!bg-brand-50 sm:w-auto"
                  >
                    AI 매칭 시작하기
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full text-white hover:bg-white/10 sm:w-auto"
                  >
                    공고 둘러보기
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

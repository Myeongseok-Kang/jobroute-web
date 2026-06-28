"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Type,
  SlidersHorizontal,
  FileText,
  Plus,
  X,
  Search,
  Frown,
} from "lucide-react";
import { matchingApi, resumeApi, ApiError } from "@/lib/api";
import type { MatchResult, Resume } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PageContainer, PageHeader } from "@/components/AuthGuard";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, ThinkingState, EmptyState } from "@/components/ui/Misc";
import { MatchResultView } from "@/components/MatchCard";
import {
  REGIONS,
  JOB_CATEGORIES,
  CAREER_OPTIONS,
  EMPLOYMENT_OPTIONS,
  SKILL_SUGGESTIONS,
  SKILL_SUGGESTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type TabKey = "text" | "conditions" | "resume";

const TEXT_EXAMPLES = [
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

const REGION_OPTIONS = [
  { value: "", label: "전체 지역" },
  ...REGIONS.map((r) => ({ value: r, label: r })),
];

function parseCareer(career: string): number | undefined {
  if (!career) return undefined;
  if (/신입|무관/.test(career)) return 0;
  const m = career.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : undefined;
}

export default function MatchingPage() {
  const { isAuthed } = useAuth();
  const toast = useToast();

  const [tab, setTab] = useState<TabKey>("text");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const [region, setRegion] = useState("");

  const [text, setText] = useState("");

  const [jobCategory, setJobCategory] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [career, setCareer] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [selectedResume, setSelectedResume] = useState("");

  useEffect(() => {
    if (tab === "resume" && isAuthed) {
      setResumeLoading(true);
      resumeApi
        .list()
        .then((rs) => {
          setResumes(rs);
          if (rs.length > 0) setSelectedResume((prev) => prev || rs[0].id);
        })
        .catch(() => {})
        .finally(() => setResumeLoading(false));
    }
  }, [tab, isAuthed]);

  const addSkill = (s: string) => {
    const v = s.trim();
    if (!v || skills.includes(v)) return;
    setSkills((prev) => [...prev, v]);
    setSkillInput("");
  };

  const runMatch = async () => {
    setLoading(true);
    setResult(null);
    try {
      let res: MatchResult;
      if (tab === "text") {
        if (text.trim().length < 10) {
          toast.error("내용을 충분히 입력해주세요 (10글자 이상)");
          setLoading(false);
          return;
        }
        res = await matchingApi.byText({
          text: text.trim(),
          userCareer: parseCareer(career),
          employmentType: employmentType || undefined,
          region: region || undefined,
          limit: 20,
        });
      } else if (tab === "conditions") {
        if (!jobCategory && skills.length === 0) {
          toast.error("직무 또는 스킬을 하나 이상 선택해주세요");
          setLoading(false);
          return;
        }
        res = await matchingApi.byConditions({
          jobCategory: jobCategory || undefined,
          skills: skills.length ? skills : undefined,
          career: career || undefined,
          employmentType: employmentType || undefined,
          region: region || undefined,
          limit: 20,
        });
      } else {
        if (!selectedResume) {
          toast.error("이력서를 선택해주세요");
          setLoading(false);
          return;
        }
        res = await matchingApi.byResume(selectedResume, {
          userCareer: parseCareer(career),
          employmentType: employmentType || undefined,
          region: region || undefined,
          limit: 20,
        });
      }
      setResult(res);
      if (res.recommended.length === 0 && res.moreCandidates.length === 0) {
        toast.info("조건에 맞는 공고를 찾지 못했어요");
      } else {
        toast.success("매칭이 완료되었어요!");
        setTimeout(
          () =>
            document
              .getElementById("match-result")
              ?.scrollIntoView({ behavior: "smooth", block: "start" }),
          100
        );
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "매칭에 실패했어요"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="AI 매칭"
        title="나에게 맞는 공고를 찾아드릴게요"
        description="자유 텍스트·조건 선택·저장된 이력서 중 편한 방법으로 매칭해보세요."
      />

      <Card className="overflow-visible">
        <Tabs
          items={[
            { value: "text", label: "자유 텍스트", icon: <Type className="h-4 w-4" /> },
            {
              value: "conditions",
              label: "조건 선택",
              icon: <SlidersHorizontal className="h-4 w-4" />,
            },
            {
              value: "resume",
              label: "저장된 이력서",
              icon: <FileText className="h-4 w-4" />,
            },
          ]}
          value={tab}
          onChange={(v) => setTab(v as TabKey)}
        />

        <div className="mt-6">
          {tab === "text" && (
            <div className="space-y-4">
              <Textarea
                label="어떤 일을 찾고 있나요?"
                placeholder="예) 3년차 백엔드 개발자입니다. NestJS와 PostgreSQL을 주로 사용했고, MSA 환경에서 결제 시스템을 개발했습니다. 핀테크나 커머스 도메인의 백엔드 포지션을 찾고 있어요."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                error={
                  text.trim().length > 0 && text.trim().length < 10
                    ? `내용을 충분히 입력해주세요 (10글자 이상 · 현재 ${text.trim().length}글자)`
                    : undefined
                }
                hint="경력, 기술 스택, 희망 도메인 등을 자유롭게 적을수록 정확해져요."
              />
              <div>
                <p className="mb-2 text-xs font-semibold text-ink-500">
                  예시로 빠르게 시작해보세요
                </p>
                <div className="flex flex-wrap gap-2">
                  {TEXT_EXAMPLES.map((ex) => (
                    <button
                      key={ex.label}
                      type="button"
                      onClick={() => setText(ex.value)}
                      className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 active:scale-95"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "conditions" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3">
                <p className="text-sm text-ink-600">랜덤 조건으로 채워보기</p>
                <button
                  type="button"
                  onClick={() => {
                    const pick = (arr: string[]) =>
                      arr[Math.floor(Math.random() * arr.length)];
                    setJobCategory(pick(JOB_CATEGORIES));
                    setRegion(pick(REGIONS));
                    setCareer(pick(CAREER_OPTIONS));
                    setEmploymentType(pick(EMPLOYMENT_OPTIONS));
                    setSkills(
                      [...SKILL_SUGGESTIONS]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)
                    );
                  }}
                  className="shrink-0 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700 active:scale-95"
                >
                  랜덤 채우기
                </button>
              </div>
              <Select
                label="직무"
                value={jobCategory}
                onChange={(e) => setJobCategory(e.target.value)}
                options={[
                  { value: "", label: "직무 선택" },
                  ...JOB_CATEGORIES.map((c) => ({ value: c, label: c })),
                ]}
              />

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                  보유 스킬
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill(skillInput);
                        }
                      }}
                      placeholder="스킬 입력 후 Enter (예: React)"
                      className="h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => addSkill(skillInput)}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                    추가
                  </Button>
                </div>

                {skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 py-1 pl-3 pr-1.5 text-sm font-semibold text-brand-700"
                      >
                        {s}
                        <button
                          onClick={() =>
                            setSkills((prev) => prev.filter((x) => x !== s))
                          }
                          className="rounded p-0.5 text-brand-400 hover:bg-brand-100 hover:text-brand-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s))
                      .slice(0, 40)
                      .map((s) => (
                        <button
                          key={s}
                          onClick={() => addSkill(s)}
                          className="rounded-lg border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-500 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                        >
                          + {s}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "resume" && (
            <div>
              {!isAuthed ? (
                <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-10 text-center">
                  <p className="text-sm text-ink-600">
                    저장된 이력서로 매칭하려면 로그인이 필요해요.
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Link href="/login?redirect=/matching">
                      <Button size="sm">로그인</Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" variant="secondary">
                        회원가입
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : resumeLoading ? (
                <div className="space-y-2">
                  {[0, 1].map((i) => (
                    <div key={i} className="skeleton h-16 rounded-xl" />
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-10 text-center">
                  <p className="text-sm text-ink-600">
                    저장된 이력서가 없어요. 먼저 이력서를 작성해주세요.
                  </p>
                  <Link href="/resume" className="mt-4 inline-block">
                    <Button size="sm">이력서 작성하기</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <label className="mb-1 block text-sm font-semibold text-ink-700">
                    매칭에 사용할 이력서
                  </label>
                  {resumes.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedResume(r.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition",
                        selectedResume === r.id
                          ? "border-brand-300 bg-brand-50/60 ring-2 ring-brand-100"
                          : "border-ink-200 bg-white hover:border-ink-300"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                          selectedResume === r.id
                            ? "border-brand-500 bg-brand-500"
                            : "border-ink-300"
                        )}
                      >
                        {selectedResume === r.id && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>
                      <FileText className="h-5 w-5 shrink-0 text-ink-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink-900">
                          {r.title || "제목 없는 이력서"}
                        </p>
                        <p className="truncate text-xs text-ink-500">
                          {r.content.slice(0, 60)}…
                        </p>
                      </div>
                    </button>
                  ))}
                  <p className="pt-1 text-xs text-ink-400">
                    이 매칭은 마이페이지 &gt; 매칭 이력에 자동 저장됩니다.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Region + submit */}
          <div className="mt-6 border-t border-ink-100 pt-5">
            <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-brand-600">
              <Sparkles className="h-3.5 w-3.5" />
              선택하면 매칭이 더 정확해져요
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <Select
                label="희망 지역"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                options={REGION_OPTIONS}
              />
              <Select
                label="경력"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                options={[
                  { value: "", label: "전체" },
                  ...CAREER_OPTIONS.map((c) => ({ value: c, label: c })),
                ]}
              />
              <Select
                label="고용형태"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                options={[
                  { value: "", label: "전체" },
                  ...EMPLOYMENT_OPTIONS.map((c) => ({ value: c, label: c })),
                ]}
              />
            </div>
            <Button
              size="lg"
              onClick={runMatch}
              loading={loading}
              className="sm:ml-auto sm:min-w-44"
              disabled={tab === "resume" && (!isAuthed || resumes.length === 0)}
            >
              <Sparkles className="h-5 w-5" />
              AI 매칭 실행
            </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Result */}
      <div id="match-result" className="mt-8 scroll-mt-24">
        {loading && (
          <ThinkingState title="딱 맞는 공고를 찾고 있어요" />
        )}
        {!loading && result && (
          <>
            {result.recommended.length === 0 &&
            result.moreCandidates.length === 0 ? (
              <EmptyState
                icon={<Frown className="h-7 w-7" />}
                title="매칭되는 공고가 없어요"
                description="조건을 조금 더 넓히거나 다른 키워드로 시도해보세요."
              />
            ) : (
              <MatchResultView
                recommended={result.recommended}
                moreCandidates={result.moreCandidates}
                total={result.total}
              />
            )}
          </>
        )}
        {!loading && !result && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/50 px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-ink-800">
              매칭 결과가 여기에 표시돼요
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-ink-500">
              위에서 입력 방식을 선택하고 AI 매칭을 실행해보세요.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

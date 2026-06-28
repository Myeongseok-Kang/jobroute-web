"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  PenLine,
  Wand2,
  ClipboardCheck,
  Copy,
  Check,
  ThumbsUp,
  Lightbulb,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { coverLetterApi, jobsApi, ApiError } from "@/lib/api";
import type {
  CoverLetterDraft,
  CoverLetterReview,
  Job,
} from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PageContainer, PageHeader } from "@/components/AuthGuard";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Card, ThinkingState } from "@/components/ui/Misc";
import { JobPicker } from "@/components/JobPicker";
import { ReferencedSamples } from "@/components/ReferencedSamples";
import { ResumeSelect } from "@/components/ResumeSelect";

type TabKey = "draft" | "review";

const SAMPLE_COVER_LETTER = `저는 사용자가 겪는 문제를 끝까지 파고들어 해결하는 백엔드 개발자입니다.

이전 프로젝트에서 결제 시스템의 응답 지연 문제를 맡았습니다. 원인을 추적해보니 매 요청마다 외부 API를 중복 호출하는 구조였고, Redis 캐시를 도입해 호출을 40% 줄이고 평균 응답속도를 1.2초에서 0.3초로 개선했습니다.

또한 외부 API 장애가 전체 서비스로 번지는 것을 막기 위해 서킷 브레이커를 적용하고, 핵심 로직에 단위 테스트를 작성해 안정성을 보장했습니다.

입사 후에는 단순히 기능을 구현하는 것을 넘어, 비용과 안정성까지 함께 고민하는 백엔드 엔지니어로 기여하고 싶습니다.`;

function CoverLetterInner() {
  const params = useSearchParams();
  const { isAuthed } = useAuth();
  const toast = useToast();

  const [tab, setTab] = useState<TabKey>("draft");

  const [job, setJob] = useState<Job | null>(null);
  const [resumeId, setResumeId] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [draft, setDraft] = useState<CoverLetterDraft | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);

  const [content, setContent] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [review, setReview] = useState<CoverLetterReview | null>(null);

  useEffect(() => {
    const jobId = params.get("jobId");
    if (jobId) {
      jobsApi
        .detail(jobId)
        .then(setJob)
        .catch(() => {});
    }
  }, [params]);

  const generateDraft = async () => {
    if (!job) {
      toast.error("자소서를 작성할 공고를 선택해주세요");
      return;
    }
    if (!isAuthed) {
      toast.info("자소서 초안 생성은 로그인 후 이용할 수 있어요");
      return;
    }
    if (!resumeId) {
      toast.error("초안 생성에 사용할 이력서를 선택해주세요");
      return;
    }
    setDraftLoading(true);
    setDraft(null);
    setDraftError(null);
    try {
      const res = await coverLetterApi.draft(job.id, resumeId);
      if (res.error) {
        setDraftError(res.error);
        toast.error(res.error);
        return;
      }
      setDraft(res);
      toast.success("자소서 초안을 생성했어요");
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "초안 생성에 실패했어요";
      setDraftError(msg);
      toast.error(msg);
    } finally {
      setDraftLoading(false);
    }
  };

  const runReview = async () => {
    if (content.trim().length < 10) {
      toast.error("첨삭할 자소서를 10자 이상 입력해주세요");
      return;
    }
    setReviewLoading(true);
    setReview(null);
    try {
      const res = await coverLetterApi.review({ content });
      setReview(res);
      toast.success("첨삭이 완료되었어요");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "첨삭에 실패했어요");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="자소서 도우미"
        title="합격 자소서 기반 AI 자소서"
        description="실제 합격 자소서를 분석한 AI가 초안을 써드리고, 직접 쓴 글은 첨삭해드려요."
      />

      <Tabs
        items={[
          { value: "draft", label: "초안 생성", icon: <Wand2 className="h-4 w-4" /> },
          {
            value: "review",
            label: "자소서 첨삭",
            icon: <ClipboardCheck className="h-4 w-4" />,
          },
        ]}
        value={tab}
        onChange={(v) => setTab(v as TabKey)}
        className="mb-6"
      />

      {tab === "draft" ? (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card>
              <h3 className="flex items-center gap-2 font-bold text-ink-900">
                <PenLine className="h-4 w-4 text-brand-500" />
                공고 선택
              </h3>
              <p className="mt-1 text-xs text-ink-500">
                선택한 공고와 이력서를 바탕으로 초안을 만들어요. 이력서가 필요해요.
              </p>
              <div className="mt-4">
                <JobPicker selected={job} onSelect={setJob} />
              </div>
              <div className="mt-4">
                <ResumeSelect
                  value={resumeId}
                  onChange={setResumeId}
                  loginRedirect="/cover-letter"
                />
              </div>
              <Button
                fullWidth
                size="lg"
                className="mt-4"
                onClick={generateDraft}
                loading={draftLoading}
                disabled={!job || !resumeId}
              >
                <Wand2 className="h-5 w-5" />
                자소서 초안 생성
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {draftLoading ? (
              <ThinkingState
                title="자소서 초안을 작성하고 있어요"
                steps={[
                  "유사한 합격 자소서를 검색하고 있어요",
                  "공고와 이력서를 분석하고 있어요",
                  "지원동기·직무역량·포부를 작성하고 있어요",
                ]}
              />
            ) : draft ? (
              <div className="animate-fade-in space-y-4">
                <DraftSection
                  title="지원동기"
                  text={draft.draft.지원동기}
                  toast={toast}
                />
                <DraftSection
                  title="직무역량"
                  text={draft.draft.직무역량}
                  toast={toast}
                />
                <DraftSection
                  title="입사 후 포부"
                  text={draft.draft.입사후포부}
                  toast={toast}
                />
                <ReferencedSamples samples={draft.referencedSamples} />
              </div>
            ) : draftError ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/50 px-6 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <p className="max-w-sm text-sm text-ink-600">{draftError}</p>
                {draftError.includes("이력서") && (
                  <Link href="/resume" className="mt-4">
                    <Button size="sm">이력서 작성하러 가기</Button>
                  </Link>
                )}
              </div>
            ) : (
              <DraftPlaceholder />
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card>
              <h3 className="flex items-center gap-2 font-bold text-ink-900">
                <ClipboardCheck className="h-4 w-4 text-brand-500" />내 자소서 입력
              </h3>
              <p className="mt-1 text-xs text-ink-500">
                작성한 자소서를 붙여넣으면 강점·개선점을 짚어드려요.
              </p>
              <div className="mt-4">
                <Textarea
                  placeholder="여기에 자소서를 붙여넣으세요..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  error={
                    content.trim().length > 0 && content.trim().length < 10
                      ? `10자 이상 입력해주세요 · 현재 ${content.trim().length}자`
                      : undefined
                  }
                  hint={`${content.length}자 · 10자 이상`}
                />
              </div>
              <button
                type="button"
                onClick={() => setContent(SAMPLE_COVER_LETTER)}
                className="mt-2 text-xs font-semibold text-brand-600 transition hover:text-brand-700"
              >
                예시 자소서로 채우기
              </button>
              <Button
                fullWidth
                size="lg"
                className="mt-4"
                onClick={runReview}
                loading={reviewLoading}
              >
                <ClipboardCheck className="h-5 w-5" />
                AI 첨삭 받기
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {reviewLoading ? (
              <ThinkingState
                title="자소서를 첨삭하고 있어요"
                steps={[
                  "유사한 합격 자소서와 비교하고 있어요",
                  "강점과 개선점을 분석하고 있어요",
                  "총평을 정리하고 있어요",
                ]}
              />
            ) : review ? (
              <div className="animate-fade-in space-y-4">
                <ReviewBlock
                  icon={<ThumbsUp className="h-4 w-4" />}
                  title="강점"
                  color="emerald"
                  items={review.review.강점}
                />
                <ReviewBlock
                  icon={<Lightbulb className="h-4 w-4" />}
                  title="개선점"
                  color="amber"
                  items={review.review.개선점}
                />
                <Card>
                  <div className="flex items-center gap-2 text-sm font-bold text-ink-800">
                    <MessageSquare className="h-4 w-4 text-brand-500" />
                    총평
                  </div>
                  <p className="prose-content mt-2 text-sm text-ink-700">
                    {review.review.총평}
                  </p>
                </Card>
                <ReferencedSamples samples={review.referencedSamples} />
              </div>
            ) : (
              <ReviewPlaceholder />
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}

function DraftSection({
  title,
  text,
  toast,
}: {
  title: string;
  text: string;
  toast: { success: (m: string) => void };
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${title} 내용을 복사했어요`);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-bold text-ink-900">
          <span className="h-4 w-1 rounded-full bg-brand-500" />
          {title}
        </h4>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-500 transition hover:bg-ink-100"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <p className="prose-content mt-3 text-sm text-ink-700">{text}</p>
    </Card>
  );
}

function ReviewBlock({
  icon,
  title,
  color,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  color: "emerald" | "amber";
  items: string[];
}) {
  const styles = {
    emerald: { wrap: "text-emerald-600", dot: "bg-emerald-500" },
    amber: { wrap: "text-amber-600", dot: "bg-amber-500" },
  }[color];
  return (
    <Card>
      <div className={`flex items-center gap-2 text-sm font-bold ${styles.wrap}`}>
        {icon}
        {title}
      </div>
      <ul className="mt-3 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-ink-700">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`} />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function DraftPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/50 px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <Wand2 className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-ink-800">
        자소서 초안이 여기에 표시돼요
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">
        왼쪽에서 공고를 선택하고 초안 생성을 눌러보세요. 지원동기·직무역량·입사 후
        포부 세 항목으로 작성해드려요.
      </p>
    </div>
  );
}

function ReviewPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/50 px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <ClipboardCheck className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-ink-800">
        첨삭 결과가 여기에 표시돼요
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">
        왼쪽에 자소서를 입력하고 첨삭을 받아보세요. 강점·개선점·총평을 정리해드려요.
      </p>
    </div>
  );
}

export default function CoverLetterPage() {
  return (
    <Suspense>
      <CoverLetterInner />
    </Suspense>
  );
}

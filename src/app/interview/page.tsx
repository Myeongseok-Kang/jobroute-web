"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageSquareText,
  Code2,
  UserCircle2,
  Lightbulb,
  Sparkles,
  User,
} from "lucide-react";
import { interviewApi, jobsApi, ApiError } from "@/lib/api";
import type { InterviewQuestions, Job } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PageContainer, PageHeader } from "@/components/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Card, ThinkingState } from "@/components/ui/Misc";
import { JobPicker } from "@/components/JobPicker";
import { ResumeSelect } from "@/components/ResumeSelect";
import { cn } from "@/lib/utils";

function InterviewInner() {
  const params = useSearchParams();
  const { isAuthed } = useAuth();
  const toast = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [personalized, setPersonalized] = useState(false);
  const [resumeId, setResumeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterviewQuestions | null>(null);

  useEffect(() => {
    const jobId = params.get("jobId");
    if (jobId) {
      jobsApi
        .detail(jobId)
        .then(setJob)
        .catch(() => {});
    }
  }, [params]);

  const generate = async () => {
    if (!job) {
      toast.error("면접 질문을 생성할 공고를 선택해주세요");
      return;
    }
    if (personalized && isAuthed && !resumeId) {
      toast.error("맞춤 질문에 사용할 이력서를 선택해주세요");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      if (personalized && isAuthed) {
        const res = await interviewApi.personalized(job.id, resumeId);
        if (res.error) {
          toast.error(res.error);
          setLoading(false);
          return;
        }
        setResult(res);
      } else {
        setResult(await interviewApi.general(job.id));
      }
      toast.success("면접 질문을 생성했어요");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "질문 생성에 실패했어요"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="면접 질문"
        title="예상 면접 질문 생성"
        description={
          <>
            공고를 분석해 기술·인성 질문과 준비 팁을 만들어드려요.
            <br />
            로그인하면 내 이력서 기반 맞춤 질문도 받을 수 있어요.
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="flex items-center gap-2 font-bold text-ink-900">
              <MessageSquareText className="h-4 w-4 text-brand-500" />
              공고 선택
            </h3>
            <div className="mt-4">
              <JobPicker selected={job} onSelect={setJob} />
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-ink-700">질문 유형</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPersonalized(false)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition",
                    !personalized
                      ? "border-brand-300 bg-brand-50/60 ring-2 ring-brand-100"
                      : "border-ink-200 hover:border-ink-300"
                  )}
                >
                  <MessageSquareText className="h-4 w-4 text-ink-500" />
                  <span className="text-sm font-bold text-ink-800">일반 질문</span>
                  <span className="text-[11px] text-ink-500">
                    공고만으로 생성
                  </span>
                </button>
                <button
                  onClick={() => {
                    if (!isAuthed) {
                      toast.info("맞춤 질문은 로그인 후 이용할 수 있어요");
                      return;
                    }
                    setPersonalized(true);
                  }}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition",
                    personalized
                      ? "border-brand-300 bg-brand-50/60 ring-2 ring-brand-100"
                      : "border-ink-200 hover:border-ink-300",
                    !isAuthed && "opacity-60"
                  )}
                >
                  <User className="h-4 w-4 text-brand-500" />
                  <span className="flex items-center gap-1 text-sm font-bold text-ink-800">
                    맞춤 질문
                    <Sparkles className="h-3 w-3 text-brand-500" />
                  </span>
                  <span className="text-[11px] text-ink-500">
                    내 이력서 갭 분석
                  </span>
                </button>
              </div>
            </div>

            {personalized && (
              <div className="mt-4">
                <ResumeSelect
                  value={resumeId}
                  onChange={setResumeId}
                  loginRedirect="/interview"
                />
              </div>
            )}

            <Button
              fullWidth
              size="lg"
              className="mt-5"
              onClick={generate}
              loading={loading}
              disabled={!job || (personalized && !resumeId)}
            >
              <MessageSquareText className="h-5 w-5" />
              면접 질문 생성
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <ThinkingState
              title="면접 질문을 만들고 있어요"
              steps={[
                "공고의 핵심 역량을 분석하고 있어요",
                personalized
                  ? "이력서와 공고의 갭을 찾고 있어요"
                  : "자주 나오는 질문 패턴을 구성하고 있어요",
                "준비 팁을 정리하고 있어요",
              ]}
            />
          ) : result ? (
            <div className="animate-fade-in space-y-4">
              {personalized && (
                <div className="flex items-center gap-2 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-sm font-semibold text-brand-700">
                  <Sparkles className="h-4 w-4" />내 이력서를 반영한 맞춤
                  질문이에요
                </div>
              )}
              <QuestionGroup
                icon={<Code2 className="h-4 w-4" />}
                title="기술 질문"
                color="brand"
                items={result.technical}
              />
              <QuestionGroup
                icon={<UserCircle2 className="h-4 w-4" />}
                title="경험·인성 질문"
                color="violet"
                items={result.experience}
              />
              <Card>
                <div className="flex items-center gap-2 text-sm font-bold text-amber-600">
                  <Lightbulb className="h-4 w-4" />
                  면접 준비 팁
                </div>
                <ul className="mt-3 space-y-2.5">
                  {result.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl bg-amber-50/60 p-3 text-sm text-ink-700"
                    >
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/50 px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                <MessageSquareText className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold text-ink-800">
                예상 면접 질문이 여기에 표시돼요
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-ink-500">
                공고를 선택하고 질문을 생성해보세요. 기술 질문, 경험·인성 질문,
                준비 팁을 받을 수 있어요.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function QuestionGroup({
  icon,
  title,
  color,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  color: "brand" | "violet";
  items: string[];
}) {
  const styles = {
    brand: { text: "text-brand-600", badge: "bg-brand-100 text-brand-700" },
    violet: { text: "text-violet-600", badge: "bg-violet-100 text-violet-700" },
  }[color];
  return (
    <Card>
      <div className={`flex items-center gap-2 text-sm font-bold ${styles.text}`}>
        {icon}
        {title}
        <span className="ml-auto rounded-lg bg-ink-100 px-2 py-0.5 text-xs font-bold text-ink-500">
          {items.length}
        </span>
      </div>
      <ol className="mt-3 space-y-2.5">
        {items.map((q, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${styles.badge}`}
            >
              {i + 1}
            </span>
            <p className="pt-0.5 text-sm leading-relaxed text-ink-700">{q}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export default function InterviewPage() {
  return (
    <Suspense>
      <InterviewInner />
    </Suspense>
  );
}

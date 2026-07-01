"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Briefcase,
  MessageSquareText,
  PenLine,
} from "lucide-react";
import Link from "next/link";
import type { MatchCandidate } from "@/lib/types";
import { ScoreRing, ScoreBar } from "./ScoreRing";
import { Reveal } from "./Reveal";
import { cn, sourceMeta, scoreColor } from "@/lib/utils";

const EMP_LABELS: Record<string, string> = {
  fulltime: "정규직",
  parttime: "파트타임",
  contract: "계약직",
  intern: "인턴",
};

function empLabel(v?: string | null) {
  if (!v) return null;
  return EMP_LABELS[v.toLowerCase()] || v;
}

function careerLabel(v?: number | null) {
  if (v === null || v === undefined) return null;
  if (v === 0) return "신입";
  return `경력 ${v}년+`;
}

/** Top recommended card — with LLM reason. */
export function RecommendedCard({
  candidate,
  rank,
}: {
  candidate: MatchCandidate;
  rank: number;
}) {
  const [open, setOpen] = useState(true);
  const src = sourceMeta(candidate.source);
  const emp = empLabel(candidate.employmentType);
  const career = careerLabel(candidate.careerMin);

  return (
    <div className="group ring-grad relative overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-soft transition-all hover:border-transparent hover:shadow-card">
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 text-xs font-bold text-white shadow-soft">
              {rank}
            </span>
            <ScoreRing score={candidate.score} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-bold",
                  src.color
                )}
              >
                {src.label}
              </span>
              {candidate.region && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-ink-200 px-2 py-0.5 text-xs font-semibold text-ink-500">
                  <MapPin className="h-3 w-3" />
                  {candidate.region}
                </span>
              )}
              {career && (
                <span className="inline-flex items-center rounded-lg bg-ink-100 px-2 py-0.5 text-xs font-semibold text-ink-600">
                  {career}
                </span>
              )}
              {emp && (
                <span className="inline-flex items-center rounded-lg bg-ink-100 px-2 py-0.5 text-xs font-semibold text-ink-600">
                  {emp}
                </span>
              )}
            </div>

            <a
              href={candidate.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 block"
            >
              <h3 className="text-lg font-bold leading-snug text-ink-900 transition group-hover:text-brand-700">
                {candidate.title}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-600">
                <Building2 className="h-3.5 w-3.5 text-ink-400" />
                {candidate.company}
                {candidate.location && (
                  <span className="text-ink-400">· {candidate.location}</span>
                )}
              </p>
            </a>
          </div>
        </div>

        {/* LLM reason */}
        {candidate.reason && (
          <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600">
              <Sparkles className="h-3.5 w-3.5" />
              AI 추천 이유
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              {candidate.reason.summary}
            </p>

            {candidate.reason.matches?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {candidate.reason.matches.map((m, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-ink-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            )}

            {candidate.reason.confirm?.length > 0 && (
              <ul className="mt-2.5 space-y-1.5 border-t border-brand-100 pt-2.5">
                {candidate.reason.confirm.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-ink-600"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Score breakdown (collapsible) */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-4 flex w-full items-center justify-between rounded-xl px-1 py-1 text-xs font-semibold text-ink-500 transition hover:text-ink-700"
        >
          점수 상세 보기
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
        {open && (
          <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-3 rounded-xl bg-ink-50 p-4 animate-fade-in-fast sm:grid-cols-4">
            <ScoreBar label="임베딩 유사도" score={candidate.embedScore} />
            <ScoreBar label="키워드(trgm)" score={candidate.trgmScore} />
            <ScoreBar label="경력 가중치" score={candidate.careerScore} max={0.1} />
            <ScoreBar label="고용형태" score={candidate.empScore} max={0.1} />
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            href={candidate.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-btn transition hover:to-brand-700"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            공고 보기
          </a>
          <Link
            href={`/interview?jobId=${candidate.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
          >
            <MessageSquareText className="h-3.5 w-3.5" />
            면접 질문
          </Link>
          <Link
            href={`/cover-letter?jobId=${candidate.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
          >
            <PenLine className="h-3.5 w-3.5" />
            자소서 초안
          </Link>
        </div>
      </div>
    </div>
  );
}

/** One inline score metric — label, tiny bar, value. */
function MiniScore({
  label,
  score,
  max = 1,
}: {
  label: string;
  score: number;
  max?: number;
}) {
  const ratio = max === 1 ? score : score / max;
  const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
  const color = scoreColor(ratio);
  return (
    <span className="inline-flex items-center gap-1 text-ink-400">
      <span className="font-medium">{label}</span>
      <span className="h-1 w-7 overflow-hidden rounded-full bg-ink-100">
        <span
          className={cn("block h-full rounded-full", color.bg)}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className={cn("font-bold tabular-nums", color.text)}>{pct}</span>
    </span>
  );
}

/** Compact candidate row — no reason, with inline score strip. */
export function CandidateRow({
  candidate,
  rank,
}: {
  candidate: MatchCandidate;
  rank: number;
}) {
  const src = sourceMeta(candidate.source);
  const career = careerLabel(candidate.careerMin);
  const emp = empLabel(candidate.employmentType);

  return (
    <a
      href={candidate.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group ring-grad flex items-center gap-4 rounded-xl border border-ink-200/70 bg-white px-4 py-3 shadow-soft transition-all hover:-translate-y-0.5 hover:border-transparent hover:shadow-card"
    >
      <span className="w-5 shrink-0 text-center text-sm font-bold text-ink-300">
        {rank}
      </span>
      <ScoreRing score={candidate.score} size={42} stroke={4} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink-900 transition group-hover:text-brand-700">
          {candidate.title}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-ink-500">
          <Building2 className="h-3 w-3" />
          {candidate.company}
          {candidate.region && <span>· {candidate.region}</span>}
        </p>
        {/* inline score strip */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          <MiniScore label="임베딩" score={candidate.embedScore} />
          <MiniScore label="키워드" score={candidate.trgmScore} />
          <MiniScore label="경력" score={candidate.careerScore} max={0.1} />
          <MiniScore label="고용" score={candidate.empScore} max={0.1} />
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-1.5 self-start sm:flex">
        <span
          className={cn(
            "rounded-md border px-1.5 py-0.5 text-[11px] font-bold",
            src.color
          )}
        >
          {src.label}
        </span>
        {career && (
          <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[11px] font-semibold text-ink-500">
            {career}
          </span>
        )}
        {emp && (
          <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[11px] font-semibold text-ink-500">
            {emp}
          </span>
        )}
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 self-start text-ink-300 transition group-hover:text-brand-500" />
    </a>
  );
}

/** Renders a full match result. */
export function MatchResultView({
  recommended,
  moreCandidates,
  total,
}: {
  recommended: MatchCandidate[];
  moreCandidates: MatchCandidate[];
  total: number;
}) {
  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-soft">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink-900">매칭 결과</h2>
            <p className="text-xs text-ink-500">
              총 {total}개 후보 중 상위 {recommended.length}개를 추천해요
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recommended.map((c, i) => (
          <Reveal key={c.id} delay={Math.min(i, 6) * 70}>
            <RecommendedCard candidate={c} rank={i + 1} />
          </Reveal>
        ))}
      </div>

      {moreCandidates.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-700">
            <Briefcase className="h-4 w-4 text-ink-400" />
            더 많은 후보 ({moreCandidates.length})
          </div>
          <div className="space-y-2.5">
            {moreCandidates.map((c, i) => (
              <CandidateRow
                key={c.id}
                candidate={c}
                rank={recommended.length + i + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

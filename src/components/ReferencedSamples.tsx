import { BookOpen } from "lucide-react";
import type { CoverLetterSample } from "@/lib/types";
import { toPercent } from "@/lib/utils";

export function ReferencedSamples({
  samples,
}: {
  samples: CoverLetterSample[];
}) {
  if (!samples || samples.length === 0) return null;
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-ink-800">
        <BookOpen className="h-4 w-4 text-brand-500" />
        참고한 합격 자소서
      </div>
      <p className="mt-1 text-xs text-ink-400">
        RAG가 의미적으로 유사한 합격 자소서를 참고했어요.
      </p>
      <div className="mt-4 space-y-2.5">
        {samples.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/50 p-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-brand-600 shadow-soft">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-800">
                {s.company}
              </p>
              <p className="truncate text-xs text-ink-500">{s.jobCategory}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-bold text-brand-600">
                {toPercent(s.score)}%
              </p>
              <p className="text-[10px] text-ink-400">유사도</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

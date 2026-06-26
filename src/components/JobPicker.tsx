"use client";

import { useEffect, useState } from "react";
import { Search, Building2, Check, X, MapPin } from "lucide-react";
import { jobsApi } from "@/lib/api";
import type { Job } from "@/lib/types";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Misc";
import { cn, sourceMeta } from "@/lib/utils";

export function JobPicker({
  selected,
  onSelect,
}: {
  selected: Job | null;
  onSelect: (job: Job | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    jobsApi
      .latest(8)
      .then(setJobs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const search = async () => {
    setSubmitted(query);
    setLoading(true);
    try {
      const res = await jobsApi.list({ q: query || undefined, size: 10, page: 1 });
      setJobs(res.items);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  if (selected) {
    const src = sourceMeta(selected.source);
    return (
      <div className="flex items-center gap-3 rounded-xl border-2 border-brand-200 bg-brand-50/50 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
          <Building2 className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink-900">
            {selected.title}
          </p>
          <p className="flex items-center gap-1.5 truncate text-xs text-ink-500">
            {selected.company}
            <span
              className={cn(
                "rounded border px-1.5 py-0.5 text-[10px] font-bold",
                src.color
              )}
            >
              {src.label}
            </span>
          </p>
        </div>
        <button
          onClick={() => onSelect(null)}
          className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-white hover:text-ink-600"
          aria-label="선택 해제"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="공고 검색 (직무, 회사명)"
            className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-3.5 text-sm text-ink-900 transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <Button variant="secondary" onClick={search}>
          검색
        </Button>
      </div>

      <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : jobs.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-400">
            {submitted ? "검색 결과가 없어요" : "공고가 없어요"}
          </p>
        ) : (
          <>
            {!submitted && (
              <p className="px-1 text-xs font-medium text-ink-400">최신 공고</p>
            )}
            {jobs.map((job) => {
              const src = sourceMeta(job.source);
              return (
                <button
                  key={job.id}
                  onClick={() => onSelect(job)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 text-left transition hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {job.title}
                    </p>
                    <p className="flex items-center gap-1.5 truncate text-xs text-ink-500">
                      <Building2 className="h-3 w-3" />
                      {job.company}
                      {job.region && (
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {job.region}
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-bold",
                      src.color
                    )}
                  >
                    {src.label}
                  </span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-ink-200 text-ink-300 transition group-hover:border-brand-400 group-hover:bg-brand-500 group-hover:text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

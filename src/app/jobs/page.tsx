"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X, Briefcase } from "lucide-react";
import { jobsApi, type JobQuery } from "@/lib/api";
import type { Job, JobListResponse } from "@/lib/types";
import { REGIONS, SOURCES, EMPLOYMENT_OPTIONS } from "@/lib/constants";

const CAREER_FILTERS = ["신입", "경력"];
import { useBookmarkSet } from "@/lib/useBookmarks";
import { PageContainer, PageHeader } from "@/components/AuthGuard";
import { JobCard, JobCardSkeleton } from "@/components/JobCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/Misc";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const SIZE = 12;

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{
    q: string;
    region: string;
    source: string;
    employmentType: string;
    career: string;
    sort: "latest" | "oldest";
  }>({
    q: "",
    region: "",
    source: "",
    employmentType: "",
    career: "",
    sort: "latest",
  });
  const [page, setPage] = useState(1);

  const [data, setData] = useState<JobListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { ids: bookmarkedIds, onChange: onBookmarkChange } = useBookmarkSet();

  const topRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const query: JobQuery = {
        q: filters.q || undefined,
        region: filters.region || undefined,
        source: filters.source || undefined,
        employmentType: filters.employmentType || undefined,
        career: filters.career || undefined,
        sort: filters.sort,
        page,
        size: SIZE,
      };
      const res = await jobsApi.list(query);
      setData(res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const applySearch = () => {
    setPage(1);
    setFilters((f) => ({ ...f, q: search }));
  };

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setPage(1);
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const changePage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasActiveFilter =
    filters.q ||
    filters.region ||
    filters.source ||
    filters.employmentType ||
    filters.career ||
    filters.sort !== "latest";

  const clearAll = () => {
    setSearch("");
    setPage(1);
    setFilters({
      q: "",
      region: "",
      source: "",
      employmentType: "",
      career: "",
      sort: "latest",
    });
  };

  return (
    <PageContainer>
      <div ref={topRef} />
      <PageHeader
        eyebrow="공고 탐색"
        title="채용 공고 둘러보기"
        description="전국 IT 직무 채용 공고를 한곳에서 검색하고 북마크하세요."
      />

      <div className="sticky top-16 z-20 -mx-2 mb-8 rounded-2xl border border-ink-200/70 bg-white/90 p-4 shadow-soft backdrop-blur-md">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
                placeholder="직무, 회사명으로 검색"
                className="h-12 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-3.5 text-sm text-ink-900 shadow-sm transition hover:border-ink-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex">
            <Select
              name="region"
              value={filters.region}
              onChange={(e) => updateFilter("region", e.target.value)}
              options={[
                { value: "", label: "전체 지역" },
                ...REGIONS.map((r) => ({ value: r, label: r })),
              ]}
              className="lg:w-36"
            />
            <Select
              name="source"
              value={filters.source}
              onChange={(e) => updateFilter("source", e.target.value)}
              options={[
                { value: "", label: "전체 출처" },
                ...SOURCES,
              ]}
              className="lg:w-32"
            />
            <Select
              name="employmentType"
              value={filters.employmentType}
              onChange={(e) => updateFilter("employmentType", e.target.value)}
              options={[
                { value: "", label: "고용형태" },
                ...EMPLOYMENT_OPTIONS.map((c) => ({ value: c, label: c })),
              ]}
              className="lg:w-28"
            />
            <Select
              name="career"
              value={filters.career}
              onChange={(e) => updateFilter("career", e.target.value)}
              options={[
                { value: "", label: "경력 전체" },
                ...CAREER_FILTERS.map((c) => ({ value: c, label: c })),
              ]}
              className="lg:w-28"
            />
            <Select
              name="sort"
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              options={[
                { value: "latest", label: "최신순" },
                { value: "oldest", label: "오래된순" },
              ]}
              className="lg:w-28"
            />
            <Button
              onClick={applySearch}
              className="col-span-2 h-12 whitespace-nowrap sm:col-span-1"
            >
              <Search className="h-4 w-4" />
              검색
            </Button>
          </div>
        </div>

        {hasActiveFilter && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3">
            <span className="flex items-center gap-1 text-xs font-semibold text-ink-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              적용된 필터
            </span>
            {filters.q && <FilterChip label={`"${filters.q}"`} />}
            {filters.region && <FilterChip label={filters.region} />}
            {filters.source && (
              <FilterChip
                label={
                  SOURCES.find((s) => s.value === filters.source)?.label ||
                  filters.source
                }
              />
            )}
            {filters.employmentType && <FilterChip label={filters.employmentType} />}
            {filters.career && <FilterChip label={filters.career} />}
            <button
              onClick={clearAll}
              className="ml-1 flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <X className="h-3.5 w-3.5" />
              초기화
            </button>
          </div>
        )}
      </div>

      {!loading && data && (
        <div className="mb-4 text-sm text-ink-500">
          총{" "}
          <span className="font-bold text-ink-900">
            {data.total.toLocaleString("ko-KR")}
          </span>
          개의 공고
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={<Briefcase className="h-7 w-7" />}
          title="공고를 불러오지 못했어요"
          description="백엔드 서버가 실행 중인지 확인하고 다시 시도해 주세요."
          action={<Button onClick={load}>다시 시도</Button>}
        />
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((job: Job, i: number) => (
              <Reveal key={job.id} delay={Math.min(i, 8) * 50} className="h-full">
                <JobCard
                  job={job}
                  bookmarked={bookmarkedIds.has(job.id)}
                  onBookmarkChange={onBookmarkChange}
                />
              </Reveal>
            ))}
          </div>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={changePage}
          />
        </>
      ) : (
        <EmptyState
          icon={<Search className="h-7 w-7" />}
          title="검색 결과가 없어요"
          description="다른 키워드나 필터로 다시 검색해보세요."
          action={
            hasActiveFilter ? (
              <Button variant="secondary" onClick={clearAll}>
                필터 초기화
              </Button>
            ) : undefined
          }
        />
      )}
    </PageContainer>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100"
      )}
    >
      {label}
    </span>
  );
}

"use client";

import { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  ExternalLink,
  Building2,
  Banknote,
  Clock,
  Flame,
} from "lucide-react";
import type { Job } from "@/lib/types";
import { bookmarkApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Badge } from "./ui/Misc";
import {
  cn,
  formatRelativeDate,
  formatSalary,
  sourceMeta,
} from "@/lib/utils";

interface JobCardProps {
  job: Job;
  bookmarked?: boolean;
  onBookmarkChange?: (jobId: string, bookmarked: boolean) => void;
  showBookmarkCount?: boolean;
  rank?: number;
}

export function JobCard({
  job,
  bookmarked: initialBookmarked,
  onBookmarkChange,
  showBookmarkCount = false,
  rank,
}: JobCardProps) {
  const { isAuthed } = useAuth();
  const toast = useToast();
  const [bookmarked, setBookmarked] = useState(!!initialBookmarked);
  const [pending, setPending] = useState(false);

  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const src = sourceMeta(job.source);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      toast.info("북마크는 로그인 후 이용할 수 있어요");
      return;
    }
    if (pending) return;
    setPending(true);
    const next = !bookmarked;
    setBookmarked(next);
    try {
      const res = await bookmarkApi.toggle(job.id);
      setBookmarked(res.bookmarked);
      onBookmarkChange?.(job.id, res.bookmarked);
      toast.success(res.bookmarked ? "북마크에 저장했어요" : "북마크를 해제했어요");
    } catch {
      setBookmarked(!next);
      toast.error("북마크 처리에 실패했어요");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="ring-grad group relative flex h-full flex-col rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {rank !== undefined && (
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 text-xs font-bold text-white shadow-sm">
              {rank}
            </span>
          )}
          <span
            className={cn(
              "inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-bold",
              src.color
            )}
          >
            {src.label}
          </span>
          {job.region && (
            <Badge variant="outline">
              <MapPin className="h-3 w-3" />
              {job.region}
            </Badge>
          )}
          {showBookmarkCount && job.bookmarkCount !== undefined && (
            <Badge className="bg-orange-50 text-orange-600">
              <Flame className="h-3 w-3" />
              {job.bookmarkCount}
            </Badge>
          )}
        </div>
        <button
          onClick={toggleBookmark}
          disabled={pending}
          className={cn(
            "shrink-0 rounded-xl p-2 transition-all",
            bookmarked
              ? "bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-sm"
              : "text-ink-300 hover:bg-ink-100 hover:text-ink-500"
          )}
          aria-label={bookmarked ? "북마크 해제" : "북마크"}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
      </div>

      <a
        href={job.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex-1"
      >
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
          {job.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-600">
          <Building2 className="h-3.5 w-3.5 text-ink-400" />
          {job.company}
        </p>
      </a>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-500">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1 font-semibold text-ink-700">
            <Banknote className="h-3.5 w-3.5 text-emerald-500" />
            {salary}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatRelativeDate(job.createdAt)}
        </span>
      </div>

      <a
        href={job.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:gap-2.5 hover:text-brand-700"
      >
        원문 보기
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
      <div className="flex gap-2">
        <div className="skeleton h-5 w-12 rounded-lg" />
        <div className="skeleton h-5 w-14 rounded-lg" />
      </div>
      <div className="skeleton mt-4 h-5 w-3/4 rounded" />
      <div className="skeleton mt-2 h-4 w-1/2 rounded" />
      <div className="skeleton mt-5 h-3 w-2/3 rounded" />
      <div className="skeleton mt-4 h-4 w-20 rounded" />
    </div>
  );
}

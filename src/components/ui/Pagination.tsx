"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const push = (p: number | "...") => pages.push(p);
  const window = 1;

  for (let p = 1; p <= totalPages; p++) {
    if (
      p === 1 ||
      p === totalPages ||
      (p >= page - window && p <= page + window)
    ) {
      push(p);
    } else if (pages[pages.length - 1] !== "...") {
      push("...");
    }
  }

  const btn =
    "flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition active:scale-95";

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={cn(
          btn,
          "border border-ink-200 bg-white text-ink-600 hover:bg-ink-50 disabled:opacity-40"
        )}
        aria-label="이전"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-1 text-ink-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              btn,
              p === page
                ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-btn"
                : "border border-ink-200 bg-white text-ink-600 hover:border-brand-200 hover:bg-ink-50"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={cn(
          btn,
          "border border-ink-200 bg-white text-ink-600 hover:bg-ink-50 disabled:opacity-40"
        )}
        aria-label="다음"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

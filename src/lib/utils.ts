import type { JobSource } from "./types";

export function cn(...classes: unknown[]): string {
  return classes.filter((c) => typeof c === "string" && c).join(" ");
}

export function formatRelativeDate(input?: string | null): string {
  if (!input) return "";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  if (sec < 60) return "방금 전";
  if (min < 60) return `${min}분 전`;
  if (hour < 24) return `${hour}시간 전`;
  if (day < 7) return `${day}일 전`;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDate(input?: string | null): string {
  if (!input) return "";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatSalary(
  min?: number | null,
  max?: number | null
): string | null {
  const fmt = (n: number) => {
    // values assumed to be in 만원 (10k KRW)
    if (n >= 10000) {
      const eok = n / 10000;
      return `${Number.isInteger(eok) ? eok : eok.toFixed(1)}억`;
    }
    return `${n.toLocaleString("ko-KR")}만원`;
  };
  if (min && max) {
    if (min === max) return fmt(min);
    return `${fmt(min)} ~ ${fmt(max)}`;
  }
  if (min) return `${fmt(min)} 이상`;
  if (max) return `${fmt(max)} 이하`;
  return null;
}

const SOURCE_META: Record<string, { label: string; color: string }> = {
  wanted: { label: "원티드", color: "bg-blue-50 text-blue-600 border-blue-100" },
  saramin: {
    label: "사람인",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  jobkorea: {
    label: "잡코리아",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
};

export function sourceMeta(source: JobSource) {
  return (
    SOURCE_META[source] || {
      label: source,
      color: "bg-ink-100 text-ink-600 border-ink-200",
    }
  );
}

export function scoreColor(score: number): {
  text: string;
  bg: string;
  ring: string;
} {
  // score expected 0..1
  if (score >= 0.75)
    return {
      text: "text-emerald-600",
      bg: "bg-emerald-500",
      ring: "text-emerald-500",
    };
  if (score >= 0.55)
    return { text: "text-brand-600", bg: "bg-brand-500", ring: "text-brand-500" };
  if (score >= 0.35)
    return {
      text: "text-amber-600",
      bg: "bg-amber-500",
      ring: "text-amber-500",
    };
  return { text: "text-ink-500", bg: "bg-ink-400", ring: "text-ink-400" };
}

export function toPercent(score: number): number {
  // scores are 0..1; clamp and round
  const pct = Math.round(score * 100);
  return Math.max(0, Math.min(100, pct));
}

export function getInitial(name?: string | null, email?: string): string {
  const src = (name || email || "?").trim();
  return src.charAt(0).toUpperCase();
}

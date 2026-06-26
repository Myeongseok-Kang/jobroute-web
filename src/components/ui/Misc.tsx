"use client";

import { type ReactNode, type HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padded?: boolean;
}
export function Card({
  hover = false,
  padded = true,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-200/60 bg-white shadow-soft",
        hover &&
          "ring-grad transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-card",
        padded && "p-5 sm:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "brand" | "outline";
}
export function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  const variants = {
    default: "bg-ink-100 text-ink-600 ring-1 ring-inset ring-ink-200/60",
    brand: "bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100",
    outline: "border border-ink-200 text-ink-500",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("h-5 w-5 animate-spin text-brand-500", className)} />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-500">
            <span className="h-1 w-5 rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center">
      {icon && (
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-500 shadow-soft ring-1 ring-inset ring-white">
          <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-400/20 blur-xl" />
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-ink-800">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ThinkingState({
  title = "AI가 분석 중이에요",
  steps,
}: {
  title?: string;
  steps?: string[];
}) {
  const defaultSteps = steps ?? [
    "내 입력을 벡터로 변환하고 있어요",
    "유사도와 키워드를 비교하고 있어요",
    "추천 이유를 정리하고 있어요",
  ];
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-100 bg-gradient-to-b from-brand-50/60 to-white px-6 py-14 text-center">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-200 opacity-60" />
        <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
          <Loader2 className="h-6 w-6 animate-spin" />
        </span>
      </div>
      <h3 className="text-base font-bold text-ink-900">{title}</h3>
      <ul className="mt-5 space-y-2 text-left">
        {defaultSteps.map((s, i) => (
          <li
            key={i}
            className="flex items-center gap-2.5 text-sm text-ink-600"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

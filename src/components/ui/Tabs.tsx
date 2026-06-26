"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full gap-1 overflow-x-auto scrollbar-none rounded-2xl border border-ink-200/70 bg-white p-1.5 shadow-soft sm:inline-flex sm:w-auto sm:overflow-visible",
        className
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative flex flex-none items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.97]",
              active
                ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-soft"
                : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

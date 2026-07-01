"use client";

import { type SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, id, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-semibold text-ink-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "h-12 w-full cursor-pointer appearance-none rounded-xl border bg-white pl-4 pr-10 text-sm font-medium text-ink-800 shadow-sm transition-all focus:outline-none focus:ring-4",
              error
                ? "border-red-300 hover:border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-ink-200 hover:border-ink-300 focus:border-brand-400 focus:ring-brand-100",
              className
            )}
            {...props}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        </div>
        {error && (
          <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

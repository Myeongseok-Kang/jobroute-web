"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-btn hover:-translate-y-0.5 hover:from-brand-500 hover:to-brand-700 hover:shadow-lift focus-visible:ring-brand-300",
  secondary:
    "bg-white text-ink-800 border border-ink-200 shadow-soft hover:bg-ink-50 hover:border-ink-300 focus-visible:ring-ink-200",
  outline:
    "bg-transparent text-brand-700 border border-brand-200 hover:bg-brand-50 focus-visible:ring-brand-200",
  ghost:
    "bg-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900 focus-visible:ring-ink-200",
  danger:
    "bg-red-500 text-white shadow-soft hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-200",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-xl",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-13 px-7 text-base gap-2.5 rounded-2xl py-3.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-4",
          "disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.98]",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

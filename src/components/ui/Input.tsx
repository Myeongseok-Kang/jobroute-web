"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
}

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    FieldProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, icon, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-semibold text-ink-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-12 w-full rounded-xl border bg-white px-4 text-sm text-ink-900 shadow-sm transition-all",
              "placeholder:text-ink-400",
              "focus:outline-none focus:ring-4",
              icon && "pl-10",
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-ink-200 hover:border-ink-300 focus:border-brand-400 focus:ring-brand-100",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-semibold text-ink-700"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed text-ink-900 shadow-sm transition-all",
            "placeholder:text-ink-400 resize-y",
            "focus:outline-none focus:ring-4",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-ink-200 hover:border-ink-300 focus:border-brand-400 focus:ring-brand-100",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

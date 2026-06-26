import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-soft">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-white"
          aria-hidden
        >
          <circle cx="6" cy="6" r="2.4" fill="currentColor" />
          <circle cx="18" cy="18" r="2.4" fill="currentColor" />
          <path
            d="M6 8.5v3.5a3 3 0 0 0 3 3h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {showText && (
        <span className="text-lg font-extrabold tracking-tight text-ink-900">
          Job<span className="text-brand-600">Route</span>
        </span>
      )}
    </span>
  );
}

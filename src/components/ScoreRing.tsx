import { cn, scoreColor, toPercent } from "@/lib/utils";

export function ScoreRing({
  score,
  size = 56,
  stroke = 5,
  label = "적합도",
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const pct = toPercent(score);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className={cn("transition-all duration-700", color.ring)}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 1px 1.5px rgba(15,23,42,0.18))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-sm font-extrabold leading-none", color.text)}>
          {pct}
        </span>
        {size >= 56 && (
          <span className="mt-0.5 text-[9px] font-medium text-ink-400">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export function ScoreBar({
  label,
  score,
  hint,
  max = 1,
}: {
  label: string;
  score: number;
  hint?: string;
  max?: number;
}) {
  const ratio = max === 1 ? score : score / max;
  const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
  const color = scoreColor(ratio);
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-ink-500" title={hint}>
          {label}
        </span>
        <span className={cn("font-bold", color.text)}>{pct}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color.bg)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

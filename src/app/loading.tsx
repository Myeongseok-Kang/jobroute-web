import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-ink-400">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <span className="text-sm font-medium">불러오는 중…</span>
      </div>
    </div>
  );
}

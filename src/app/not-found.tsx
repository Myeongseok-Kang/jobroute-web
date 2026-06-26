import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-400/15 blur-3xl animate-blob" />
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 animate-float">
        <Compass className="h-8 w-8" />
      </div>
      <p className="text-gradient-animate text-7xl font-extrabold tracking-tight sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">길을 잃으셨나요?</h1>
      <p className="mt-2 max-w-md text-ink-500">
        찾으시는 페이지가 없어요. JobRoute가 올바른 길로 안내해드릴게요.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">
            홈으로
          </Button>
        </Link>
        <Link href="/matching">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            AI 매칭
          </Button>
        </Link>
      </div>
    </div>
  );
}

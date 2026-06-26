"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[72vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-ink-900">문제가 발생했어요</h1>
      <p className="mt-2 max-w-md text-ink-500">
        일시적인 오류일 수 있어요. 다시 시도하거나 잠시 후 접속해 주세요.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset} className="w-full sm:w-auto">
          다시 시도
        </Button>
        <Link href="/">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            홈으로
          </Button>
        </Link>
      </div>
    </div>
  );
}

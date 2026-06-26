"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { Spinner } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const { setToken } = useAuth();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const token =
      params.get("accessToken") ||
      params.get("token") ||
      params.get("access_token");

    if (token) {
      setToken(token).then(() => router.replace("/matching"));
    } else {
      setFailed(true);
    }
  }, [params, setToken, router]);

  if (failed) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-ink-900">
          소셜 로그인에 실패했어요
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          토큰을 받지 못했습니다. 다시 시도해 주세요.
        </p>
        <Link href="/login" className="mt-6">
          <Button>로그인으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4">
      <Logo />
      <div className="flex items-center gap-3 text-ink-500">
        <Spinner />
        <span className="text-sm font-medium">로그인 처리 중이에요…</span>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}

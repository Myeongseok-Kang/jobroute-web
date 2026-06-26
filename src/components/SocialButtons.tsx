"use client";

import Link from "next/link";
import { authApi } from "@/lib/api";

export function SocialButtons() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
      <a
        href={authApi.googleUrl()}
        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white text-sm font-semibold text-ink-700 transition hover:bg-ink-50 active:scale-[0.98]"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
          />
        </svg>
        Google
      </a>
      <a
        href={authApi.kakaoUrl()}
        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FEE500] text-sm font-semibold text-[#191600] transition hover:brightness-95 active:scale-[0.98]"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#191600"
            d="M12 3C6.99 3 3 6.2 3 10.13c0 2.52 1.66 4.73 4.16 5.99-.18.64-.66 2.37-.76 2.74-.12.46.17.45.36.33.15-.1 2.36-1.6 3.32-2.26.63.09 1.27.14 1.92.14 5.01 0 9-3.2 9-7.13S17.01 3 12 3Z"
          />
        </svg>
        카카오
      </a>
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-ink-400">
        계속 진행하면{" "}
        <Link href="/terms" className="underline hover:text-brand-600">
          이용약관
        </Link>
        과{" "}
        <Link href="/privacy" className="underline hover:text-brand-600">
          개인정보처리방침
        </Link>
        에 동의하게 됩니다.
      </p>
    </div>
  );
}

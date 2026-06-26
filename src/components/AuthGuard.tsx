"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Misc";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthed, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-glow">
          <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-400/30 blur-xl" />
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-ink-900">로그인이 필요해요</h2>
        <p className="mt-2 text-sm text-ink-500">
          이 기능을 사용하려면 로그인해 주세요. 이력서, 북마크, 매칭 이력은
          계정에 안전하게 저장됩니다.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login">
            <Button>로그인</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">회원가입</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="mb-8 animate-fade-in">
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-600">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          {eyebrow}
        </span>
      )}
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-[2.15rem]">
        {title}
      </h1>
      <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
      {description && (
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-500">
          {description}
        </p>
      )}
    </div>
  );
}

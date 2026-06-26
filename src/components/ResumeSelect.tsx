"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { resumeApi } from "@/lib/api";
import type { Resume } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { Select } from "@/components/ui/Select";

export function ResumeSelect({
  value,
  onChange,
  loginRedirect = "/login",
}: {
  value: string;
  onChange: (id: string) => void;
  loginRedirect?: string;
}) {
  const { isAuthed } = useAuth();
  const [resumes, setResumes] = useState<Resume[] | null>(null);

  useEffect(() => {
    if (!isAuthed) {
      setResumes([]);
      return;
    }
    let active = true;
    resumeApi
      .list()
      .then((rs) => active && setResumes(rs))
      .catch(() => active && setResumes([]));
    return () => {
      active = false;
    };
  }, [isAuthed]);

  if (!isAuthed) {
    return (
      <div className="flex items-center gap-1.5 rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-3.5 py-3 text-xs text-ink-600">
        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
        <span>
          <Link
            href={`/login?redirect=${loginRedirect}`}
            className="font-semibold underline"
          >
            로그인
          </Link>{" "}
          후 내 이력서로 이용할 수 있어요.
        </span>
      </div>
    );
  }

  if (resumes === null) {
    return <div className="skeleton h-11 rounded-xl" />;
  }

  if (resumes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 px-3.5 py-3 text-xs text-ink-600">
        <p className="flex items-center gap-1.5 font-semibold text-amber-700">
          <AlertCircle className="h-3.5 w-3.5" />
          저장된 이력서가 없어요
        </p>
        <p className="mt-1">이력서가 있어야 이용할 수 있어요.</p>
        <Link
          href="/resume"
          className="mt-2 inline-block font-semibold text-brand-600 underline"
        >
          이력서 작성하러 가기 →
        </Link>
      </div>
    );
  }

  return (
    <Select
      label="이력서 선택"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={[
        { value: "", label: "이력서를 선택하세요" },
        ...resumes.map((r) => ({
          value: r.id,
          label: r.title || "제목 없는 이력서",
        })),
      ]}
    />
  );
}

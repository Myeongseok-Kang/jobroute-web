"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { authApi, ApiError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "요청에 실패했어요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="비밀번호 찾기"
      subtitle="가입한 이메일로 재설정 링크를 보내드려요"
    >
      {sent ? (
        <div className="rounded-xl border border-ink-200 bg-ink-50/50 p-5 text-sm text-ink-600">
          <p className="font-semibold text-ink-800">메일을 확인해주세요</p>
          <p className="mt-1">
            입력하신 이메일로 가입된 계정이 있다면 비밀번호 재설정 링크를
            보냈어요. (링크는 1시간 후 만료돼요)
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            name="email"
            type="email"
            label="이메일"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Button type="submit" fullWidth size="lg" loading={loading}>
            재설정 링크 보내기
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-ink-500">
        <Link
          href="/login"
          className="font-bold text-brand-600 hover:text-brand-700"
        >
          로그인으로 돌아가기
        </Link>
      </p>
    </AuthShell>
  );
}

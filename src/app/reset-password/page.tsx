"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { authApi, ApiError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const token = params.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("비밀번호는 8자 이상이어야 해요");
      return;
    }
    if (newPassword !== confirm) {
      toast.error("비밀번호가 일치하지 않아요");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      toast.success("비밀번호가 변경되었어요. 다시 로그인해주세요.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "재설정에 실패했어요");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthShell title="비밀번호 재설정" subtitle="">
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 text-sm text-ink-600">
          유효하지 않은 링크예요. 비밀번호 찾기를 다시 시도해주세요.
        </div>
        <p className="mt-6 text-center text-sm">
          <Link
            href="/forgot-password"
            className="font-bold text-brand-600 hover:text-brand-700"
          >
            비밀번호 찾기
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="새 비밀번호 설정" subtitle="새로 사용할 비밀번호를 입력하세요">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          name="newPassword"
          type="password"
          label="새 비밀번호"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          hint="8자 이상"
          autoComplete="new-password"
          required
        />
        <Input
          name="confirm"
          type="password"
          label="새 비밀번호 확인"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={
            confirm.length > 0 && newPassword !== confirm
              ? "비밀번호가 일치하지 않아요"
              : undefined
          }
          autoComplete="new-password"
          required
        />
        <Button type="submit" fullWidth size="lg" loading={loading}>
          비밀번호 변경
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}

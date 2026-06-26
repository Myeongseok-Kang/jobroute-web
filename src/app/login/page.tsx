"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { authApi, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AuthShell } from "@/components/AuthShell";
import { SocialButtons } from "@/components/SocialButtons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setToken } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = params.get("redirect") || "/matching";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { accessToken } = await authApi.login({ email, password });
      await setToken(accessToken);
      toast.success("로그인되었습니다");
      router.push(redirectTo);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 401
            ? "이메일 또는 비밀번호가 올바르지 않아요"
            : err.message
          : "로그인에 실패했어요";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="다시 오신 걸 환영해요 👋"
      subtitle="JobRoute 계정으로 로그인하세요"
    >
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
        <Input
          name="password"
          type="password"
          label="비밀번호"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          error={error}
        />
        <Button type="submit" fullWidth size="lg" loading={loading}>
          로그인
        </Button>
      </form>

      <p className="mt-3 text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-ink-500 hover:text-brand-600"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </p>

      <div className="my-6 flex items-center gap-3 text-xs font-medium text-ink-400">
        <span className="h-px flex-1 bg-ink-200" />
        간편 로그인
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <SocialButtons />

      <p className="mt-8 text-center text-sm text-ink-500">
        아직 계정이 없으신가요?{" "}
        <Link
          href="/register"
          className="font-bold text-brand-600 hover:text-brand-700"
        >
          회원가입
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

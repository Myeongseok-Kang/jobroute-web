"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User as UserIcon, CheckCircle2 } from "lucide-react";
import { authApi, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AuthShell } from "@/components/AuthShell";
import { SocialButtons } from "@/components/SocialButtons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { setToken } = useAuth();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const passwordOk = password.length >= 6;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!passwordOk) {
      setErrors({ password: "비밀번호는 6자 이상이어야 해요" });
      return;
    }
    setLoading(true);
    try {
      await authApi.register({ email, password, name: name || undefined });
      const { accessToken } = await authApi.login({ email, password });
      await setToken(accessToken);
      toast.success("가입을 환영합니다! 🎉");
      router.push("/matching");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrors({ email: "이미 가입된 이메일이에요" });
      } else {
        toast.error(
          err instanceof ApiError ? err.message : "회원가입에 실패했어요"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="JobRoute 시작하기"
      subtitle="무료 계정을 만들고 AI 매칭을 경험해보세요"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          name="name"
          label="이름 (선택)"
          placeholder="홍길동"
          icon={<UserIcon className="h-4 w-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
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
          error={errors.email}
        />
        <div>
          <Input
            name="password"
            type="password"
            label="비밀번호"
            placeholder="6자 이상 입력"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            error={errors.password}
          />
          {password.length > 0 && !errors.password && (
            <p
              className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
                passwordOk ? "text-emerald-500" : "text-ink-400"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {passwordOk ? "사용 가능한 비밀번호예요" : "6자 이상 입력해주세요"}
            </p>
          )}
        </div>
        <Button type="submit" fullWidth size="lg" loading={loading}>
          가입하고 시작하기
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-medium text-ink-400">
        <span className="h-px flex-1 bg-ink-200" />
        간편 가입
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <SocialButtons />

      <p className="mt-8 text-center text-sm text-ink-500">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-bold text-brand-600 hover:text-brand-700"
        >
          로그인
        </Link>
      </p>
    </AuthShell>
  );
}

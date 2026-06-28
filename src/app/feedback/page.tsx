"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, Calendar, MessageSquareText, Lock, Phone } from "lucide-react";
import { feedbackApi, type Feedback } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PageHeader } from "@/components/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, EmptyState, Spinner } from "@/components/ui/Misc";
import { formatRelativeDate } from "@/lib/utils";

export default function FeedbackPage() {
  const { isAuthed, loading: authLoading } = useAuth();
  const toast = useToast();

  const [content, setContent] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [mine, setMine] = useState<Feedback[]>([]);
  const [loadingMine, setLoadingMine] = useState(false);
  const [adminList, setAdminList] = useState<Feedback[] | null>(null);

  const loadMine = async () => {
    setLoadingMine(true);
    try {
      setMine(await feedbackApi.listMine());
    } catch {
      /* noop */
    } finally {
      setLoadingMine(false);
    }
  };

  const loadAdmin = async () => {
    try {
      setAdminList(await feedbackApi.listAdmin());
    } catch {
      setAdminList(null);
    }
  };

  useEffect(() => {
    if (isAuthed) {
      loadMine();
      loadAdmin();
    }
  }, [isAuthed]);

  const submit = async () => {
    if (content.trim().length < 5) {
      toast.error("후기를 5자 이상 입력해주세요");
      return;
    }
    setSubmitting(true);
    try {
      await feedbackApi.submit({
        content: content.trim(),
        phone: phone.trim() || undefined,
      });
      toast.success("소중한 후기 감사합니다! 추첨에 응모되었어요 🎉");
      setContent("");
      setPhone("");
      loadMine();
      if (adminList) loadAdmin();
    } catch {
      toast.error("후기 등록에 실패했어요. 잠시 후 다시 시도해주세요");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="이벤트"
        title="후기 남기고 선물 받기"
        description="잡루트를 사용해보신 솔직한 후기와 피드백을 들려주세요."
      />

      {/* Event banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-violet-700 p-6 text-white shadow-lift">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
            <Calendar className="h-3.5 w-3.5" />
            2026.06.28 ~ 07.31
          </div>
          <h2 className="mt-3 flex items-center gap-2 text-xl font-extrabold sm:text-2xl">
            <Gift className="h-6 w-6" />
            후기 작성하면 추첨 선물 증정
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-50">
            기간 내 잡루트의 기능을 사용해보고 후기·피드백을 남겨주신 분들 중
            추첨을 통해 선물을 드려요.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-xl bg-[#03C75A] px-3 py-2 text-sm font-bold text-white shadow-sm">
              네이버페이 상품권 1만원 · 3명
            </span>
            <span className="rounded-xl bg-amber-400 px-3 py-2 text-sm font-bold text-ink-900 shadow-sm">
              🍔 싸이버거 기프티콘 · 5명
            </span>
          </div>
          <p className="mt-3 text-xs text-brand-100">
            경품 수령을 위해 후기 작성 시 전화번호를 남겨주세요.
          </p>
        </div>
      </div>

      {authLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : !isAuthed ? (
        <Card className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-glow">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-ink-900">
            로그인하고 후기를 남겨보세요
          </h3>
          <p className="mt-1.5 text-sm text-ink-500">
            추첨 응모와 경품 안내를 위해 로그인이 필요해요.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/login">
              <Button>로그인</Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary">회원가입</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Form */}
          <Card>
            <h3 className="flex items-center gap-2 font-bold text-ink-900">
              <MessageSquareText className="h-4 w-4 text-brand-500" />
              후기 작성
            </h3>
            <div className="mt-4 space-y-4">
              <Textarea
                label="후기 · 피드백"
                placeholder="어떤 점이 좋았는지, 불편했던 점이나 개선했으면 하는 점을 자유롭게 적어주세요. (5자 이상)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                hint={`${content.trim().length}자 · 5자 이상`}
              />
              <Input
                label="전화번호 (경품 받으려면 필수)"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone className="h-4 w-4" />}
                hint="후기만 남기셔도 되지만, 추첨 경품을 받으려면 전화번호가 필요해요. 본인과 운영자만 볼 수 있어요."
              />
              <Button
                onClick={submit}
                loading={submitting}
                fullWidth
                size="lg"
                disabled={content.trim().length < 5}
              >
                후기 남기고 추첨 응모하기
              </Button>
            </div>
          </Card>

          {/* My feedback */}
          <section>
            <h3 className="mb-3 font-bold text-ink-900">내가 남긴 후기</h3>
            {loadingMine ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : mine.length === 0 ? (
              <EmptyState
                icon={<MessageSquareText className="h-7 w-7" />}
                title="아직 남긴 후기가 없어요"
                description="위에서 첫 후기를 남겨보세요."
              />
            ) : (
              <div className="space-y-3">
                {mine.map((f) => (
                  <Card key={f.id}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                      {f.content}
                    </p>
                    <p className="mt-2 text-xs text-ink-400">
                      {formatRelativeDate(f.createdAt)}
                      {f.phone ? " · 연락처 등록됨" : ""}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Admin: all feedback */}
          {adminList && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 font-bold text-ink-900">
                전체 후기
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-600 ring-1 ring-inset ring-brand-100">
                  관리자 · {adminList.length}
                </span>
              </h3>
              {adminList.length === 0 ? (
                <p className="text-sm text-ink-500">아직 후기가 없어요.</p>
              ) : (
                <div className="space-y-3">
                  {adminList.map((f) => (
                    <Card key={f.id}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                        {f.content}
                      </p>
                      <p className="mt-2 text-xs text-ink-400">
                        {f.user?.name || "사용자"} · {f.user?.email || "-"} ·{" "}
                        {f.phone || "연락처 없음"} · {formatRelativeDate(f.createdAt)}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

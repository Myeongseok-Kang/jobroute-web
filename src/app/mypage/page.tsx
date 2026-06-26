"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  History,
  Bell,
  BellOff,
  Trash2,
  Sparkles,
  ChevronRight,
  FileText,
  Type,
  SlidersHorizontal,
  Mail,
  Settings,
  KeyRound,
  LogOut,
} from "lucide-react";
import {
  bookmarkApi,
  matchHistoryApi,
  alertApi,
  resumeApi,
  authApi,
  ApiError,
} from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Reveal } from "@/components/Reveal";
import type {
  Job,
  MatchHistory,
  AlertConfig,
  Resume,
} from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AuthGuard, PageContainer, PageHeader } from "@/components/AuthGuard";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Card, EmptyState, Skeleton } from "@/components/ui/Misc";
import { JobCard, JobCardSkeleton } from "@/components/JobCard";
import { MatchResultView } from "@/components/MatchCard";
import { formatRelativeDate, formatDate, getInitial } from "@/lib/utils";

type TabKey = "bookmarks" | "history" | "alert" | "account";

export default function MyPage() {
  return (
    <AuthGuard>
      <MyPageInner />
    </AuthGuard>
  );
}

function MyPageInner() {
  const { user } = useAuth();
  const [tab, setTab] = useState<TabKey>("bookmarks");

  return (
    <PageContainer>
      <div className="relative mb-8 flex animate-fade-in items-center gap-4 overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-600 via-brand-600 to-violet-700 p-6 shadow-lift">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
        <div
          className="pointer-events-none absolute -bottom-16 left-1/3 h-44 w-44 rounded-full bg-violet-300/20 blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
        />
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            className="relative h-16 w-16 rounded-2xl object-cover shadow-soft ring-2 ring-white/50"
          />
        ) : (
          <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold text-white shadow-soft ring-2 ring-white/30 backdrop-blur">
            {getInitial(user?.name, user?.email)}
          </span>
        )}
        <div className="relative min-w-0">
          <h1 className="truncate text-xl font-extrabold text-white">
            {user?.name || "사용자"}님
          </h1>
          <p className="truncate text-sm text-brand-100">{user?.email}</p>
        </div>
      </div>

      <Tabs
        items={[
          {
            value: "bookmarks",
            label: "북마크",
            icon: <Bookmark className="h-4 w-4" />,
          },
          {
            value: "history",
            label: "매칭 이력",
            icon: <History className="h-4 w-4" />,
          },
          { value: "alert", label: "알림 설정", icon: <Bell className="h-4 w-4" /> },
          {
            value: "account",
            label: "계정 설정",
            icon: <Settings className="h-4 w-4" />,
          },
        ]}
        value={tab}
        onChange={(v) => setTab(v as TabKey)}
        className="mb-6"
      />

      {tab === "bookmarks" && <BookmarksTab />}
      {tab === "history" && <HistoryTab />}
      {tab === "alert" && <AlertTab />}
      {tab === "account" && <AccountTab />}
    </PageContainer>
  );
}

function BookmarksTab() {
  const toast = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setJobs(await bookmarkApi.list());
    } catch {
      toast.error("북마크를 불러오지 못했어요");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onBookmarkChange = (jobId: string, bookmarked: boolean) => {
    if (!bookmarked) setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark className="h-7 w-7" />}
        title="북마크한 공고가 없어요"
        description="관심 있는 공고를 북마크하면 여기에 모아볼 수 있어요."
        action={
          <Link href="/jobs">
            <Button>공고 탐색하기</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job, i) => (
        <Reveal key={job.id} delay={Math.min(i, 8) * 50} className="h-full">
          <JobCard
            job={job}
            bookmarked
            onBookmarkChange={onBookmarkChange}
          />
        </Reveal>
      ))}
    </div>
  );
}

const INPUT_TYPE_META: Record<
  string,
  { label: string; icon: typeof Type }
> = {
  resume: { label: "이력서 매칭", icon: FileText },
  text: { label: "자유 텍스트", icon: Type },
  conditions: { label: "조건 선택", icon: SlidersHorizontal },
};

function HistoryTab() {
  const toast = useToast();
  const [items, setItems] = useState<MatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<MatchHistory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MatchHistory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await matchHistoryApi.list());
    } catch {
      toast.error("매칭 이력을 불러오지 못했어요");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await matchHistoryApi.remove(deleteTarget.id);
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      toast.success("이력을 삭제했어요");
      setDeleteTarget(null);
    } catch {
      toast.error("삭제에 실패했어요");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="mt-3 h-4 w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<History className="h-7 w-7" />}
        title="매칭 이력이 없어요"
        description="이력서로 AI 매칭을 실행하면 결과가 자동으로 저장돼요."
        action={
          <Link href="/matching">
            <Button>
              <Sparkles className="h-4 w-4" />
              매칭하러 가기
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((h) => {
          const meta = INPUT_TYPE_META[h.inputType] || {
            label: h.inputType,
            icon: Sparkles,
          };
          const Icon = meta.icon;
          const count =
            (h.result?.recommended?.length || 0) +
            (h.result?.moreCandidates?.length || 0);
          return (
            <Card key={h.id} className="transition hover:shadow-card">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-500 ring-1 ring-inset ring-brand-100">
                  <Icon className="h-5 w-5" />
                </span>
                <button
                  onClick={() => setViewing(h)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-ink-100 px-2 py-0.5 text-xs font-bold text-ink-600">
                      {meta.label}
                    </span>
                    <span className="text-xs text-ink-400">
                      {formatRelativeDate(h.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-sm text-ink-700">
                    {h.inputText || `매칭 결과 ${count}건`}
                  </p>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => setViewing(h)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
                  >
                    결과 보기
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(h)}
                    className="rounded-lg p-2 text-ink-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="매칭 결과"
        size="lg"
      >
        {viewing && (
          <div>
            <p className="mb-4 text-xs text-ink-400">
              {formatDate(viewing.createdAt)} ·{" "}
              {INPUT_TYPE_META[viewing.inputType]?.label || viewing.inputType}
            </p>
            {viewing.inputText && (
              <div className="mb-5 rounded-xl bg-ink-50 p-4 text-sm text-ink-600">
                {viewing.inputText}
              </div>
            )}
            <MatchResultView
              recommended={viewing.result?.recommended || []}
              moreCandidates={viewing.result?.moreCandidates || []}
              total={viewing.result?.total || 0}
            />
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
        loading={deleting}
        title="매칭 이력을 삭제할까요?"
        description="이 매칭 기록을 삭제합니다. 되돌릴 수 없어요."
      />
    </>
  );
}

/* ----------------------------- Alert ----------------------------- */
function AlertTab() {
  const toast = useToast();
  const [config, setConfig] = useState<AlertConfig | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [enabled, setEnabled] = useState(false);
  const [resumeId, setResumeId] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [cfg, rs] = await Promise.all([
        alertApi.get(),
        resumeApi.list(),
      ]);
      setConfig(cfg);
      setResumes(rs);
      setEnabled(cfg?.enabled ?? false);
      setResumeId(cfg?.resumeId || rs[0]?.id || "");
    } catch {
      toast.error("알림 설정을 불러오지 못했어요");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (nextEnabled: boolean, nextResumeId: string) => {
    if (nextEnabled && !nextResumeId) {
      toast.error("알림 기준이 될 이력서를 선택해주세요");
      return;
    }
    setSaving(true);
    try {
      const cfg = await alertApi.set({
        enabled: nextEnabled,
        resumeId: nextResumeId || undefined,
      });
      setConfig(cfg);
      setEnabled(cfg.enabled);
      toast.success(
        cfg.enabled ? "공고 알림을 켰어요" : "공고 알림을 껐어요"
      );
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "저장에 실패했어요");
      setEnabled((v) => !v); // revert toggle on failure
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-4 h-12 w-full" />
        <Skeleton className="mt-3 h-12 w-full" />
      </Card>
    );
  }

  if (resumes.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="h-7 w-7" />}
        title="먼저 이력서가 필요해요"
        description="알림은 기준 이력서와 새 공고를 매칭해 보내드려요. 이력서를 먼저 작성해주세요."
        action={
          <Link href="/resume">
            <Button>이력서 작성하기</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                enabled
                  ? "bg-brand-50 text-brand-500"
                  : "bg-ink-100 text-ink-400"
              }`}
            >
              {enabled ? (
                <Bell className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
            </span>
            <div>
              <h3 className="font-bold text-ink-900">매일 공고 알림</h3>
              <p className="mt-0.5 text-sm text-ink-500">
                매일 오전 9시, 마지막 발송 이후 새로 등록된 공고 중 이력서와
                잘 맞는 공고를 이메일로 보내드려요.
              </p>
            </div>
          </div>

          {/* Toggle */}
          <button
            role="switch"
            aria-checked={enabled}
            disabled={saving}
            onClick={() => {
              const next = !enabled;
              setEnabled(next);
              save(next, resumeId);
            }}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              enabled
                ? "bg-gradient-to-r from-brand-500 to-violet-600 shadow-btn"
                : "bg-ink-300"
            } ${saving ? "opacity-60" : ""}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                enabled ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="flex items-center gap-2 font-bold text-ink-900">
          <FileText className="h-4 w-4 text-brand-500" />
          기준 이력서
        </h3>
        <p className="mt-1 text-sm text-ink-500">
          이 이력서와 매칭 점수가 높은 새 공고를 알림으로 받아요.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              options={resumes.map((r) => ({
                value: r.id,
                label: r.title || "제목 없는 이력서",
              }))}
            />
          </div>
          <Button
            onClick={() => save(enabled, resumeId)}
            loading={saving}
            variant="secondary"
          >
            기준 저장
          </Button>
        </div>
      </Card>

      {config?.lastSentAt && (
        <div className="flex items-center gap-2 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-500">
          <Mail className="h-4 w-4 text-ink-400" />
          마지막 발송: {formatRelativeDate(config.lastSentAt)}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Account ----------------------------- */
function AccountTab() {
  const { user, refresh, logout } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const isLocal = (user?.provider ?? "local") === "local";

  const [name, setName] = useState(user?.name ?? "");
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const saveName = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("이름을 입력해주세요");
      return;
    }
    setSavingName(true);
    try {
      await authApi.updateProfile({ name: trimmed });
      await refresh();
      toast.success("프로필을 저장했어요");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "저장에 실패했어요");
    } finally {
      setSavingName(false);
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("새 비밀번호는 8자 이상이어야 해요");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("새 비밀번호가 일치하지 않아요");
      return;
    }
    setChangingPw(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("비밀번호를 변경했어요");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "변경에 실패했어요");
    } finally {
      setChangingPw(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await authApi.deleteAccount();
      toast.success("회원 탈퇴가 완료되었어요");
      logout();
      router.push("/");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "탈퇴에 실패했어요");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Profile */}
      <Card>
        <h3 className="font-bold text-ink-900">프로필</h3>
        <p className="mt-1 text-sm text-ink-500">
          이름을 수정할 수 있어요. 프로필 사진은 소셜 로그인 사진을 사용해요.
        </p>
        <div className="mt-4 space-y-3">
          <Input
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
          />
          <Input
            label="이메일"
            value={user?.email ?? ""}
            disabled
            hint="이메일은 변경할 수 없어요"
          />
          <div className="flex justify-end">
            <Button onClick={saveName} loading={savingName} variant="secondary">
              저장
            </Button>
          </div>
        </div>
      </Card>

      {/* Password */}
      <Card>
        <h3 className="flex items-center gap-2 font-bold text-ink-900">
          <KeyRound className="h-4 w-4 text-brand-500" />
          비밀번호 변경
        </h3>
        {isLocal ? (
          <div className="mt-4 space-y-3">
            <Input
              label="현재 비밀번호"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="새 비밀번호"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              hint="8자 이상"
            />
            <Input
              label="새 비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={
                confirmPassword.length > 0 && newPassword !== confirmPassword
                  ? "비밀번호가 일치하지 않아요"
                  : undefined
              }
            />
            <div className="flex justify-end">
              <Button
                onClick={changePassword}
                loading={changingPw}
                variant="secondary"
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                변경
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-500">
            소셜 로그인 계정이라 비밀번호가 없어요.
          </p>
        )}
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200">
        <h3 className="flex items-center gap-2 font-bold text-red-600">
          <Trash2 className="h-4 w-4" />
          회원 탈퇴
        </h3>
        <p className="mt-1 text-sm text-ink-500">
          탈퇴하면 이력서, 북마크, 매칭 이력, 알림 설정이 모두 삭제되며 되돌릴 수
          없어요.
        </p>
        <div className="mt-4">
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            <LogOut className="h-4 w-4" />
            회원 탈퇴
          </Button>
        </div>
      </Card>

      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteAccount}
        loading={deleting}
        title="정말 탈퇴할까요?"
        description="이력서·북마크·매칭 이력·알림 설정이 모두 삭제됩니다. 되돌릴 수 없어요."
      />
    </div>
  );
}

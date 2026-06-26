"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { resumeApi, ApiError } from "@/lib/api";
import type { Resume } from "@/lib/types";
import { useToast } from "@/context/ToastContext";
import { AuthGuard, PageContainer, PageHeader } from "@/components/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Card, EmptyState, Skeleton } from "@/components/ui/Misc";
import { formatRelativeDate } from "@/lib/utils";

export default function ResumePage() {
  return (
    <AuthGuard>
      <ResumeManager />
    </AuthGuard>
  );
}

function ResumeManager() {
  const toast = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Resume | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const rs = await resumeApi.list();
      setResumes(rs);
    } catch {
      toast.error("이력서를 불러오지 못했어요");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setTitle("");
    setContent("");
    setEditorOpen(true);
  };

  const openEdit = (r: Resume) => {
    setEditing(r);
    setTitle(r.title || "");
    setContent(r.content);
    setEditorOpen(true);
  };

  const save = async () => {
    if (content.trim().length < 10) {
      toast.error("이력서 내용을 10자 이상 입력해주세요");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await resumeApi.update(editing.id, {
          title: title || undefined,
          content,
        });
        toast.success("이력서를 수정했어요");
      } else {
        await resumeApi.create({ title: title || undefined, content });
        toast.success("이력서를 저장했어요");
      }
      setEditorOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "저장에 실패했어요");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await resumeApi.remove(deleteTarget.id);
      toast.success("이력서를 삭제했어요");
      setDeleteTarget(null);
      await load();
    } catch {
      toast.error("삭제에 실패했어요");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow="이력서 관리"
          title="내 이력서"
          description="여러 버전의 이력서를 저장하고 매칭·자소서·면접 준비에 활용하세요."
        />
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" />새 이력서
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <Card key={i}>
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </Card>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7" />}
          title="아직 이력서가 없어요"
          description="첫 이력서를 작성하면 AI 매칭, 자소서 초안, 면접 질문에 바로 활용할 수 있어요."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" />첫 이력서 작성하기
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {resumes.map((r) => (
            <Card key={r.id} className="flex flex-col" hover>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-ink-900">
                      {r.title || "제목 없는 이력서"}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-ink-400">
                      <Clock className="h-3 w-3" />
                      {formatRelativeDate(r.updatedAt)} 수정
                    </p>
                  </div>
                </div>
              </div>
              <p className="prose-content mt-3 line-clamp-3 flex-1 text-sm text-ink-600">
                {r.content}
              </p>
              <div className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-4">
                <Link
                  href={`/matching`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-100"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  매칭하기
                </Link>
                <button
                  onClick={() => openEdit(r)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold text-ink-500 transition hover:bg-ink-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  수정
                </button>
                <button
                  onClick={() => setDeleteTarget(r)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  삭제
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editing ? "이력서 수정" : "새 이력서 작성"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditorOpen(false)}>
              취소
            </Button>
            <Button onClick={save} loading={saving}>
              {editing ? "수정 완료" : "저장하기"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="제목 (선택)"
            placeholder="예) 백엔드 개발자 이력서 v2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="이력서 내용"
            placeholder={
              "경력, 기술 스택, 주요 프로젝트, 성과 등을 자유롭게 작성하세요.\n\n예)\n• 3년차 백엔드 개발자\n• 주요 기술: NestJS, TypeScript, PostgreSQL, Redis, AWS\n• 핀테크 결제 시스템 MSA 설계 및 개발\n• 일 거래 100만 건 처리 시스템 운영"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            hint={`${content.length}자 · 상세할수록 매칭 정확도가 올라가요.`}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
        loading={deleting}
        title="이력서를 삭제할까요?"
        description={`"${
          deleteTarget?.title || "제목 없는 이력서"
        }"을(를) 삭제합니다. 이 작업은 되돌릴 수 없어요.`}
      />
    </PageContainer>
  );
}

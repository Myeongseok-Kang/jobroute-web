"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in-fast"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full ${SIZES[size]} animate-sheet-up overflow-hidden rounded-t-3xl bg-white shadow-lift sm:animate-scale-in sm:rounded-3xl`}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-violet-500 to-brand-500" />
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-ink-200 sm:hidden" />
        {title && (
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <h3 className="text-lg font-bold text-ink-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-ink-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "정말 삭제할까요?",
  description,
  confirmText = "삭제",
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  loading?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-ink-600">
        {description || "이 작업은 되돌릴 수 없습니다."}
      </p>
    </Modal>
  );
}

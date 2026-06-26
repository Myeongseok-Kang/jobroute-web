"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Briefcase,
  Sparkles,
  FileText,
  PenLine,
  MessageSquareText,
  User,
  LogIn,
  UserPlus,
  Search,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Command = {
  label: string;
  href: string;
  icon: typeof Home;
  keywords?: string;
};

const COMMANDS: Command[] = [
  { label: "홈", href: "/", icon: Home, keywords: "home main" },
  { label: "공고 탐색", href: "/jobs", icon: Briefcase, keywords: "jobs 채용 공고 검색" },
  { label: "AI 매칭", href: "/matching", icon: Sparkles, keywords: "matching 추천" },
  { label: "이력서", href: "/resume", icon: FileText, keywords: "resume 이력" },
  { label: "자소서", href: "/cover-letter", icon: PenLine, keywords: "cover letter 자기소개서" },
  { label: "면접 질문", href: "/interview", icon: MessageSquareText, keywords: "interview 면접" },
  { label: "마이페이지", href: "/mypage", icon: User, keywords: "mypage account 계정 북마크" },
  { label: "로그인", href: "/login", icon: LogIn, keywords: "login signin" },
  { label: "회원가입", href: "/register", icon: UserPlus, keywords: "register signup 가입" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) =>
      `${c.label} ${c.keywords ?? ""}`.toLowerCase().includes(q)
    );
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [router, close]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("jobroute:command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("jobroute:command", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) go(cmd.href);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-ink-900/30 backdrop-blur-sm animate-fade-in-fast"
        onClick={close}
      />
      <div
        className="relative w-full max-w-xl origin-top animate-scale-in overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-lift"
        onKeyDown={onListKey}
      >
        <div className="flex items-center gap-3 border-b border-ink-100 px-4">
          <Search className="h-5 w-5 shrink-0 text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="어디로 갈까요? 페이지를 검색하세요"
            className="h-14 w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
          />
          <kbd className="hidden shrink-0 rounded-md border border-ink-200 px-1.5 py-0.5 text-[11px] font-semibold text-ink-400 sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-ink-400">
              결과가 없어요
            </p>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.href}
                  onClick={() => go(cmd.href)}
                  onMouseMove={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                    i === active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-700"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      i === active ? "text-brand-600" : "text-ink-400"
                    )}
                  />
                  {cmd.label}
                  {i === active && (
                    <CornerDownLeft className="ml-auto h-3.5 w-3.5 text-brand-400" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

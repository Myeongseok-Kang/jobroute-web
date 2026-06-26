"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Sparkles,
  FileText,
  PenLine,
  MessageSquareText,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { cn, getInitial } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/jobs", label: "공고 탐색", icon: Briefcase },
  { href: "/matching", label: "AI 매칭", icon: Sparkles },
  { href: "/resume", label: "이력서", icon: FileText },
  { href: "/cover-letter", label: "자소서", icon: PenLine },
  { href: "/interview", label: "면접 질문", icon: MessageSquareText },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthed, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300 glass",
        scrolled ? "border-ink-200/70 shadow-soft" : "border-ink-200/40"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="transition-transform duration-200 hover:scale-[1.04] active:scale-95"
          >
            <Logo />
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all",
                    active
                      ? "bg-gradient-to-b from-brand-50 to-brand-100 text-brand-700 shadow-sm ring-1 ring-inset ring-brand-100"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("jobroute:command"))
            }
            className="hidden items-center gap-2 rounded-xl border border-ink-200/70 bg-white/60 px-2.5 py-1.5 text-xs font-medium text-ink-400 transition hover:border-ink-300 hover:text-ink-600 lg:flex"
            aria-label="빠른 이동 검색"
          >
            <Search className="h-3.5 w-3.5" />
            <span>빠른 이동</span>
            <kbd className="rounded border border-ink-200 bg-ink-50 px-1 text-[10px] font-semibold text-ink-500">
              ⌘K
            </kbd>
          </button>
          {loading ? (
            <div className="h-9 w-20 skeleton rounded-xl" />
          ) : isAuthed ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2.5 transition hover:bg-ink-50"
              >
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt=""
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 text-sm font-bold text-white">
                    {getInitial(user?.name, user?.email)}
                  </span>
                )}
                <span className="max-w-[7rem] truncate text-sm font-semibold text-ink-700">
                  {user?.name || user?.email}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-ink-400 transition-transform",
                    menuOpen && "rotate-180"
                  )}
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 origin-top-right animate-scale-in overflow-hidden rounded-2xl border border-ink-200/70 bg-white p-1.5 shadow-card">
                  <div className="border-b border-ink-100 px-3 py-2.5">
                    <p className="truncate text-sm font-bold text-ink-900">
                      {user?.name || "사용자"}
                    </p>
                    <p className="truncate text-xs text-ink-500">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    href="/mypage"
                    className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
                  >
                    <UserIcon className="h-4 w-4 text-ink-400" />
                    마이페이지
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">무료로 시작하기</Button>
              </Link>
            </div>
          )}

          <ThemeToggle />

          <button
            className="rounded-xl p-2 text-ink-600 transition hover:bg-ink-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="메뉴"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="animate-fade-in border-t border-ink-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold",
                    isActive(link.href)
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-600"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-3 border-t border-ink-100 pt-3">
            {isAuthed ? (
              <div className="flex flex-col gap-1">
                <Link
                  href="/mypage"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-700"
                >
                  <UserIcon className="h-4 w-4 text-ink-400" />
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button variant="secondary" fullWidth>
                    로그인
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button fullWidth>시작하기</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

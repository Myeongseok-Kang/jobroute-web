"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Sparkles, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "홈", icon: Home, exact: true },
  { href: "/jobs", label: "공고", icon: Briefcase },
  { href: "/matching", label: "매칭", icon: Sparkles },
  { href: "/resume", label: "이력서", icon: FileText },
  { href: "/mypage", label: "마이", icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200/70 glass pb-safe md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href, tab.exact);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2.5 active:scale-95"
            >
              {active && (
                <span className="absolute top-0 h-0.5 w-9 rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  active ? "text-brand-600" : "text-ink-400"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold transition-colors",
                  active ? "text-brand-600" : "text-ink-400"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

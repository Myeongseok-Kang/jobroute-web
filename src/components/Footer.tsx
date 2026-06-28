import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-ink-200/60 bg-white">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <Logo />
          </div>
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <FooterCol
              title="서비스"
              links={[
                { href: "/jobs", label: "공고 탐색" },
                { href: "/matching", label: "AI 매칭" },
                { href: "/resume", label: "이력서 관리" },
              ]}
            />
            <FooterCol
              title="도구"
              links={[
                { href: "/cover-letter", label: "자소서 도우미" },
                { href: "/interview", label: "면접 질문" },
                { href: "/mypage", label: "마이페이지" },
              ]}
            />
            <FooterCol
              title="계정"
              links={[
                { href: "/login", label: "로그인" },
                { href: "/register", label: "회원가입" },
              ]}
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-ink-100 pt-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 JobRoute. 수익을 창출하지 않는 포트폴리오 프로젝트입니다.</span>
          <span className="flex gap-4">
            <Link
              href="/feedback"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              후기 이벤트
            </Link>
            <Link href="/terms" className="hover:text-brand-600">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-brand-600">
              개인정보처리방침
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm font-medium text-ink-600 transition hover:text-brand-600"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

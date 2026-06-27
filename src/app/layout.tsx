import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { ScrollTools } from "@/components/ScrollTools";
import { MobileTabBar } from "@/components/MobileTabBar";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jobroute.kr";
const DESCRIPTION =
  "흩어진 IT 채용 공고를 한곳에서. AI 하이브리드 매칭으로 당신에게 꼭 맞는 자리를 찾고, 자소서와 면접까지 준비하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "JobRoute — AI 채용 매칭 플랫폼",
    template: "%s | JobRoute",
  },
  description: DESCRIPTION,
  applicationName: "JobRoute",
  keywords: ["채용", "구직", "AI 매칭", "이력서", "자소서", "면접", "IT 개발자"],
  authors: [{ name: "JobRoute" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "JobRoute",
    title: "JobRoute — AI 채용 매칭 플랫폼",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "JobRoute — AI 채용 매칭 플랫폼",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <AuthProvider>
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-700 focus:shadow-card"
            >
              본문 바로가기
            </a>
            <ScrollTools />
            <CommandPalette />
            <div className="flex min-h-screen flex-col pb-16 md:pb-0">
              <Navbar />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <MobileTabBar />
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}

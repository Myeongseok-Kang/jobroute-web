"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollTools() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
      setShow(el.scrollTop > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-violet-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로"
        className={cn(
          "fixed bottom-6 right-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-ink-200/70 bg-white text-ink-600 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:text-brand-600 hover:shadow-lift",
          show
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}

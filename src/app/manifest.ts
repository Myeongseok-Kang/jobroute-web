import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JobRoute — AI 채용 매칭 플랫폼",
    short_name: "JobRoute",
    description:
      "AI 하이브리드 매칭으로 IT 채용 공고를 찾고, 자소서와 면접까지 준비하세요.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8fc",
    theme_color: "#4f46e5",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}

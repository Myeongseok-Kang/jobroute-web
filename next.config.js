/** @type {import('next').NextConfig} */

// 브라우저는 같은 출처(localhost:3001)의 /api/backend/* 로 요청하고,
// Next가 이를 백엔드로 프록시한다 → CORS 불필요.
let BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "https://api.jobroute.kr";
if (!/^https?:\/\//.test(BACKEND_ORIGIN)) {
  BACKEND_ORIGIN = "https://api.jobroute.kr";
}

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${BACKEND_ORIGIN}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

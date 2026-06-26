/** @type {import('next').NextConfig} */

// 브라우저는 같은 출처(localhost:3001)의 /api/backend/* 로 요청하고,
// Next가 이를 백엔드로 프록시한다 → CORS 불필요.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "http://localhost:3000";

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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /* 개발 서버 허용 */
  experimental: {
    serverActions: {
      allowedOrigins: [
        "192.168.219.188:3000",
        "192.168.219.111:3000",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;

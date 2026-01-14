import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 모든 봇에게 기본적으로 허용
      {
        userAgent: "*",
        allow: "/",
      },
      // 특정 AI 봇들은 차단
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "CCBot",
          "PerplexityBot",
          "Amazonbot",
          "FacebookBot",
          "Google-Extended",
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://haruword.com/sitemap.xml",
  };
}

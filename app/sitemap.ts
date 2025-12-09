import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://haruword.com",
      lastModified: new Date(),
      changeFrequency: "daily", // 매일 바뀌니까 'daily'로 설정
      priority: 1,
    },
    // 추후 페이지 늘어날 시 추가
  ];
}

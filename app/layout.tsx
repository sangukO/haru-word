import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getFormattedDate } from "@/utils/date";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { supabase } from "@/utils/supabase";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";

// 프리텐다드 폰트 설정
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap", // 글자 안 보임 방지
  weight: "45 920", // 가변 폰트 범위 설정
  variable: "--font-pretendard",
});

// 메타데이터 설정
export const metadata: Metadata = {
  metadataBase: new URL("https://haruword.com"),
  title: {
    template: "%s | 하루단어",
    default: "하루단어 | 오늘의 어휘",
  },
  description:
    "매일 자정, 당신의 일상에 지적인 결을 더합니다. 바쁜 성인을 위한 하루 한 단어 큐레이션 서비스.",
  keywords: [
    "하루단어",
    "오늘의단어",
    "어휘력",
    "문해력",
    "사자성어",
    "순우리말",
    "직장인자기계발",
    "단어장",
    "맞춤법",
  ],
  authors: [{ name: "OSOSO" }],
  creator: "OSOSO",
  icons: {
    icon: "/favicon.ico",
  },
  // OpenGraph 메타데이터 (공유 시 미리보기) 정보
  openGraph: {
    title: "오늘 당신의 어휘는 안녕하신가요? 📩",
    description:
      "하루 딱 하나, 부담 없이 채우는 어른의 문해력 습관. 오늘의 단어를 확인해보세요.",
    siteName: "하루단어 (Haru Word)",
    locale: "ko_KR",
    type: "website",
    url: "https://haryword.com",
    // 썸네일 이미지 추가 시 주석 해제
    // images: [
    //   {
    //     url: "./favicon.ico",
    //     width: 1200,
    //     height: 630,
    //     alt: "하루단어 서비스 미리보기",
    //   },
    // ],
  },

  // 로봇 메타데이터 설정
  robots: {
    index: true,
    follow: true,
  },

  // 구글 서치 콘솔 인증
  verification: {
    google: "lOzC-C_gyK_kCO_LE-L4vCqilUsvZ7l1mselOssRi7U",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 유저 정보 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const todayFormatted = getFormattedDate();

  // 서버에서 방문자 수 가져오기
  let initialView = 0;
  try {
    const { data } = await supabase
      .from("site_stats")
      .select("total_views")
      .single();

    if (data) {
      initialView = data.total_views;
    }
  } catch (error) {
    console.error("Counter Fetch Error:", error);
  }

  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} font-sans h-dvh flex flex-col justify-between`}
      >
        <Header
          user={user}
          todayFormatted={todayFormatted}
          initialView={initialView}
        />
        {children}
        <footer className="w-full text-center text-xs py-6 mt-auto text-sub">
          © 2025 Haru Word. All rights reserved. Created by OSOSO.
        </footer>
        <GoogleAnalytics gaId="G-782YRDQX7Q" />
      </body>
    </html>
  );
}

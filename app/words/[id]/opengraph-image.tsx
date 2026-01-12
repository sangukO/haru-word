// app/word/[id]/opengraph-image.tsx

import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { getWordById } from "@/services/wordService";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // ✅ 디버깅용: 콘솔에 찍히는지 확인 (터미널 확인)
  console.log("OG Image 생성 시작 ID:", id);

  try {
    // 개발 환경(localhost)과 배포 환경(URL)을 구분해야 함
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const fontUrl = `${baseUrl}/fonts/Pretendard-Bold.ttf`;

    const fontData = await fetch(fontUrl).then((res) => {
      if (!res.ok) throw new Error(`폰트 로딩 실패: ${res.statusText}`);
      return res.arrayBuffer();
    });

    // 2. Supabase 연결
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: word, error } = await getWordById(supabase, id);

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error("DB Error");
    }

    if (!word) {
      console.log("단어 없음");
      return new ImageResponse(<div>단어를 찾을 수 없습니다.</div>, {
        ...size,
      });
    }

    return new ImageResponse(
      (
        // 썸네일 디자인 (Tailwind CSS 스타일 사용 가능)
        <div
          style={{
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: '"Pretendard"',
          }}
        >
          {/* 상단 장식/로고 */}
          <div style={{ fontSize: 32, color: "#888", marginBottom: 20 }}>
            하루단어
          </div>

          {/* 카테고리 (Badge 스타일) */}
          {word.category && (
            <div
              style={{
                padding: "8px 20px",
                borderRadius: "50px",
                backgroundColor: word.category.color || "#eee", // 카테고리 색상 활용
                color: "#fff",
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 40,
              }}
            >
              {word.category.name}
            </div>
          )}

          {/* 메인 단어 */}
          <div
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: "#111",
              marginBottom: 20,
              lineHeight: 1.1,
            }}
          >
            {word.word}
          </div>

          {/* 도메인 주소 */}
          <div style={{ marginTop: 60, fontSize: 30, color: "#aaa" }}>
            haruword.com
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Pretendard",
            data: fontData,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (e) {
    // ❌ 에러 발생 시 터미널에 로그 출력
    console.error("OG Image 생성 실패:", e);

    // 에러 났을 때 보여줄 기본 이미지 (폰트 없이)
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 50,
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          이미지 생성 오류
        </div>
      ),
      { ...size }
    );
  }
}

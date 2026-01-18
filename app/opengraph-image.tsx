import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";
import { getTodayDate } from "@/utils/date";

export const runtime = "nodejs";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const revalidate = 3600;

export default async function Image() {
  try {
    // 폰트 로드
    const fontPath = join(
      process.cwd(),
      "public",
      "fonts",
      "Pretendard-Bold.ttf"
    );
    const fontData = readFileSync(fontPath);

    // Supabase 연결
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 오늘 날짜 구하기
    const today = getTodayDate();

    // 오늘 날짜에 해당하는 단어 1개 가져오기
    const { data: word } = await supabase
      .from("words")
      .select("*, category:categories(*)")
      .eq("date", today)
      .single();

    if (!word) {
      return new ImageResponse(
        (
          <div
            style={{
              background: "white",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 80,
              fontWeight: 900,
            }}
          >
            하루단어
          </div>
        ),
        { ...size }
      );
    }

    return new ImageResponse(
      (
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
          {/* 상단 로고 */}
          <div style={{ fontSize: 32, color: "#888", marginBottom: 20 }}>
            하루단어
          </div>

          {/* 카테고리 */}
          {word.category && (
            <div
              style={{
                padding: "8px 20px",
                borderRadius: "50px",
                backgroundColor: word.category.color || "#eee",
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
    console.error("메인 화면 OG Image 생성 실패:", e);
    return new ImageResponse(
      (
        <div
          style={{
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 50,
          }}
        >
          하루단어
        </div>
      ),
      { ...size }
    );
  }
}

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
    const fontPath = join(
      process.cwd(),
      "public",
      "fonts",
      "Pretendard-Bold.ttf"
    );
    const fontData = readFileSync(fontPath);

    // 로고 이미지 로드 및 Base64 변환
    const logoPath = join(process.cwd(), "public", "icon.png");
    const logoData = readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const today = getTodayDate();

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
            background: "#fdfdfd",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: '"Pretendard"',
            padding: "60px 40px",
          }}
        >
          {/* 로고, 브랜드명, 슬로건 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <img
                src={logoBase64}
                width="40"
                height="40"
                style={{ marginRight: 12 }}
              />
              <div style={{ fontSize: 36, color: "#111", fontWeight: 800 }}>
                하루단어
              </div>
            </div>
            <div style={{ fontSize: 20, color: "#666", fontWeight: 500 }}>
              매일 하나씩 쌓이는 교양
            </div>
          </div>

          {/* 오늘의 단어 카드 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              padding: "50px 100px",
              borderRadius: "40px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
              border: "1px solid #f1f5f9",
            }}
          >
            {word.category && (
              <div
                style={{
                  padding: "6px 16px",
                  borderRadius: "50px",
                  backgroundColor: word.category.color || "#eee",
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 24,
                }}
              >
                {word.category.name}
              </div>
            )}
            <div
              style={{
                fontSize: 140,
                fontWeight: 900,
                color: "#111",
                lineHeight: 1,
                letterSpacing: "-4px",
              }}
            >
              {word.word}
            </div>
          </div>

          {/* 도메인 */}
          <div
            style={{
              fontSize: 24,
              color: "#aaa",
              letterSpacing: "2px",
              fontWeight: 500,
            }}
          >
            haruword.com
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          { name: "Pretendard", data: fontData, style: "normal", weight: 700 },
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

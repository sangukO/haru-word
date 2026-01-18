import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { getWordById } from "@/services/wordService";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("OG Image 생성 시작 ID:", id);

  try {
    // 환경변수 없이 파일 시스템에서 폰트 로드
    const fontPath = join(
      process.cwd(),
      "public",
      "fonts",
      "Pretendard-Bold.ttf"
    );
    const fontData = readFileSync(fontPath);

    const logoPath = join(process.cwd(), "public", "icon.png");
    const logoData = readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: word } = await getWordById(supabase, id);

    if (!word) return new ImageResponse(<div>Not Found</div>, { ...size });

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
            padding: "80px 40px",
          }}
        >
          {/* 작은 로고, 브랜드명 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logoBase64}
              width="32"
              height="32"
              style={{ marginRight: 10 }}
            />
            <div style={{ fontSize: 30, color: "#888", fontWeight: 600 }}>
              하루단어
            </div>
          </div>

          {/* 단어 카드 디자인 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              padding: "40px 100px",
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
                  marginBottom: 20,
                }}
              >
                {word.category.name}
              </div>
            )}
            <div
              style={{
                fontSize: 120,
                fontWeight: 900,
                color: "#111",
                lineHeight: 1,
                letterSpacing: "-3px",
              }}
            >
              {word.word}
            </div>
          </div>

          {/* 도메인 주소 */}
          <div style={{ fontSize: 24, color: "#ccc", letterSpacing: "2px" }}>
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
    console.error("OG Image 생성 실패:", e);
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

import Image from "next/image";
import { supabase } from "@/utils/supabase";
import { getTodayDate } from "@/utils/date";
import { DEFAULT_THEME_COLOR } from "@/constants/theme";
import MidnightUpdater from "@/components/MidnightUpdater";

// 캐싱 방지 설정
export const dynamic = "force-dynamic";

export default async function Home() {
  const today = getTodayDate();
  // Supabase에서 오늘 날짜의 단어를 가져옴
  const { data: word, error } = await supabase
    .from("words")
    .select("*")
    .eq("date", today)
    .single();

  const accentColor = word.color ?? DEFAULT_THEME_COLOR;

  if (error || !word) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">
          오늘의 단어가 아직 도착하지 않았어요. 🚚
        </h1>
        <p>관리자가 열심히 배달 중입니다!</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-12">
      <MidnightUpdater />
      <article className="max-w-[1200px] w-full text-center">
        {/* 단어 제목 및 한자*/}
        <div
          className="mb-6"
          style={
            {
              "--accent": accentColor,
            } as React.CSSProperties
          }
        >
          {word.hanja && (
            <span
              className="font-extrabold transition-all duration-300
              font-serif text-6xl md:text-9xl
              text-[#111111] dark:text-[#F1F1F1]
              [text-shadow:5px_5px_3px_var(--accent)] dark:[text-shadow:5px_5px_3px_var(--accent)]
              block mb-4"
            >
              {word.hanja}
            </span>
          )}
          <div className="relative inline-flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight break-keep">
              {word.word}
            </h1>
          </div>
        </div>
        {/* 뜻 */}
        <div className="mb-12">
          <p className="text-xl font-bold leading-relaxed break-keep">
            {word.meaning}
          </p>
        </div>

        {/* 예문 카드 */}
        <p className="text-lg leading-relaxed font-serif italic break-keep mb-12">
          "{word.example}"
        </p>

        {/* 구분선 */}
        <div className="w-8 h-px bg-[#D0D0D0] dark:bg-[#333] mx-auto"></div>

        {/* 유래 및 정보 (있을 때만 표시) */}
        {word.detail && (
          <div className="mt-8 text-sm bg-gray-50 dark:bg-[#1e1e1e] border border-transparent dark:border-gray-800 px-4 py-3 rounded-lg inline-block break-keep">
            💡 {word.detail}
          </div>
        )}
      </article>
    </main>
  );
}

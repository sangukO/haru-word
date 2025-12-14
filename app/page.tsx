import Image from "next/image";
import { supabase } from "@/utils/supabase";
import { getTodayDate, offsetDate } from "@/utils/date";
import { DEFAULT_THEME_COLOR } from "@/constants/theme";
import MidnightUpdater from "@/components/MidnightUpdater";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";
import LoginButton from "@/components/LoginButton";
import PageLoginSection from "@/components/PageLoginSection";
import { createClient } from "@/utils/supabase/server";
import ColorSetter from "@/components/ColorSetter";

// 캐싱 방지 설정
export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = getTodayDate();
  // Supabase에서 오늘 날짜의 단어를 가져옴
  const { data: word, error } = await supabase
    .from("words")
    .select("*")
    .eq("date", today)
    .single();

  if (error || !word) {
    // DB에서 가장 최신 단어 날짜를 가져옴
    const { data: latest, error: latestError } = await supabase
      .from("words")
      .select("date")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (latestError || !latest) {
      return (
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center break-keep">
          <div className="relative space-y-6">
            <div className="absolute left-[34.5%] text-6xl animate-ping">
              🚨
            </div>
            <div className="relative text-6xl">🚨</div>
            <h1 className="text-2xl font-bold text-[#111111] dark:text-[#F1F1F1]">
              일시적인 오류가 발생했어요.
            </h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              단어장을 불러오는 데 실패했습니다.
              <br />
              잠시 후 다시 시도해 주세요.
            </p>
            {/* 새로고침 버튼 */}
            <div className="pt-4">
              <a
                href="/"
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors inline-block"
              >
                다시 시도하기
              </a>
            </div>
          </div>
        </main>
      );
    }

    // 최신 날짜가 있으면 링크 제공
    const latestDate = latest?.date || "/";

    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center break-keep">
        <div className="space-y-6">
          <div className="text-6xl animate-[bounce_2s_infinite]">🚚</div>

          <h1 className="text-2xl font-bold text-[#111111] dark:text-[#F1F1F1]">
            오늘의 단어가 아직 도착하지 않았어요.
          </h1>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            관리자가 열심히 배달 중입니다!
            <br />
            다른 날짜의 단어를 먼저 구경해 보세요.
          </p>

          <div className="pt-4 flex justify-center">
            <Link
              href={`/date/${latestDate}`}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-80 transition-opacity inline-block"
            >
              최근 단어 보기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const accentColor = word.color ?? DEFAULT_THEME_COLOR;
  const prevDate = offsetDate(word.date, -1);

  const shareText = `오늘의 단어는 '${word.word}'입니다.`;
  const sharePath = `/date/${word.date}`;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pt-24">
      <MidnightUpdater />
      <ColorSetter color={accentColor} />
      <article className="max-w-[1200px] w-full text-center">
        {/* 단어 제목 및 한자*/}
        <div className="mb-6">
          {word.hanja && (
            <span
              className="font-extrabold transition-all duration-300
              font-serif text-6xl md:text-9xl
              text-[#111111] dark:text-[#F1F1F1]
              block mb-4"
              style={{
                textShadow: `5px 5px 5px ${accentColor}`,
              }}
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

        {/* 순화어 및 정보 (있을 때만 표시) */}
        {(word.detail || word.refined_word) && (
          <div className="mt-8 text-sm bg-gray-50 dark:bg-[#1e1e1e] border border-transparent dark:border-gray-800 px-4 py-3 rounded-lg inline-block text-left break-keep">
            {/* 순화어 */}
            {word.refined_word && (
              <div className="relative mb-2">
                <span className="absolute left-0 top-0">💡</span>{" "}
                <div className="flex justify-center font-bold">
                  <span className="text-gray-900 dark:text-gray-100 mr-1">
                    순화어:
                  </span>
                  <span
                    className="transition-all duration-300
                    brightness-[0.7] saturate-[1.2]
                    dark:brightness-[1.8] dark:saturate-[1.5]"
                    style={{ color: accentColor }}
                  >
                    {word.refined_word}
                  </span>
                </div>
                <div className="w-8 h-px bg-[#D0D0D0] dark:bg-[#333] mx-auto mt-2"></div>
              </div>
            )}

            {/* 설명 */}
            {word.detail && (
              <div className="block text-gray-700 dark:text-gray-300">
                {!word.refined_word && <span className="mr-2">💡</span>}
                {word.detail}
              </div>
            )}
          </div>
        )}

        {/* 공유 버튼에 고정 URL 전달 */}
        <div className="flex justify-center mt-8 mb-4">
          <ShareButton text={shareText} url={sharePath} />
        </div>

        <PageLoginSection user={user} />

        <nav className="flex justify-start items-center pt-8 text-sm">
          {/* 이전 버튼 (어제로 가기) */}
          <Link
            href={`/date/${prevDate}`}
            className="flex items-center gap-1 text-sub hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            ← {prevDate.slice(5)}
          </Link>
        </nav>
      </article>
    </main>
  );
}

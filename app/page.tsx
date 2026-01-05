import { getTodayDate } from "@/utils/date";
import MidnightUpdater from "@/components/MidnightUpdater";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import WordDetailView from "@/components/WordDetailView";
import {
  getWordByDate,
  getLatestWord,
  getPrevWord,
} from "@/services/wordService";

// 캐싱 방지 설정
export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = getTodayDate();
  // Supabase에서 오늘 날짜의 단어를 가져옴
  const { data: word, error } = await getWordByDate(supabase, today);

  if (error || !word) {
    // DB에서 가장 최신 단어 날짜를 가져옴
    const { data: latest, error: latestError } = await getLatestWord(supabase);

    // 단어를 못 불러올 경우 오류 페이지 표시
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

    // 최신 단어로 이동하는 링크 제공
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
              href={`/words/${latest.id}`}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-80 transition-opacity inline-block"
            >
              최근 단어 보기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  //이전 글
  const { data: prevWord } = await getPrevWord(supabase, word.date);

  return (
    <main className="flex flex-1 flex-col items-center px-6">
      <MidnightUpdater />
      <WordDetailView
        word={word as any}
        prevWord={prevWord}
        nextWord={null} // 오늘은 다음 글이 없으므로 null
        user={user}
      />
    </main>
  );
}

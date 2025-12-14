import { supabase } from "@/utils/supabase";
import { getTodayDate, offsetDate } from "@/utils/date";
import { DEFAULT_THEME_COLOR } from "@/constants/theme";
import { SERVICE_START_DATE } from "@/constants/service";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

// 메타데이터를 동적으로 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const today = getTodayDate();

  // 유효하지 않은 날짜 범위일 경우 메타데이터 처리
  if (id < SERVICE_START_DATE || id > today) {
    return { title: "하루단어" };
  }

  const { data: word } = await supabase
    .from("words")
    .select("word")
    .eq("date", id)
    .single();

  return {
    title: word ? `${word.word}` : "하루단어",
  };
}

export default async function DatePage({ params }: Props) {
  // URL에서 가져온 날짜
  const { id } = await params;
  const today = getTodayDate();

  // 날짜 유효성 검사
  const isBeforeStart = id < SERVICE_START_DATE;
  const isFuture = id > today;

  if (isBeforeStart || isFuture) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center break-keep">
        <div className="space-y-6">
          <div className="text-6xl animate-[bounce_2s_infinite]">
            {isFuture ? "⏳" : "🚧"}
          </div>

          <h1 className="text-2xl font-bold text-[#111111] dark:text-[#F1F1F1]">
            {isFuture ? "아직 오지 않은 날이에요!" : "서비스 시작 전이에요!"}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {isFuture ? (
              <>
                미래의 단어는 미리 볼 수 없어요.
                <br />
                유효한 페이지로 방문해 주세요.
              </>
            ) : (
              <>
                하루단어는 <strong>{SERVICE_START_DATE}</strong>부터
                시작되었습니다.
                <br />
                이전 날짜의 기록은 존재하지 않습니다.
              </>
            )}
          </p>

          <div className="pt-4 flex flex-row gap-4">
            {isFuture ? (
              <div className="max-w-xs mx-auto">
                <Link
                  href="/"
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-80 transition-opacity inline-block"
                >
                  오늘 단어 보기
                </Link>
              </div>
            ) : (
              <div className="max-w-xs mx-auto">
                <Link
                  href="/date/2025-12-09"
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-80 transition-opacity inline-block"
                >
                  첫 단어 보기
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // 날짜 계산
  const prevDate = offsetDate(id, -1);
  const nextDate = offsetDate(id, 1);

  // 이전 버튼: 2025-12-09 이전이면 비활성화
  const hasPrev = id > "2025-12-09";

  // 다음 버튼: 오늘 날짜 이후면 비활성화
  const hasNext = nextDate <= today;

  // 다음 날짜가 오늘인지 확인
  const isNextToday = nextDate === today;

  // dateStr를 사용해서 검색
  const { data: word, error } = await supabase
    .from("words")
    .select("*")
    .eq("date", id)
    .single();

  if (error || !word) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold mb-4">
          해당 날짜의 단어가 없어요. 😢
        </h1>
        <Link href="/" className="text-blue-500 underline">
          오늘의 단어 보러 가기
        </Link>
      </main>
    );
  }

  const accentColor = word.color ?? DEFAULT_THEME_COLOR;
  const shareText = `${id}의 단어는 '${word.word}'입니다.`;
  // 공유할 주소도 이 날짜 페이지로 고정
  const sharePath = `/date/${id}`;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pt-24">
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

        {/* 메인 화면 이동 버튼 */}
        <nav className="flex justify-between items-center pt-8 text-sm">
          {/* 이전 버튼 */}
          {hasPrev ? (
            <Link
              href={`/date/${prevDate}`}
              className="flex items-center gap-1 text-sub hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              ← {prevDate.slice(5)}
            </Link>
          ) : (
            <div className="w-10"></div> // 레이아웃 유지
          )}

          {/* 메인으로 가기 (가운데) */}
          <Link
            href="/"
            className="text-xs text-sub underline underline-offset-4"
          >
            오늘
          </Link>

          {/* 다음 버튼 (미래면 숨김) */}
          {hasNext ? (
            <Link
              href={isNextToday ? "/" : `/date/${nextDate}`}
              className="flex items-center gap-1 text-sub hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {nextDate.slice(5)} →
            </Link>
          ) : (
            <div className="w-10"></div> // 레이아웃 유지
          )}
        </nav>
      </article>
    </main>
  );
}

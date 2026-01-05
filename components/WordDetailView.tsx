import Link from "next/link";
import ColorSetter from "@/components/ColorSetter";
import ShareButton from "@/components/ShareButton";
import PageLoginSection from "@/components/PageLoginSection";
import { DEFAULT_THEME_COLOR } from "@/constants/theme";
import { getTodayDate } from "@/utils/date";
import { Word } from "@/types";

// 필요한 데이터 타입 정의
interface WordDetailViewProps {
  word: Word;
  prevWord?: { id: number; date: string } | null;
  nextWord?: { id: number; date: string } | null;
  user: any;
}

export default function WordDetailView({
  word,
  prevWord,
  nextWord,
  user,
}: WordDetailViewProps) {
  const accentColor = word.category?.color ?? DEFAULT_THEME_COLOR;
  const shareText = `${word.date}의 단어는 '${word.word}'입니다.`;
  const sharePath = `/words/${word.id}`;

  const today = getTodayDate();
  const isToday = word.date === today;

  return (
    <article className="max-w-[1200px] w-full text-center">
      <ColorSetter color={accentColor} />
      {/* 네비게이션 */}
      <nav className="grid grid-cols-3 items-center pt-4 pb-4 text-sm w-full">
        {/* 왼쪽 영역 */}
        <div className="justify-self-start">
          {prevWord ? (
            <Link
              href={`/words/${prevWord.id}`}
              className="flex items-center gap-1 text-sub hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              ← {prevWord.date.slice(5)}
            </Link>
          ) : (
            <div className="w-10"></div>
          )}
        </div>

        {/* 가운데 영역 */}
        <div className="justify-self-center">
          {!isToday ? (
            <Link
              href="/"
              className="text-xs text-sub hover:underline hover:font-extrabold underline-offset-4 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              오늘
            </Link>
          ) : (
            <div className="w-8"></div>
          )}
        </div>

        {/* 오른쪽 영역 */}
        <div className="justify-self-end">
          {nextWord ? (
            <Link
              href={`/words/${nextWord.id}`}
              className="flex items-center gap-1 text-sub hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {nextWord.date.slice(5)} →
            </Link>
          ) : (
            <div className="w-10"></div>
          )}
        </div>
      </nav>
      {/* 카테고리 뱃지 */}
      {word.category && (
        <div className="flex justify-center mb-4">
          <button
            className="py-1.5 px-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap border flex items-center gap-2
              bg-white dark:bg-[#1E1E1E]"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: word.category.color }}
            />
            <span>{word.category.name}</span>
          </button>
        </div>
      )}

      {/* 단어 제목 및 한자 */}
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

      {/* 순화어 및 정보 */}
      {(word.detail || word.refined_word) && (
        <div className="mt-8 text-sm bg-gray-50 dark:bg-[#1e1e1e] border border-transparent dark:border-gray-800 px-4 py-3 rounded-lg inline-block text-left break-keep">
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

          {word.detail && (
            <div className="block text-gray-700 dark:text-gray-300">
              {!word.refined_word && <span className="mr-2">💡</span>}
              {word.detail}
            </div>
          )}
        </div>
      )}

      {/* 공유 버튼 */}
      <div className="flex justify-center mt-8 mb-4">
        <ShareButton text={shareText} url={sharePath} />
      </div>

      {/* <PageLoginSection user={user} /> */}
    </article>
  );
}

import { getTodayDate } from "@/utils/date";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import WordDetailView from "@/components/WordDetailView";
import { getWordById, getPrevWord, getNextWord } from "@/services/wordService";

interface Props {
  params: Promise<{ id: string }>;
}

// 메타데이터를 동적으로 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // 숫자가 아니면 무시
  if (isNaN(Number(id))) return { title: "하루단어" };

  const supabase = await createClient();

  const { data: word } = await getWordById(supabase, id);

  const today = getTodayDate();

  // 단어가 없거나 미래의 단어라면 제목 숨김
  if (!word || word.date > today) {
    return { title: "하루단어" };
  }

  return {
    title: `${word.word}`,
  };
}

export default async function WordDetailPage({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // URL 파라미터에서 id 가져오기
  const { id } = await params;

  // 유효성 검사 (숫자가 아니면 404)
  if (isNaN(Number(id))) {
    notFound();
  }

  const today = getTodayDate();

  // 현재 단어 데이터 가져오기
  const { data: word, error } = await getWordById(supabase, id);

  // 단어가 없으면 404
  if (error || !word) {
    notFound();
  }

  // 미래/과거 접근 제어
  const isFuture = word.date > today;

  if (isFuture) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center break-keep">
        <div className="space-y-6">
          <div className="text-6xl animate-[bounce_2s_infinite]">⏳</div>

          <h1 className="text-2xl font-bold text-[#111111] dark:text-[#F1F1F1]">
            아직 오지 않은 날이에요!
          </h1>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            미래의 단어는 미리 볼 수 없어요.
            <br />
            오늘의 단어를 확인해 보세요.
          </p>

          <div className="pt-4 flex flex-row gap-4">
            <div className="max-w-xs mx-auto">
              <Link
                href="/"
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-80 transition-opacity inline-block"
              >
                오늘 단어 보기
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  let isBookmarked = false;

  if (user) {
    const { data: bookmark } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("word_id", word.id)
      .maybeSingle();

    isBookmarked = !!bookmark;
  }

  // 이전, 다음 단어 가져오기 / 병렬 처리 최적화
  const [prevResult, nextResult] = await Promise.all([
    getPrevWord(supabase, word.date),
    getNextWord(supabase, word.date),
  ]);

  return (
    <main className="flex flex-1 flex-col items-center px-6">
      <WordDetailView
        word={{ ...word, isBookmarked }}
        prevWord={prevResult.data}
        nextWord={nextResult.data}
        user={user}
      />
    </main>
  );
}

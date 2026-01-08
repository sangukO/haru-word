import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { getCategories } from "@/services/wordService";
import { getTodayDate } from "@/utils/date";
import WordsList from "@/components/WordList";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WordsPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const today = getTodayDate();

  // 검색 조건 파싱
  const resolvedSearchParams = await searchParams;

  const term =
    typeof resolvedSearchParams.term === "string"
      ? resolvedSearchParams.term
      : "";

  const categoryId =
    typeof resolvedSearchParams.category === "string"
      ? resolvedSearchParams.category
      : "all";

  // 유저 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 병렬로 카데고리, 단어 목록, 북마크 데이터 가져오기
  const [categoriesResult, wordsResult, bookmarksResult] = await Promise.all([
    getCategories(supabase),
    (async () => {
      // 단어 목록 쿼리 빌드
      let query = supabase
        .from("words")
        .select(`*, categories (id, name, color)`)
        .lte("date", today)
        .order("date", { ascending: false });

      // 카테고리 필터
      if (categoryId !== "all") {
        query = query.eq("category", categoryId);
      }

      // 검색어 필터
      if (term) {
        query = query.ilike("word", `%${term}%`);
      }

      return query;
    })(),
    (async () => {
      if (!user) return { data: [] };
      return supabase
        .from("bookmarks")
        .select("word_id")
        .eq("user_id", user.id);
    })(),
  ]);

  const categories = categoriesResult.data;
  const initialWords = wordsResult.data;
  const initialBookmarkedIds = bookmarksResult.data
    ? bookmarksResult.data.map((b) => b.word_id)
    : [];

  let isBookmarked = false;

  return (
    <Suspense>
      <WordsList
        initialCategories={categories || []}
        userId={user?.id}
        initialWords={initialWords || []}
        initialBookmarkedIds={initialBookmarkedIds}
      />
    </Suspense>
  );
}

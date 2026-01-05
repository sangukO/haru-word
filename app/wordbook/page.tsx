import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { getCategories } from "@/services/wordService";
import LoginCard from "@/components/LoginCard";
import MyWordList from "@/components/MyWordList";

export default async function WordBookPage() {
  const supabase = await createClient();

  // 로그인 여부 체크
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 비로그인 상태
  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center py-20 px-6 text-center break-keep">
        <div className="mb-8 animate-fade-in-up">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-3">나만의 단어장 만들기</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            로그인하고 인상 깊은 단어를 영구 소장해 보세요.
            <br />
            언제 어디서든 다시 꺼내볼 수 있습니다.
          </p>
        </div>
        <LoginCard />
      </main>
    );
  }

  // 로그인 상태
  // 데이터가 없으면 빈 배열 반환
  const { data: categories } = await getCategories(supabase);

  // 유저의 북마크 단어들 가져오기
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select(
      `
      id,
      created_at,
      word:words!inner (
        *,
        categories (id, name, color)
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const initialWords = bookmarks ? bookmarks.map((b: any) => b.word) : [];

  // 클라이언트 컴포넌트에 데이터(카테고리, 유저ID) 전달
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <MyWordList
        initialCategories={categories || []}
        userId={user.id}
        initialWords={initialWords}
      />
    </Suspense>
  );
}

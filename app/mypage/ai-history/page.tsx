import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SentenceHistoryItem from "@/components/ai/SentenceHistoryItem";

export default async function AiHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // AI 사용 로그 가져오기
  const { data: logs, error: logsError } = await supabase
    .from("ai_usage_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "SUCCESS") // 실패한 건 제외
    .order("created_at", { ascending: false });

  if (logsError) {
    console.error("로그 조회 실패:", logsError);
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  // 로그에 포함된 단어 ID들 추출
  // flatMap으로 2차원 배열을 1차원으로 변환
  const allWordIds = Array.from(
    new Set(logs?.flatMap((log) => log.target_word_ids || []) || [])
  );

  // 실제 단어 정보 가져오기
  const { data: words } = await supabase
    .from("words")
    .select("id, word, meaning, categories ( color )")
    .in("id", allWordIds);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pb-20 pt-6">
      {/* 헤더 부분 */}
      <div className="relative flex items-center justify-between pb-8">
        <div className="flex items-center gap-2">
          <Link
            href="/mypage"
            className="p-2 -ml-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI 예문 기록
          </h1>
        </div>

        <div className="">
          <span
            className="
                        absolute top-[70%] right-0 flex items-center gap-1 text-xs font-bold 
                        text-purple-600 dark:text-purple-300
                      "
          >
            예문을 클릭하여 복사할 수 있습니다.
          </span>
        </div>
      </div>

      {/* 리스트 부분 */}
      <div className="flex flex-col gap-4">
        {logs && logs.length > 0 ? (
          logs.map((log) => {
            // 현재 로그에 해당하는 단어 정보 찾기
            const currentWords =
              log.target_word_ids
                ?.map((id: number) => words?.find((w) => w.id === id))
                .filter((w: any) => w !== undefined) || []; // 삭제된 단어는 제외

            return (
              <SentenceHistoryItem
                key={log.id}
                log={log}
                usedWords={currentWords as any}
              />
            );
          })
        ) : (
          // 기록이 없을 때 빈 화면
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-[#333] rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              아직 생성된 예문이 없어요.
            </p>
            <Link
              href="/wordlist"
              className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              단어장에서 첫 예문을 만들어보세요!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

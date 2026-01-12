import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SentenceHistoryList from "@/components/ai/SentenceHistoryList";
import { ChevronLeft } from "lucide-react";

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
            <ChevronLeft size={24} />
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
      <SentenceHistoryList logs={logs} words={words} />
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import AdminDashboard from "@/app/admin/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  // 관리자 클라이언트 생성 (auth.users 접근용)
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 단어, 카테고리 데이터 가져오기
  const [wordsRes, catsRes] = await Promise.all([
    supabase
      .from("words")
      .select("*, categories(*)")
      .order("date", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  // AI 로그 데이터 가져오기
  const { data: logs } = await supabase
    .from("ai_usage_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100); // 과부하 방지 100개 제한

  // AI 로그용 부가 데이터 매핑
  let aiLogData: any[] = [];

  if (logs && logs.length > 0) {
    const allUserIds = Array.from(new Set(logs.map((l) => l.user_id)));
    const allWordIds = Array.from(
      new Set(logs.flatMap((l) => l.target_word_ids || []))
    );

    // 유저 ID 목록을 순회하며 유저 정보를 병렬로 가져옴
    const userPromises = allUserIds.map((userId) =>
      supabaseAdmin.auth.admin.getUserById(userId)
    );

    const [usersResponses, wordDetailsRes] = await Promise.all([
      Promise.all(userPromises), // 유저 정보 API 호출
      supabase
        .from("words")
        .select("id, word, categories ( color )")
        .in("id", allWordIds),
    ]);

    // 응답에서 유저 데이터만 추출
    const authUsers = usersResponses
      .map((res) => res.data.user)
      .filter((u) => u !== null);
    const words = wordDetailsRes.data || [];

    // 가져온 auth 데이터를 UI에 맞는 형태로 변환
    const formattedUsers = authUsers.map((u: any) => ({
      id: u.id,
      email: u.email,
      nickname:
        u.user_metadata?.full_name || // raw_user_meta_data 대신 user_metadata 사용
        u.user_metadata?.name ||
        u.user_metadata?.nickname ||
        u.email?.split("@")[0] ||
        "알 수 없음",
      avatar_url:
        u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
    }));

    // 데이터 합치기
    aiLogData = logs.map((log) => ({
      log,
      user: formattedUsers.find((u) => u.id === log.user_id),
      usedWords:
        log.target_word_ids
          ?.map((id: number) => words.find((w) => w.id === id))
          .filter(Boolean) || [],
    }));
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-8 pb-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          관리 대시보드
        </h1>
      </div>

      <AdminDashboard
        words={wordsRes.data || []}
        categories={catsRes.data || []}
        aiLogs={aiLogData}
      />
    </div>
  );
}

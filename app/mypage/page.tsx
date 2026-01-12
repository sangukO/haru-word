import ActivityCalendar from "@/app/mypage/ActivityCalendar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import WithdrawButton from "./WithdrawButton";
import ContactButton from "./ContactButton";
import AiHistoryButton from "./AiHistoryButton";
import ResetTimer from "@/components/ResetTimer";

function getLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const isAdmin = userRole?.role === "admin";

  const { email, user_metadata, confirmed_at } = user;
  const avatarUrl = user_metadata.avatar_url;
  const userName = user_metadata.full_name || user_metadata.name || "사용자";

  // 가입일이나 현재 날짜를 보여주고 싶다면 사용
  const currentDate = new Date()
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "")
    .replace(/ /g, ".");

  const formattedConfirmedAt = confirmed_at!.split("T")[0].replace(/-/g, ".");

  function daysBetween(startDate: string, endDate: string) {
    const startTime = new Date(startDate.replace(/\./g, "-")).getTime();
    const endTime = new Date(endDate.replace(/\./g, "-")).getTime();

    const diffTime = endTime - startTime;

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + 1;
  }

  // 데이터 병렬 조회
  const [visitsResult, aiLogsResult] = await Promise.all([
    supabase
      .from("user_daily_visits")
      .select("visit_date")
      .eq("user_id", user.id),
    supabase
      .from("ai_usage_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "SUCCESS")
      .order("created_at", { ascending: false }),
  ]);

  const visits = visitsResult.data || [];
  const logs = aiLogsResult.data || [];

  // 로그에 포함된 단어 ID 추출 및 단어 데이터 조회
  const allWordIds = Array.from(
    new Set(logs.flatMap((log) => log.target_word_ids || []))
  );

  const { data: words } = await supabase
    .from("words")
    .select("id, word, meaning, categories ( color )")
    .in("id", allWordIds);

  // 점수 집계 (Map)
  const activityMap = new Map<string, number>();

  // 출석 점수
  visits.forEach((v) => {
    // 출석 저장된 날짜
    const date = String(v.visit_date);
    activityMap.set(date, (activityMap.get(date) || 0) + 1);
  });

  // AI 생성 점수
  logs.forEach((log) => {
    // 로그 생성 날짜를 가져와서 로컬 날짜로 변환
    const logDate = new Date(log.created_at);
    const dateStr = getLocalDateString(logDate);
    activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
  });

  // 올해 기준 데이터 채우기 (한국 시간 기준)
  const grassData = [];
  const start = new Date("2026-01-01");
  const end = new Date("2026-12-31");

  // 시작일부터 종료일까지 하루씩 증가
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = getLocalDateString(d);
    const count = activityMap.get(dateStr) || 0;

    let level = 0;
    if (count === 0) level = 0;
    else if (count === 1) level = 1;
    else if (count <= 2) level = 2;
    else if (count <= 3) level = 3;
    else level = 4;

    grassData.push({ date: dateStr, count, level });
  }

  return (
    <main className="flex flex-1 flex-col w-full max-w-5xl mx-auto px-6 pt-8 items-center">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
        내 정보
      </h1>

      <div className="w-full flex flex-col md:flex-row bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-2xl shadow-sm overflow-hidden mb-4">
        {/* 유저 계정 정보 */}
        <div className="flex flex-1 flex-row items-center p-8 gap-6">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
              <img
                src={avatarUrl}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 이름 및 이메일 */}
          <div className="flex flex-col justify-center gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userName}
              </h3>
              {/* 역할 배지 */}
              {isAdmin ? (
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-white bg-red-500 rounded-full shadow-sm">
                  ADMIN
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-white bg-indigo-500 rounded-full shadow-sm">
                  USER
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {email}
            </p>
          </div>
        </div>

        {/* 활동 상태 정보 */}
        <div className="flex flex-col md:w-72 bg-gray-50 dark:bg-[#252525] p-6 justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-[#333] gap-6">
          {/* 가입일 정보 */}
          <div className="flex justify-between items-center md:flex-col md:items-start md:gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              함께 한 시간
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {daysBetween(formattedConfirmedAt, currentDate)}
              </span>
              <span className="text-sm text-gray-500">일째 함께하는 중</span>
            </div>
            {confirmed_at && (
              <span className="text-xs text-gray-400">
                {formattedConfirmedAt} 가입
              </span>
            )}
          </div>

          {/* 구분선 */}
          <div className="h-px w-full bg-gray-200 dark:bg-[#333]"></div>

          {/* 타이머 */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              일일 초기화
            </span>
            <ResetTimer className="text-2xl font-black tabular-nums tracking-tight bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400" />
          </div>
        </div>
      </div>

      {/* 중단 */}
      {/* 학습 기록 */}
      <div className="flex flex-col w-full">
        <ActivityCalendar data={grassData} logs={logs} words={words || []} />
      </div>

      {/* 하단 */}
      <div className="flex w-full flex-col flex-1 mt-4 gap-4">
        {/* AI 서비스 */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 mb-2 px-1">
            AI 서비스
          </h4>
          <AiHistoryButton />
        </div>
        {/* 회원 탈퇴 */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 mb-2 px-1">
            계정 관리
          </h4>
          <WithdrawButton />
        </div>
        {/* 문의 */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 mb-2 px-1">
            고객 지원
          </h4>
          <ContactButton />
        </div>
      </div>
    </main>
  );
}

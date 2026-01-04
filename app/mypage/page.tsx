import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import WithdrawButton from "./WithdrawButton";
import ContactButton from "./ContactButton";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

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

  return (
    <main className="flex flex-1 flex-col w-full max-w-5xl mx-auto px-6 pt-8">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
        내 정보
      </h1>

      <div className="flex flex-col bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl p-6 shadow-sm">
        <div className="flex justify-end items-start mb-6">
          {confirmed_at && (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide text-right">
              가입일: {formattedConfirmedAt}
              <br />
              {daysBetween(formattedConfirmedAt, currentDate)}일째
            </span>
          )}
        </div>

        <div className="flex-1">
          {/* 아바타 이미지 */}
          <div className="w-16 h-16 mb-4 rounded-full overflow-hidden border border-gray-100 dark:border-[#333]">
            <img
              src={avatarUrl}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 이름 */}
          <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
            {userName}
          </h3>

          {/* 이메일 */}
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {email}
          </p>
        </div>
      </div>

      {/* 하단 */}
      <div className="flex flex-col flex-1 pt-4 gap-4">
        {/* 회원 탈퇴 */}
        <div className="mb-3">
          <h4 className="text-xs font-bold text-gray-400 mb-2 px-1">
            계정 관리
          </h4>
          <WithdrawButton />
        </div>
        {/* 문의 */}
        <div className="mb-3">
          <h4 className="text-xs font-bold text-gray-400 mb-2 px-1">
            고객 지원
          </h4>
          <ContactButton />
        </div>
      </div>
    </main>
  );
}

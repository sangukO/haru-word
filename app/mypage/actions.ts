"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

// 회원 탈퇴 (계정 삭제)
export async function withdraw() {
  const supabase = await createClient();

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // 관리자 권한 필요
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // 계정 삭제 요청
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("탈퇴 실패:", error);
    throw new Error("회원 탈퇴 처리에 실패했습니다.");
  }

  // 세션 정리 후 홈으로 이동
  await supabase.auth.signOut();
}

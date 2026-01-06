import { createClient } from "@/utils/supabase/client";

export const checkIsAdmin = async () => {
  const supabase = createClient();

  // 현재 로그인한 유저 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  // user_roles 테이블에서 역할 확인
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return false;

  return data.role === "admin";
};

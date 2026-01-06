import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 로그인한 유저 정보
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 비로그인 상태면 404 페이지로 이동
  if (!user) {
    notFound();
  }

  // 로그인 상태라면 권한 정보 확인
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  // 권한 정보가 없거나, admin이 아니면 404 페이지로 이동
  if (!userRole || userRole.role !== "admin") {
    notFound();
  }

  // 관리자만 화면 보여줌
  return <>{children}</>;
}

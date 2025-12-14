import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // 로그인 후 이동할 페이지
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // 구글 code를 쿠키의 로그인 세션으로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 교환 성공하면 원래 페이지로 이동
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 4. 실패하면 에러 페이지로 보냄
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

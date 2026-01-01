import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const error = searchParams.get("error");

  // 사용자가 구글 로그인 창을 닫거나 취소한 경우
  if (error === "access_denied") {
    return NextResponse.redirect(`${origin}/`);
  }

  // 기타 오류 발생 시
  if (error) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // 정상적으로 code가 전달된 경우
  const code = searchParams.get("code");
  // 로그인 후 이동할 페이지
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // 구글 code를 쿠키의 로그인 세션으로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 리다이렉트 응답 객체
      const response = NextResponse.redirect(`${origin}${next}`);

      // 웰컴 메시지
      response.cookies.set("welcome-toast", "true", {
        path: "/",
        maxAge: 10,
        httpOnly: false,
        sameSite: "lax",
      });

      // 교환 성공하면 원래 페이지로 이동
      return response;
    }
  }

  // 코드 교환 실패 등 나머지 에러 상황
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

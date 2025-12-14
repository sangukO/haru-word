"use client";

import { createClient } from "@/utils/supabase/client";
import { Roboto } from "next/font/google";

//구글 로그인 가이드 - roboto 폰트 사용
const roboto = Roboto({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-roboto",
});

interface LoginButtonProps {
  text?: string;
  className?: string;
}

export default function LoginButton({
  text = "Google 계정으로 시작하기",
  className = "",
}: LoginButtonProps) {
  const supabase = createClient();

  // 로그인 끝나면 현재 주소로 돌아옴
  const handleLogin = async () => {
    const redirectTo =
      typeof window !== "undefined" ? window.location.origin : "";

    // 쿠키에 세션 저장
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectTo}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) {
      console.error("로그인 에러 발생:", error.message);
      alert("로그인에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <button
      onClick={handleLogin}
      className={`
        group relative flex items-center justify-center 
        h-10 px-3 rounded-sm
        border transition-all duration-200 ease-in-out cursor-pointer
        
        bg-white 
        text-[#1f1f1f] 
        border-[#747775]
        
        dark:bg-[#131314] 
        dark:text-[#e3e3e3] 
        dark:border-[#8e918f]

        hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.30),0_1px_3px_1px_rgba(60,64,67,0.15)]

        ${className}
      `}
    >
      <div
        className="absolute inset-0 rounded-sm transition-opacity duration-200 opacity-0 
        
        bg-[#303030] 
        
        dark:bg-white

        group-hover:opacity-[0.08] 
        group-active:opacity-[0.12]"
      />

      <div className="relative flex items-center justify-between w-full">
        {/* 구글 로고 SVG */}
        <div className="mr-2.5 min-w-5 h-5 flex items-center justify-center">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5 block"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>

        {/* 텍스트 */}
        <span className="grow font-medium text-sm text-center font-roboto">
          {text}
        </span>
      </div>
    </button>
  );
}

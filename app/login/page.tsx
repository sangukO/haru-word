"use client";

import LoginButton from "@/components/LoginButton"; // 기존 버튼 재사용
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center pt-20 bg-white dark:bg-[#121212] px-4">
      {/* 설명 */}
      <div className="text-center mb-12 animate-fade-in-down">
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium">
          매일 새로운 단어를 만나고,
          <br className="md:hidden" /> 나만의 단어장을 채워보세요.
        </p>
      </div>

      {/* 로그인 버튼 */}
      <div className="w-full max-w-sm bg-gray-50 dark:bg-[#1E1E1E] p-8 rounded-2xl border border-gray-200 dark:border-[#333] shadow-lg text-center">
        <p className="text-xs text-gray-400 mb-6 font-medium">
          3초 만에 간편하게 시작하기
        </p>

        <div className="flex justify-center">
          <LoginButton
            text="Google 계정으로 시작하기"
            className="w-full flex justify-center items-center py-3 text-sm"
          />
        </div>

        {/* 하단 안내 */}
        <div className="mt-6 text-[10px] text-gray-400">
          로그인 시{" "}
          <Link
            href="/terms"
            className="underline hover:text-gray-600 dark:hover:text-gray-300"
          >
            이용약관
          </Link>{" "}
          및{" "}
          <Link
            href="/privacy"
            className="underline hover:text-gray-600 dark:hover:text-gray-300"
          >
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </div>
      </div>

      {/* 홈으로 돌아가기 */}
      <div className="mt-8">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-black dark:hover:text-white transition-colors border-b border-transparent hover:border-gray-500"
        >
          둘러만 볼게요 (홈으로 이동)
        </Link>
      </div>
    </div>
  );
}

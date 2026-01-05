"use client";

import Link from "next/link";
import LoginButton from "@/components/LoginButton";

export default function LoginCard() {
  return (
    <div className="w-full max-w-sm bg-gray-50 dark:bg-[#1E1E1E] p-8 rounded-2xl border border-gray-200 dark:border-[#333] shadow-lg text-center">
      <p className="text-md text-black dark:text-white mb-6 font-bold">
        3초 만에 간편하게 시작하기
      </p>

      <div className="flex justify-center">
        <LoginButton
          text="Google 계정으로 시작하기"
          className="w-full flex justify-center items-center py-3 text-sm"
        />
      </div>

      {/* 하단 약관 안내 */}
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
  );
}

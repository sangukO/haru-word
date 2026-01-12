"use client";

import LoginCard from "@/components/LoginCard";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center pt-20 px-4">
      {/* 설명 */}
      <div className="text-center mb-12">
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium">
          매일 새로운 단어를 만나고,
          <br className="md:hidden" /> 나만의 단어장을 채워보세요.
        </p>
      </div>

      {/* 로그인 카드 */}
      <LoginCard />

      {/* 홈으로 돌아가기 */}
      <div className="mt-8">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-black dark:hover:text-white border-b border-transparent hover:border-gray-500"
        >
          둘러만 볼게요 (홈으로 이동)
        </Link>
      </div>
    </div>
  );
}

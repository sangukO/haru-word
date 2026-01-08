"use client";

import { useRouter } from "next/navigation";

export default function AiHistoryButton() {
  const router = useRouter();

  const handleHistoryClick = () => {
    router.push("/mypage/ai-history");
  };

  return (
    <button
      onClick={handleHistoryClick}
      className="
        group flex items-center justify-between w-full p-3 rounded-lg 
        bg-gray-50 dark:bg-[#252525] 
        hover:bg-purple-50 dark:hover:bg-purple-900/10 
        transition-colors border border-transparent 
        hover:border-purple-100 dark:hover:border-purple-900/30 
        cursor-pointer
      "
    >
      <div className="flex items-center gap-2">
        {/* 아이콘: 로봇 모양 (AI) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-500 group-hover:text-purple-600 transition-colors"
        >
          <rect width="18" height="10" x="3" y="11" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" x2="8" y1="16" y2="16" />
          <line x1="16" x2="16" y1="16" y2="16" />
        </svg>

        {/* 텍스트 */}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          예문 기록
        </span>
      </div>

      {/* 우측 설명: 화살표나 '기록 보기' 텍스트 */}
      <span className="text-xs text-gray-400 group-hover:text-purple-400 transition-colors flex items-center gap-1">
        기록 보기
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </button>
  );
}

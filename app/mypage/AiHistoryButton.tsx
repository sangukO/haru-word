"use client";

import { BotMessageSquare, ChevronRight } from "lucide-react";
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
        <BotMessageSquare
          size={16}
          className="text-gray-500 group-hover:text-purple-600"
        />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
          예문 기록
        </span>
      </div>

      <span className="text-xs text-gray-400 group-hover:text-purple-400 flex items-center gap-1">
        기록 보기
        <ChevronRight size={12} />
      </span>
    </button>
  );
}

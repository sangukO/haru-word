"use client";

import { toast } from "sonner";
import Link from "next/link";
import { Copy } from "lucide-react";

type WordInfo = {
  id: number;
  word: string;
  categories?: { color: string } | null;
};

type UserProfile = {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
};

type AdminHistoryItemProps = {
  log: {
    id: number;
    created_at: string;
    generated_sentence: string | null;
    status: string; // 'SUCCESS' | 'FAILURE'
    error_message: string | null;
  };
  user: UserProfile | undefined;
  usedWords: WordInfo[];
};

export default function AdminAiHistoryItem({
  log,
  user,
  usedWords,
}: AdminHistoryItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleCopy = () => {
    if (!log.generated_sentence) return;
    navigator.clipboard.writeText(log.generated_sentence);
    toast.success("문장이 복사되었습니다!");
  };

  const isSuccess = log.status === "SUCCESS";

  return (
    <div
      className={`rounded-xl p-5 border shadow-sm transition-colors h-full flex flex-col ${
        isSuccess
          ? "bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]"
          : "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30"
      }`}
    >
      {/* 유저 정보, 날짜, 상태 뱃지 */}
      <div className="flex justify-between items-start mb-4 shrink-0">
        <div className="flex items-center gap-3">
          {/* 유저 아바타 */}
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                ?
              </div>
            )}
          </div>

          {/* 유저 이름 및 이메일 */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {user?.nickname || "알 수 없음"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email || "이메일 없음"}
            </span>
          </div>
        </div>

        {/* 날짜 및 상태 */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-400 font-medium">
            {formatDate(log.created_at)}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              isSuccess
                ? "bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                : "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
            }`}
          >
            {isSuccess ? "성공" : "실패"}
          </span>
        </div>
      </div>

      {/* 문장 또는 에러 메시지 */}
      {isSuccess ? (
        <div
          onClick={handleCopy}
          className="flex-1 flex flex-col justify-center group cursor-pointer relative p-4 rounded-lg border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
        >
          <p className="leading-relaxed text-sm md:text-base font-extrabold break-keep bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
            {log.generated_sentence}
          </p>
          {/* 호버 시 복사 안내 아이콘 */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy size={14} className="text-purple-500" />
          </div>
        </div>
      ) : (
        <div className="bg-red-100/50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 font-mono break-all">
            🔥 Error: {log.error_message || "알 수 없는 에러"}
          </p>
        </div>
      )}

      {/* 사용된 단어들 */}
      <div className="mt-3 flex flex-wrap gap-1.5 shrink-0">
        {usedWords.map((word) => {
          const color = word.categories?.color || "#a855f7";
          return (
            <Link
              key={word.id}
              href={`/wordlist/${word.id}`}
              className="px-1.5 py-0.5 rounded text-xs font-bold border opacity-80 hover:opacity-100"
              style={{
                color: color,
                backgroundColor: `${color}10`,
                borderColor: `${color}30`,
              }}
            >
              #{word.word}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

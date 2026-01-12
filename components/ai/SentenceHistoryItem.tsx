"use client";

import { toast } from "sonner";
import Link from "next/link";

type WordInfo = {
  id: number;
  word: string;
  meaning: string;
  categories?: { color: string }[] | { color: string } | null;
};

type HistoryItemProps = {
  log: {
    id: number;
    created_at: string;
    generated_sentence: string | null;
    target_word_ids: number[] | null;
  };
  usedWords: WordInfo[];
};

export default function AiHistoryItem({ log, usedWords }: HistoryItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
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
    toast.success("예문이 복사되었습니다!");
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-5 border border-gray-100 dark:border-[#333] shadow-sm hover:shadow-md transition-shadow">
      {/* 상단: 날짜 */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium text-gray-400">
          {formatDate(log.created_at)}
        </span>
      </div>

      {/* 중간: 생성된 문장 */}
      <div
        onClick={handleCopy}
        className="group cursor-pointer relative p-4 py-8 rounded-lg border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
      >
        <p className="leading-relaxed text-sm md:text-base font-extrabold break-keep bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
          {log.generated_sentence}
        </p>
      </div>

      {/* 하단: 사용된 단어들 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {usedWords.map((word) => {
          const color = Array.isArray(word.categories)
            ? word.categories[0]?.color
            : word.categories?.color || "#a855f7";
          return (
            <Link
              key={word.id}
              href={`/words/${word.id}`}
              className="px-2 py-1 rounded-md text-xs font-bold border transition-opacity hover:opacity-80"
              style={{
                color: color,
                backgroundColor: `${color}15`,
                borderColor: `${color}40`,
              }}
            >
              #{word.word}
            </Link>
          );
        })}
        {usedWords.length === 0 && (
          <span className="text-xs text-gray-400">삭제된 단어 포함됨</span>
        )}
      </div>
    </div>
  );
}

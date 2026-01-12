"use client";

import SentenceHistoryItem from "@/components/ai/SentenceHistoryItem";
import { FileText } from "lucide-react";

type WordInfo = {
  id: number;
  word: string;
  meaning: string;
  categories?: { color: string }[] | null;
};

type Log = {
  id: number;
  created_at: string;
  generated_sentence: string | null;
  target_word_ids: number[] | null;
  status: string;
  user_id: string;
};

type SentenceHistoryListProps = {
  logs: Log[] | null;
  words: WordInfo[] | null;
  emptyMessage?: string;
};

export default function SentenceHistoryList({
  logs,
  words,
  emptyMessage = "이 날은 생성된 예문이 없어요.",
}: SentenceHistoryListProps) {
  // 기록이 없을 때
  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-[#333] rounded-full flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // 기록이 있을 때
  return (
    <div className="flex flex-col gap-4">
      {logs.map((log) => {
        const currentWords = log.target_word_ids
          ?.map((id) => {
            const originalWord = words?.find((w) => w.id === id);
            return originalWord;
          })
          .filter((w) => w !== undefined);

        return (
          <SentenceHistoryItem
            key={log.id}
            log={log}
            usedWords={currentWords as any}
          />
        );
      })}
    </div>
  );
}

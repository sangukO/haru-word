"use client";

import AdminAiHistoryItem from "@/app/admin/components/AdminAiHistoryItem";

type AiLogData = {
  log: any; // 로그 원본
  user: any; // 유저 정보
  usedWords: any; // 사용된 단어 정보
};

interface Props {
  data: AiLogData[];
}

export default function AiTab({ data }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">AI 예문 생성 서비스 로그</h2>
        <span className="text-sm text-gray-500">총 {data.length}건</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item) => (
          <AdminAiHistoryItem
            key={item.log.id}
            log={item.log}
            user={item.user}
            usedWords={item.usedWords}
          />
        ))}

        {data.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 bg-gray-50 dark:bg-[#252525] rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            아직 생성된 기록이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

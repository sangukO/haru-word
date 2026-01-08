"use client";

import { useState } from "react";
import WordTab from "./WordTab";
import AiTab from "./AiTab";

type TabType = "word" | "ai";

export default function AdminDashboard({
  words,
  categories,
  aiLogs,
}: {
  words: any[];
  categories: any[];
  aiLogs: any[];
}) {
  const [activeTab, setActiveTab] = useState<TabType>("word");

  return (
    <div>
      {/* 탭 버튼 영역 */}
      <div className="flex gap-2 mb-8 border-b dark:border-[#333]">
        <button
          onClick={() => setActiveTab("word")}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${
            activeTab === "word"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-gray-400 hover:text-gray-600 cursor-pointer"
          }`}
        >
          단어 관리
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${
            activeTab === "ai"
              ? "border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400"
              : "border-transparent text-gray-400 hover:text-gray-600 cursor-pointer"
          }`}
        >
          AI 서비스 운영
        </button>
      </div>

      {/* 탭 내용 영역 */}
      <div className="animate-fade-in">
        {activeTab === "word" ? (
          <WordTab initialWords={words} categories={categories} />
        ) : (
          <AiTab data={aiLogs} />
        )}
      </div>
    </div>
  );
}

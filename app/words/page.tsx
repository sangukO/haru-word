"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  color: string;
  sort_order: number;
};

type Word = {
  id: number;
  word: string;
  meaning: string;
  categories: Category | null;
  date: string;
};

export default function WordsPage() {
  const supabase = createClient();
  const [words, setWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // 필터
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // 카테고리 목록 가져오기 (순서 정렬)
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  // 단어 목록 가져오기
  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);

      let query = supabase
        .from("words")
        .select(
          `
          *,
          categories (
            id,
            name,
            color
          )
        `
        )
        .order("date", { ascending: false }); // 최신순 정렬

      // 카테고리 필터
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      // 검색 필터
      if (searchTerm) {
        query = query.ilike("word", `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (!error && data) {
        setWords(data as any); // 타입 단언
      }

      setTimeout(() => setIsLoading(false), 1000);
    };

    // 검색어 입력 시 디바운싱
    const timeoutId = setTimeout(() => {
      fetchWords();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-24 pb-12">
      {/* 헤더 및 검색창 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">단어 검색 🔎</h1>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="검색할 단어를 입력하세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 카테고리 필터 버튼 */}
      <div className="flex flex-wrap gap-2 mb-8 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            selectedCategory === "all"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#2A2A2A] dark:text-gray-300"
          }`}
        >
          전체 보기
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === cat.id
                ? "bg-white dark:bg-[#1E1E1E]"
                : "bg-white dark:bg-[#1E1E1E] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] border-[#e4e4e4] dark:border-[#313131]"
            }`}
            style={{
              // 선택되었을 때 테두리 색상 = 카테고리 색상
              borderColor: selectedCategory === cat.id ? cat.color : undefined,
            }}
          >
            {/* 색상 원 */}
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <span
              style={{
                color: selectedCategory === cat.id ? cat.color : undefined,
              }}
            >
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* 단어 목록 그리드 */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="flex flex-row justify-center items-center">
            <svg
              className="mr-3 -ml-1 size-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            검색 중입니다...
          </div>
        </div>
      ) : words.length === 0 ? (
        <div className="text-center py-20 rounded-xl">
          검색 결과가 없습니다. 🤔
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <Link
              href={`/words/${word.id}`}
              key={word.id}
              className="flex flex-col bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* 상단 카테고리 뱃지 & 날짜 */}
              <div className="flex justify-between items-start mb-3">
                {word.categories ? (
                  <span
                    className="text-[11px] px-2 py-1 rounded font-bold bg-opacity-10"
                    style={{
                      color: word.categories.color,
                      backgroundColor: `${word.categories.color}15`, // 15% 투명도 배경
                    }}
                  >
                    {word.categories.name}
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-1 rounded font-bold bg-gray-100 text-gray-400 dark:bg-[#333]">
                    미분류
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide">
                  {word.date.replace(/-/g, ".")}
                </span>
              </div>

              {/* 본문 단어 & 뜻 */}
              <div className="mb-4 flex-1">
                <h3 className="text-2xl font-bold mb-2">{word.word}</h3>
                <p className="text-sm leading-relaxed">{word.meaning}</p>
              </div>

              {/* 하단 액션 버튼 */}
              <div className="pt-4 border-t border-gray-100 dark:border-[#333]">
                <div className="text-xs text-gray-400 text-right">
                  자세히 보기 →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

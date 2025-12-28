"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getTodayDate } from "@/utils/date";
import { Category, Word } from "@/types";

// props로 초기 카테고리를 받음
interface Props {
  initialCategories: Category[];
}

export default function WordsList({ initialCategories }: Props) {
  const supabase = createClient();

  // 검색 파라미터에서 초기 검색어 가져오기
  const searchParams = useSearchParams();
  const initialTerm = searchParams.get("term") || "";

  const [words, setWords] = useState<Word[]>([]);

  // 초기값으로 props를 바로 사용
  const [categories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 검색어
  const [searchTerm, setSearchTerm] = useState<string>(initialTerm);
  const [isLoading, setIsLoading] = useState(true);

  // 단어 목록 가져오기
  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);

      const today = getTodayDate();

      let query = supabase
        .from("words")
        .select(`*, categories (id, name, color)`)
        .lte("date", today)
        .order("date", { ascending: false });

      // 카테고리 필터
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      // 검색어 필터
      if (searchTerm) {
        query = query.ilike("word", `%${searchTerm}%`);
      }

      // 쿼리 실행 및 최소 로딩 시간 보장
      const [result] = await Promise.all([
        query,
        new Promise((resolve) => setTimeout(resolve, 300)),
      ]);

      const { data, error } = result;

      if (!error && data) {
        setWords(data as any); // 타입 단언
      }

      setIsLoading(false);
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

        <div className="flex items-center w-full md:w-72 px-4 py-2.5 border border-gray-300 dark:border-[#333] rounded-xl bg-white dark:bg-[#1E1E1E] focus-within:ring-2 focus-within:ring-black transition-all">
          <svg
            className="h-5 w-5 text-gray-400 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="검색할 단어를 입력하세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-400 text-gray-900 dark:text-white"
          />
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-400 ml-2"
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
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : null}
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

        {/* props로 받은 categories 사용 */}
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
              borderColor: selectedCategory === cat.id ? cat.color : undefined,
            }}
          >
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
          {/* 로딩 UI */}
          <div className="flex flex-row justify-center items-center gap-2 text-gray-500">
            <span className="animate-spin">⏳</span> 검색 중입니다...
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
                      backgroundColor: `${word.categories.color}15`,
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
                <p className="text-sm leading-relaxed line-clamp-2">
                  {word.meaning}
                </p>
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

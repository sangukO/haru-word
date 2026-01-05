"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Category, Word } from "@/types";
import WordCard from "./WordCard";

interface Props {
  initialCategories: Category[];
  userId: string;
  initialWords: Word[];
}

export default function MyWordList({
  initialCategories,
  userId,
  initialWords,
}: Props) {
  const supabase = createClient();

  const [categories] = useState<Category[]>(initialCategories);

  // 단어 목록 상태 관리
  const [words, setWords] = useState<Word[]>(initialWords);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 초기 북마크 단어들이 있으므로 false로 로딩 상태 시작
  const [isLoading, setIsLoading] = useState(false);

  // 내 단어장 데이터 가져오기
  useEffect(() => {
    const fetchMyWords = async () => {
      setIsLoading(true);

      // 북마크 테이블 조회
      // !inner를 사용하여 조인된 word 테이블 기준으로 필터링
      let query = supabase
        .from("bookmarks")
        .select(
          `
          id,
          created_at,
          word:words!inner (
            *,
            categories (id, name, color)
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false }); // 최신 저장순

      // 카테고리 필터 (조인된 word 테이블의 category 컬럼 필터링)
      if (selectedCategory !== "all") {
        query = query.eq("word.category", selectedCategory);
      }

      // 검색어 필터
      if (searchTerm) {
        query = query.ilike("word.word", `%${searchTerm}%`);
      }

      // 최소 로딩 시간 보장
      const [result] = await Promise.all([
        query,
        new Promise((resolve) => setTimeout(resolve, 300)),
      ]);

      const { data, error } = result;

      if (!error && data) {
        // 북마크 객체에서 word 정보만 추출하여 상태 업데이트
        const extractedWords = (data as any[]).map((item) => item.word);
        setWords(extractedWords);
      }

      setIsLoading(false);
    };

    const isInitialRender =
      words === initialWords && selectedCategory === "all" && !searchTerm;

    // 첫 렌더링 시에는 이미 초기 단어들이 있으므로 패스
    if (!isInitialRender) {
      const timeoutId = setTimeout(() => {
        fetchMyWords();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCategory, searchTerm, userId]);

  const handleRemoveWord = (wordId: number) => {
    // 현재 단어 배열에서 해당 ID를 가진 단어만 빼고 다시 설정
    setWords((prevWords) => prevWords.filter((w) => w.id !== wordId));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-8 pb-12">
      {/* 헤더 및 검색창 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">내 단어장 📒</h1>
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
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 카테고리 필터 */}
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

      <div className="flex w-full justify-between items-center mb-4">
        <p className="text-lg font-medium">
          저장된 단어{" "}
          <span className="font-bold text-black dark:text-white">
            {words.length}
          </span>
          개
        </p>
        <span className="text-sm text-gray-500">최근 저장순</span>
      </div>

      {/* 목록 그리드 */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="flex flex-row justify-center items-center gap-2 text-gray-500">
            <span className="animate-spin">⏳</span> 단어장을 불러오는 중...
          </div>
        </div>
      ) : words.length === 0 ? (
        <div className="text-center py-20 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-dashed border-gray-300 dark:border-[#333]">
          <p className="text-lg font-medium mb-2">저장된 단어가 없습니다.</p>
          <p className="text-gray-500 text-sm">
            마음에 드는 단어를 발견하면 북마크 버튼을 눌러보세요!
          </p>
          <Link
            href="/words"
            className="inline-block mt-4 text-blue-500 hover:underline text-sm font-medium"
          >
            단어 목록 보러 가기 →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              userId={userId}
              /* 내 단어장은 항상 저장된 상태이므로 true 고정 */
              isBookmarked={true}
              onRemove={handleRemoveWord}
            />
          ))}
        </div>
      )}
    </div>
  );
}

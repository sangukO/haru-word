"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getTodayDate } from "@/utils/date";
import { Category, Word } from "@/types";
import WordCard from "./WordCard";
import SearchBar from "@/components/ui/SearchBar";

// props로 초기 카테고리를 받음
interface Props {
  initialCategories: Category[];
  userId?: string;
  initialWords: Word[];
  initialBookmarkedIds: number[];
}

export default function WordsList({
  initialCategories,
  userId,
  initialWords,
  initialBookmarkedIds,
}: Props) {
  const supabase = createClient();
  const searchParams = useSearchParams();

  // 검색 파라미터에서 초기 검색어 가져오기
  const initialTerm = searchParams.get("term") || "";
  const initialCategoryParam = searchParams.get("category") || "all";

  // 초기값으로 props를 바로 사용
  const [words, setWords] = useState<Word[]>(initialWords);
  const [categories] = useState<Category[]>(initialCategories);

  // URL 파라미터 기반 초기 카테고리 설정
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategoryParam);

  // 검색어
  const [searchTerm, setSearchTerm] = useState<string>(initialTerm);

  // 초기 데이터가 있으므로 로딩은 false로 설정
  const [isLoading, setIsLoading] = useState(false);

  // 북마크
  const [myBookmarkedIds, setMyBookmarkedIds] =
    useState<number[]>(initialBookmarkedIds);

  // 헤더 타이틀
  const [headerTitle, setHeaderTitle] = useState(
    initialTerm || initialCategoryParam !== "all"
      ? "검색 결과"
      : "전체 수록 단어"
  );

  // 단어 목록 가져오기
  useEffect(() => {
    // 초기 로드인지 확인 후 현재 필터 상태가 초기 데이터와 일치하면 패스
    const isInitialLoad =
      words === initialWords &&
      selectedCategory === initialCategoryParam &&
      searchTerm === initialTerm;

    if (isInitialLoad) {
      return;
    }

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

        setHeaderTitle(
          searchTerm || selectedCategory !== "all"
            ? "검색 결과"
            : "전체 수록 단어"
        );
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
    <div className="w-full max-w-5xl mx-auto px-6 pt-8 pb-12">
      {/* 헤더 및 검색창 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">단어 검색</h1>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          className="w-full md:w-72"
        />
      </div>

      {/* 카테고리 필터 버튼 */}
      <div className="flex flex-wrap gap-2 mb-8 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer ${
            selectedCategory === "all"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#2A2A2A] dark:text-gray-300 hover:dark:text-gray-600"
          }`}
        >
          전체 보기
        </button>

        {/* props로 받은 categories 사용 */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap flex items-center gap-2 cursor-pointer ${
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
          {headerTitle}{" "}
          <span className="font-bold text-black dark:text-white">
            {words.length}
          </span>
          개
        </p>
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
            <WordCard
              key={word.id}
              word={word}
              userId={userId}
              // 내 북마크 리스트에 이 단어 ID가 있으면 true
              isBookmarked={myBookmarkedIds.includes(word.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

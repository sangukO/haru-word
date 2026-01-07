"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Category, Word } from "@/types";
import WordCard from "./WordCard";
import { toast } from "sonner";

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

  // AI 모드인지 아닌지 판단하는 상태 변수
  const [isAiMode, setIsAiMode] = useState(false);

  // AI 모드에서 선택된 단어들을 담을 배열
  const [selectedWords, setSelectedWords] = useState<number[]>([]);

  // AI 모드 종료 중인지 체크하는 상태 변수
  const [isClosing, setIsClosing] = useState(false);

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

  // AI 토글 함수
  const handleToggleAiMode = () => {
    if (isAiMode) {
      // 켜져있으면 종료 애니메이션 시작
      setIsClosing(true); // 내려가는 애니메이션 실행

      // 애니메이션 시간 후 진짜 종료
      setTimeout(() => {
        setIsAiMode(false);
        setIsClosing(false);
        setSelectedWords([]);
      }, 300);
    } else {
      // 꺼져있으면 그냥 켜기
      setIsAiMode(true);
    }
  };

  // AI 모드에서 단어 선택/해제 핸들러
  const handleToggleSelect = (wordId: number) => {
    // 이미 선택된 단어인지 확인
    if (selectedWords.includes(wordId)) {
      setSelectedWords((prev) => prev.filter((id) => id !== wordId));
      return;
    }

    // 선택되지 않은 단어라면 개수 제한 확인
    if (selectedWords.length >= 5) {
      // 토스트를 state 업데이트 함수 밖에서 실행
      // 중복 실행 방지
      toast.error("최대 5개까지 선택 가능합니다!");
      return;
    }

    // 5개 미만이고 선택되지 않은 단어라면 추가
    setSelectedWords((prev) => [...prev, wordId]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-8 pb-[120px] md:pb-[60px]">
      {/* 헤더 및 검색창 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">내 단어장 📒</h1>
        <div className="flex items-center gap-2">
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
                className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
          <div>
            <button
              className={`
                px-3 py-2.5 h-[42px] flex items-center rounded-xl font-bold transition-all duration-500 relative overflow-hidden group outline-none border cursor-pointer
                ${
                  isAiMode
                    ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] border-transparent"
                    : "bg-transparent text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-[#333] hover:border-purple-400 hover:text-purple-400"
                }
              `}
              onClick={() => {
                handleToggleAiMode();
              }}
            >
              {/* 그라데이션 배경 레이어 */}
              <div
                className={`absolute inset-0 bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 transition-opacity duration-500 ${
                  isAiMode ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* 텍스트 */}
              <span className="relative flex items-center justify-center gap-2 w-20">
                {isAiMode ? "✨ 사용 중" : "✨ AI 예문"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-8 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap flex items-center gap-2 cursor-pointer ${
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
          {words.map((word, index) => (
            <WordCard
              key={word.id}
              word={word}
              userId={userId}
              /* 내 단어장은 항상 저장된 상태이므로 true 고정 */
              isBookmarked={true}
              onRemove={handleRemoveWord}
              className={
                isAiMode ? "animate-shake-soft-effect hover:scale-110" : ""
              }
              style={{ animationDelay: index % 2 === 0 ? "0s" : "0.15s" }}
              onClick={() => isAiMode && handleToggleSelect(word.id)}
              isSelected={selectedWords.includes(word.id)}
              isSelectionMode={isAiMode}
            />
          ))}
          {/* AI 모드일 때만 하단에 플로팅 바 표시 */}
          {isAiMode && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
              <div
                className={`bg-white/80 dark:bg-[#1E1E1E]/90 backdrop-blur-md border border-purple-200 dark:border-purple-900 shadow-2xl rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300
                    ${isClosing ? "animate-slide-down" : "animate-slide-up"}
                    `}
              >
                {/* 왼쪽: 선택된 단어 목록 */}
                <div className="flex flex-1 flex-col gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <span>선택된 단어</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        selectedWords.length === 5
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}
                    >
                      {selectedWords.length} / 5
                    </span>
                  </div>

                  {/* 선택된 단어 뱃지 나열 */}
                  <div className="flex flex-wrap gap-2 min-h-7">
                    {selectedWords.length === 0
                      ? null
                      : selectedWords.map((id) => {
                          const foundWord = words.find((w) => w.id === id);
                          if (!foundWord) return null;

                          const baseColor =
                            foundWord.categories?.color || "#a855f7";

                          return (
                            <span
                              key={id}
                              className="animate-pop-in inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-default"
                              style={{
                                color: baseColor,
                                backgroundColor: `${baseColor}20`,
                                borderColor: `${baseColor}30`,
                              }}
                            >
                              {foundWord.word}
                              <button
                                onClick={() => handleToggleSelect(id)}
                                className="ml-1.5 hover:opacity-50 transition-opacity cursor-pointer"
                              >
                                X
                              </button>
                            </span>
                          );
                        })}
                  </div>
                </div>

                {/* 오른쪽: 생성 버튼 */}
                <button
                  disabled={selectedWords.length === 0}
                  onClick={() => {
                    // 여기에 AI 생성 API 호출 로직 연결
                    console.log("선택된 단어들로 생성 시작:", selectedWords);
                  }}
                  className={`
                    w-full md:w-auto px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all
                    ${
                      selectedWords.length > 0
                        ? "bg-linear-to-r from-purple-600 to-indigo-600 hover:scale-105 hover:shadow-purple-500/25 cursor-pointer"
                        : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    }
                  `}
                >
                  {selectedWords.length === 0
                    ? "단어를 선택하세요"
                    : "AI 예문 만들기 ✨"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

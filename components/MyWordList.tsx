"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Category, Word } from "@/types";
import WordCard from "./WordCard";
import { toast } from "sonner";
import { generateSentencesWithAI } from "@/actions/ai";
import { AI_DAILY_LIMIT, AI_LIMIT_MESSAGE } from "@/constants/service";
import ResetTimer from "@/components/ResetTimer";
import SearchBar from "@/components/ui/SearchBar";

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

  // 오늘 AI 사용 횟수 저장 상태 변수
  const [dailyUsageCount, setDailyUsageCount] = useState(0);

  // AI 예문 생성 로딩 상태 변수
  const [isGenerating, setIsGenerating] = useState(false);

  // AI 결과 텍스트 저장하는 상태 변수
  const [aiResult, setAiResult] = useState<string | null>(null);

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

  // 오늘 AI 사용량 조회
  useEffect(() => {
    const fetchDailyUsage = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("ai_usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "SUCCESS") // 성공한 건만 카운트
        .gte("created_at", today.toISOString());

      if (count !== null) {
        setDailyUsageCount(count);
      }
    };

    fetchDailyUsage();
  }, [userId, isAiMode]);

  // AI 예문 생성 핸들러
  const handleGenerateAI = async () => {
    if (selectedWords.length === 0) return;

    if (dailyUsageCount >= AI_DAILY_LIMIT) {
      toast.error(AI_LIMIT_MESSAGE);
      return;
    }

    setIsGenerating(true);

    // 선택된 단어 ID를 가지고 실제 단어 객체를 찾음
    const targetWords = selectedWords
      .map((id) => words.find((w) => w.id === id))
      .filter((w): w is Word => w !== undefined)
      .map((w) => ({
        id: w.id,
        word: w.word,
        meaning: w.meaning,
      }));

    try {
      // 서버 액션 호출
      const res = await generateSentencesWithAI(targetWords);

      if (res.success && res.data) {
        setAiResult(res.data);
        // UI 즉시 반영
        setDailyUsageCount((prev) => prev + 1);
        toast.success("AI가 예문을 만들었어요! 🎉");
      } else {
        toast.error(res.message || "생성에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      toast.error("알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-8 pb-30 md:pb-15">
      {/* 헤더 및 검색창 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">내 단어장 📒</h1>
        <div className="flex items-center gap-2">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full md:w-72"
          />
          <div>
            <button
              className={`
                px-3 py-2.5 h-10.5 flex items-center rounded-xl font-bold transition-all duration-200 relative overflow-hidden group outline-none border cursor-pointer
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
                className={`absolute inset-0 bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 transition-opacity duration-200 ${
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
                className={`bg-white/80 dark:bg-[#1E1E1E]/90 backdrop-blur-md border border-purple-200 dark:border-purple-900 shadow-2xl rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-200
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

                  {/* 사용량 안내 문구 */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      📅 오늘 생성 횟수
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        dailyUsageCount >= 3
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {dailyUsageCount} / {AI_DAILY_LIMIT}회
                    </span>
                  </div>
                </div>

                {/* 오른쪽: 생성 버튼 */}
                <button
                  disabled={
                    selectedWords.length === 0 ||
                    isGenerating ||
                    dailyUsageCount >= AI_DAILY_LIMIT
                  }
                  onClick={handleGenerateAI}
                  className={`
                    w-full md:w-41.5 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all
                    ${
                      // 오늘 횟수 마감
                      dailyUsageCount >= AI_DAILY_LIMIT
                        ? "bg-gray-400 dark:bg-[#2b2b2b] cursor-not-allowed opacity-80"
                        : // 생성 가능
                        selectedWords.length > 0 && !isGenerating
                        ? "bg-linear-to-r from-purple-600 to-indigo-600 hover:scale-105 hover:shadow-purple-500/25 cursor-pointer"
                        : // 단어 선택 안 함
                          "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    }
                  `}
                >
                  {isGenerating ? (
                    <div className="flex items-center w-full gap-4">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      생성 중...
                    </div>
                  ) : dailyUsageCount >= 3 ? (
                    <span className="flex items-center justify-center gap-2 text-md text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-timer-reset-icon lucide-timer-reset"
                      >
                        <path d="M10 2h4" />
                        <path d="M12 14v-4" />
                        <path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" />
                        <path d="M9 17H4v5" />
                      </svg>
                      <ResetTimer />
                    </span>
                  ) : selectedWords.length === 0 ? (
                    "단어를 선택하세요"
                  ) : (
                    "AI 예문 만들기 ✨"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* AI 결과 모달 */}
          {aiResult && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-purple-100 dark:border-purple-900 animate-scale-up">
                {/* 타이틀 */}
                <div className="flex justify-center items-center mb-6">
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-indigo-600">
                    AI 예문 생성 서비스
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-10">
                  <span className="font-bold text-sm">선택된 단어: </span>
                  {selectedWords.map((id) => {
                    const wordObj = words.find((w) => w.id === id);
                    if (!wordObj) return null;

                    return (
                      <span
                        key={id}
                        className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold border border-purple-100 dark:border-purple-800 cursor-default"
                      >
                        {wordObj.word}
                      </span>
                    );
                  })}
                </div>

                {/* 복사 문구 */}
                <div className="relative group mb-3">
                  <div className="absolute -top-6 right-0 z-10">
                    <span
                      className="
                        flex items-center gap-1 text-xs font-bold 
                        text-purple-600 dark:text-purple-300
                        animate-pulse
                      "
                    >
                      예문을 클릭하여 복사해보세요!
                    </span>
                  </div>

                  {/* 예문 박스 */}
                  <div
                    onClick={() => {
                      if (!aiResult) return;
                      navigator.clipboard.writeText(aiResult);
                      toast.success("클립보드에 복사되었습니다!");
                    }}
                    className="
                      cursor-pointer 
                      bg-purple-50 dark:bg-purple-900/20 
                      p-6 pt-6 rounded-xl 
                      border border-purple-100 dark:border-purple-800 
                      hover:bg-purple-100 dark:hover:bg-purple-900/30 
                      hover:border-purple-300 dark:hover:border-purple-600
                      active:scale-[0.98] transition-all duration-200
                    "
                  >
                    <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-100 break-keep select-none">
                      "{aiResult}"
                    </p>
                  </div>
                </div>
                <div className="flex w-full justify-center items-center mb-3">
                  <span className="font-bold text-sm">
                    생성된 예문은 마이페이지에서 확인 가능합니다.
                  </span>
                </div>
                {/* 확인 버튼 */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setAiResult(null);
                      setSelectedWords([]);
                      setIsAiMode(false);
                    }}
                    className="w-full py-3 rounded-xl text-md font-bold text-white bg-black dark:bg-white dark:text-black hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

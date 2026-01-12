"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmToast from "@/components/ui/ConfirmToast";

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface Word {
  id: number;
  date: string;
  word: string;
  meaning: string;
  example: string;
  hanja?: string;
  refined_word?: string;
  detail?: string;
  category?: string;
  categories?: Category;
}

interface Props {
  initialWords: Word[];
  categories: Category[];
}

export default function AdminDashboard({ initialWords, categories }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [words, setWords] = useState<Word[]>(initialWords);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  // 모달 열렸을 때 뒷배경 스크롤 방지
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // 컴포넌트가 언마운트되거나 모달이 닫힐 때 스크롤 잠금 해제
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // 서버 데이터가 바뀌면 단어 목록 갱신
  useEffect(() => {
    setWords(initialWords);
  }, [initialWords]);

  // 오늘 날짜 구하기
  const getToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 폼 상태
  const [formData, setFormData] = useState({
    date: getToday(),
    word: "",
    meaning: "",
    hanja: "",
    refined_word: "",
    example: "",
    detail: "",
    category: "",
  });

  // 초기화
  const resetForm = () => {
    setFormData({
      date: getToday(),
      word: "",
      meaning: "",
      hanja: "",
      refined_word: "",
      example: "",
      detail: "",
      category: "",
    });
    setEditingWord(null);
  };

  // 모달 열기
  const openModal = (word?: Word) => {
    if (word) {
      setEditingWord(word);
      setFormData({
        date: word.date,
        word: word.word,
        meaning: word.meaning,
        hanja: word.hanja || "",
        refined_word: word.refined_word || "",
        example: word.example,
        detail: word.detail || "",
        category: word.category || categories[0]?.id || "",
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  // 저장 (추가/수정)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingWord) {
        // 수정
        const { error } = await supabase
          .from("words")
          .update(formData)
          .eq("id", editingWord.id);
        if (error) throw error;
        toast.success("수정되었습니다.");
      } else {
        // 추가
        const { error } = await supabase.from("words").insert(formData);
        if (error) throw error;
        toast.success("추가되었습니다.");
      }

      router.refresh();
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error("오류 발생: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 삭제
  const handleDelete = async (id: number) => {
    toast.custom(
      (t) => (
        <ConfirmToast
          t={t}
          title="단어를 삭제하시겠습니까?"
          description="삭제된 단어는 복구할 수 없습니다."
          confirmLabel="삭제"
          onConfirm={async () => {
            // 로딩 표시
            const loadingToast = toast.loading("삭제 중...");

            // DB 삭제 요청
            const { error } = await supabase
              .from("words")
              .delete()
              .eq("id", id);

            toast.dismiss(loadingToast); // 로딩 닫기

            if (error) {
              toast.error("삭제 실패: " + error.message);
            } else {
              setWords((prev) => prev.filter((w) => w.id !== id));
              router.refresh();
              toast.success("삭제되었습니다.");
            }
          }}
        />
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  // 검색
  const filteredWords = words.filter(
    (w) => w.word.includes(searchTerm) || w.meaning.includes(searchTerm)
  );

  return (
    <div>
      {/* 상단 컨트롤러 (공통) */}
      <div className="flex gap-4 w-full mb-6">
        <div className="flex items-center w-full px-4 py-2.5 border border-gray-300 dark:border-[#333] rounded-xl bg-white dark:bg-[#1E1E1E] focus-within:ring-2 focus-within:ring-black transition-all">
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
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
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
        <button
          onClick={() => openModal()}
          className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-2 py-2 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer"
        >
          + 단어 추가
        </button>
      </div>

      {/* 모바일 뷰: 카드 리스트 (md 미만) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredWords.map((word) => (
          <div
            key={word.id}
            onClick={() => openModal(word)}
            className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm flex flex-col gap-3"
          >
            {/* 상단: 날짜, 카테고리, 순화어 */}
            <div className="flex justify-between items-start">
              <div className="flex flex-row items-center gap-3">
                <span className="text-xs text-gray-400">
                  {word.date.replace(/-/g, ".")}
                </span>
                {word.categories?.color ? (
                  <span
                    className="text-[11px] px-2 py-1 rounded w-fit font-bold"
                    style={{
                      color: word.categories.color,
                      backgroundColor: `${word.categories.color}15`,
                    }}
                  >
                    {word.categories.name}
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-1 rounded w-fit font-bold bg-gray-100 text-gray-400 dark:bg-[#333]">
                    {word.categories?.name || word.category || "미분류"}
                  </span>
                )}
              </div>
              {word.refined_word && (
                <span className="text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-full">
                  순화어: {word.refined_word}
                </span>
              )}
            </div>

            {/* 중단: 단어, 뜻 */}
            <div>
              <div className="flex items-end gap-2 mb-1">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  {word.word}
                </h3>
                {word.hanja && (
                  <span className="text-sm text-gray-400 mb-0.5">
                    {word.hanja}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {word.meaning}
              </p>
            </div>

            {/* 하단: 삭제 버튼 */}
            <div className="flex gap-2 mt-2 pt-3 border-t dark:border-[#333]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(word.id);
                }}
                className="flex-1 py-2 text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        ))}

        {filteredWords.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            데이터가 없습니다.
          </div>
        )}
      </div>

      {/* 데스크탑 뷰: 테이블 (md 이상) */}
      <div className="hidden md:block bg-white dark:bg-[#1E1E1E] rounded-xl shadow border border-gray-200 dark:border-[#333] overflow-hidden overflow-x-auto">
        <table className="w-full text-center border-collapse table-fixed">
          <thead className="bg-gray-50 dark:bg-[#252525] border-b dark:border-[#333]">
            <tr>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 w-28 whitespace-nowrap">
                날짜
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 w-32 whitespace-nowrap">
                단어
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 w-24 whitespace-nowrap">
                카테고리
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 w-24 whitespace-nowrap">
                순화어
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                뜻
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                상세
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 w-24 whitespace-nowrap">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-[#333]">
            {filteredWords.map((word) => (
              <tr
                key={word.id}
                onClick={() => openModal(word)}
                className="hover:bg-gray-50 dark:hover:bg-[#2c2c2c] cursor-pointer"
              >
                <td className="p-4 text-sm text-gray-500 font-mono whitespace-nowrap">
                  {word.date}
                </td>
                <td className="p-4 pl-6">
                  <div className="font-bold text-lg text-black dark:text-white whitespace-nowrap">
                    {word.word}
                  </div>
                  {word.hanja && (
                    <div className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                      {word.hanja}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  {word.categories?.color ? (
                    <span
                      className="text-[11px] px-2 py-1 rounded font-bold whitespace-nowrap"
                      style={{
                        color: word.categories.color,
                        backgroundColor: `${word.categories.color}15`,
                      }}
                    >
                      {word.categories.name}
                    </span>
                  ) : (
                    <span className="text-[11px] px-2 py-1 rounded font-bold whitespace-nowrap bg-gray-100 text-gray-400 dark:bg-[#333]">
                      {word.categories?.name || word.category || "미분류"}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-gray-500 dark:text-gray-400 font-medium text-sm line-clamp-2 break-keep">
                    {word.refined_word || "-"}
                  </div>
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-300 text-left">
                  <div
                    className="line-clamp-2 leading-relaxed"
                    title={word.meaning}
                  >
                    {word.meaning}
                  </div>
                </td>
                <td className="p-4 text-gray-500 dark:text-gray-400 text-sm text-left">
                  <div
                    className="line-clamp-2 leading-relaxed"
                    title={word.detail}
                  >
                    {word.detail || "-"}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-2 items-center w-full">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(word.id);
                      }}
                      className="w-full text-center text-sm bg-red-100 dark:bg-red-900/30 text-red-600 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-900/50 cursor-pointer"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredWords.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            데이터가 없습니다.
          </div>
        )}
      </div>

      {/* 단어 추가 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-lg rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              {editingWord ? "단어 수정" : "새 단어 추가"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">날짜</label>
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded dark:bg-[#2c2c2c] dark:border-[#444]"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">단어</label>
                <input
                  required
                  className="w-full p-2 border rounded dark:bg-[#2c2c2c] dark:border-[#444]"
                  value={formData.word}
                  onChange={(e) =>
                    setFormData({ ...formData, word: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    한자 (선택)
                  </label>
                  <input
                    className="w-full p-2 border rounded dark:bg-[#2c2c2c] dark:border-[#444]"
                    value={formData.hanja}
                    onChange={(e) =>
                      setFormData({ ...formData, hanja: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    순화어 (선택)
                  </label>
                  <input
                    className="w-full p-2 border rounded dark:bg-[#2c2c2c] dark:border-[#444]"
                    value={formData.refined_word}
                    onChange={(e) =>
                      setFormData({ ...formData, refined_word: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">뜻</label>
                <input
                  required
                  className="w-full p-2 border rounded dark:bg-[#2c2c2c] dark:border-[#444]"
                  value={formData.meaning}
                  onChange={(e) =>
                    setFormData({ ...formData, meaning: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  카테고리
                </label>
                <select
                  className="w-full p-2 border rounded dark:bg-[#2c2c2c] dark:border-[#444]"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">선택 안 함</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">예문</label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-2 border rounded dark:bg-[#2c2c2c] dark:border-[#444]"
                  value={formData.example}
                  onChange={(e) =>
                    setFormData({ ...formData, example: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  상세 설명 (선택)
                </label>
                <textarea
                  rows={2}
                  className="w-full p-2 border rounded dark:bg-[#2c2c2c] dark:border-[#444]"
                  value={formData.detail}
                  onChange={(e) =>
                    setFormData({ ...formData, detail: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "저장 중..." : "저장하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

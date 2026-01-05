"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface Props {
  wordId: number;
  userId: string;
  initialIsBookmarked?: boolean;
  // 상태가 바뀌면 부모에게 알림
  onChange?: (isBookmarked: boolean) => void;
}

export default function BookmarkButton({
  wordId,
  userId,
  initialIsBookmarked = false,
  onChange,
}: Props) {
  const supabase = createClient();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);

    // 낙관적 업데이트
    const previousState = isBookmarked;
    const newState = !isBookmarked;
    setIsBookmarked(!isBookmarked);

    if (onChange) {
      onChange(newState);
    }

    try {
      if (previousState) {
        // 삭제
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", userId)
          .eq("word_id", wordId);

        if (error) throw error;
        toast.success("단어장에서 삭제되었습니다.");
      } else {
        // 추가
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: userId, word_id: wordId });

        if (error) throw error;
        toast.success("단어장에 추가되었습니다.");
      }
    } catch (error) {
      console.error("북마크 에러:", error);
      setIsBookmarked(previousState); // 롤백
      toast.error("북마크 처리에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 rounded-full transition-colors cursor-pointer ${
        isBookmarked ? "text-red-500" : "text-gray-400 hover:text-red-400 "
      }`}
      disabled={isLoading}
      aria-label={isBookmarked ? "단어장 삭제" : "단어장 저장"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isBookmarked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}

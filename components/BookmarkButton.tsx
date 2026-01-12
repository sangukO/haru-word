"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import ConfirmToast from "./ui/ConfirmToast";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

interface Props {
  wordId: number;
  userId: string;
  initialIsBookmarked?: boolean;
  // 상태가 바뀌면 부모에게 알림
  onChange?: (isBookmarked: boolean) => void;
  disabled?: boolean;
}

export default function BookmarkButton({
  wordId,
  userId,
  initialIsBookmarked = false,
  onChange,
  disabled,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const toggleBookmark = async (e: React.MouseEvent) => {
    if (disabled) return;

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
    } catch (error: any) {
      if (error.code === "22P02") {
        toast.custom(
          (t) => (
            <ConfirmToast
              t={t}
              title="로그인이 필요한 기능입니다."
              description="로그인하시겠습니까?"
              confirmLabel="로그인"
              onConfirm={async () => {
                router.push("/login");
              }}
            />
          ),
          { duration: Infinity, position: "top-center" }
        );
        setIsBookmarked(previousState); // 롤백
      } else {
        console.error("북마크 에러:", error);
        setIsBookmarked(previousState); // 롤백
        toast.error("북마크 처리에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 rounded-full transition-colors cursor-pointer ${
        isBookmarked ? "text-red-500" : "text-gray-400 hover:text-red-400 "
      }
      ${
        disabled
          ? "opacity-30 cursor-pointer pointer-events-none"
          : "hover:scale-110 active:scale-95 cursor-pointer"
      }
        `}
      disabled={isLoading || disabled}
      aria-label={isBookmarked ? "단어장 삭제" : "단어장 저장"}
    >
      <Heart
        className="w-6 h-6"
        strokeWidth={1.5}
        fill={isBookmarked ? "currentColor" : "none"}
      />
    </button>
  );
}

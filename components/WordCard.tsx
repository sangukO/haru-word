"use client";

import Link from "next/link";
import { Word } from "@/types";
import BookmarkButton from "./BookmarkButton";

interface Props {
  word: Word;
  userId?: string;
  isBookmarked?: boolean;
  // 단어 리스트에서 해당 카드 제거
  onRemove?: (wordId: number) => void;
  className?: string;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
  isSelectionMode?: boolean;
}

export default function WordCard({
  word,
  userId,
  isBookmarked = false,
  onRemove,
  className,
  style,
  isSelected,
  onClick,
  isSelectionMode,
}: Props) {
  // 버튼 상태가 바뀔 때 실행될 함수
  const handleBookmarkChange = (newIsBookmarked: boolean) => {
    // 북마크가 해제되었고, onRemove 함수가 존재한다면
    if (!newIsBookmarked && onRemove) {
      onRemove(word.id);
    }
  };

  return (
    <div
      onClick={onClick}
      style={style}
      className={[
        "relative group flex flex-col rounded-xl border transition hover:z-20",

        isSelected
          ? "bg-[#fefcff] dark:bg-[#181818] border-purple-500 dark:border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.3)] scale-[1.02] z-10"
          : "bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333] hover:shadow-lg",

        className,
      ].join(" ")}
    >
      {/* 찜 버튼 */}
      {/* userId가 있을 때만 렌더링 */}
      {userId && (
        <div className="absolute top-4 right-4 z-10 cursor-pointer">
          <BookmarkButton
            wordId={word.id}
            userId={userId}
            initialIsBookmarked={isBookmarked}
            onChange={handleBookmarkChange}
            disabled={isSelectionMode}
          />
        </div>
      )}

      {/* 카드 내용 */}
      <Link
        href={`/words/${word.id}`}
        className="flex flex-col flex-1 p-6 h-full"
        onClick={(e) => {
          if (isSelectionMode) {
            e.preventDefault();
          }
        }}
      >
        {/* 상단 카테고리 뱃지*/}
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
        </div>

        {/* 본문 단어 & 뜻 */}
        <div className="mb-4 flex-1">
          <h3 className="text-2xl font-bold mb-2">{word.word}</h3>
          <p className="text-sm leading-relaxed line-clamp-2">{word.meaning}</p>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex w-full justify-between pt-4 border-t border-gray-100 dark:border-[#333]">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide">
            {word.date.replace(/-/g, ".")}
          </span>
          <div className="text-xs text-gray-400 text-right">자세히 보기 →</div>
        </div>
      </Link>
    </div>
  );
}

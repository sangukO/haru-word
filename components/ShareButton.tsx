"use client";

import { useState } from "react";

interface Props {
  text: string; // 공유할 텍스트
  url?: string; // 공유할 URL
}

export default function ShareButton({ text, url }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url
      ? `${window.location.origin}${url}`
      : window.location.href;

    // 모바일 기기 확인
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: "하루단어",
          text: text,
          url: shareUrl,
        });
      } catch (error) {
        console.error("공유 취소", error);
      }
    }
    // PC 또는 Web Share API 미지원 기기일 경우 주소만 복사
    else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error("클립보드 복사 실패:", error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-sub hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      aria-label="공유하기"
    >
      {/* 공유 아이콘 (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" x2="12" y1="2" y2="15" />
      </svg>

      {/* 상태에 따라 텍스트 변경 */}
      <span>{isCopied ? "링크 복사됨!" : "공유하기"}</span>
    </button>
  );
}

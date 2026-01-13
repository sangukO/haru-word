"use client";

import { Copy, Link } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  text: string; // 공유할 텍스트
  url?: string; // 공유할 URL
}

export default function ShareButton({ text, url }: Props) {
  const handleShare = async () => {
    const shareUrl = url
      ? `${window.location.origin}${url}`
      : window.location.href;

    toast.success("링크가 복사되었습니다!");

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
      } catch (error) {
        console.error("클립보드 복사 실패:", error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center w-7 h-7 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer outline-none shrink-0"
      aria-label="링크 복사"
      title="링크 복사"
    >
      <Link size={15} strokeWidth={2.5} />
    </button>
  );
}

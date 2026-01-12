"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string; // 내부 컨텐츠 스타일
  hideCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "max-w-lg",
  hideCloseButton = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 스크롤 잠금 처리
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!mounted || !isOpen) return null;

  // Portal을 사용하여 body 바로 아래에 렌더링
  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 박스 */}
      <div
        className={`relative w-full bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#333] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ${className}`}
        // 내부 클릭 시 닫히지 않도록 이벤트 전파 중단
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[#333] shrink-0">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </div>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-full cursor-pointer group"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
              </button>
            )}
          </div>
        )}

        {/* 메인 컨텐츠 (스크롤 가능) */}
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}

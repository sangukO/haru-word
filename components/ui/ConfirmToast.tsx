"use client";

import { toast } from "sonner";

interface ConfirmToastProps {
  t: string | number; // 토스트 ID
  title: string;
  description: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean; // 빨간 버튼 여부
}

export default function ConfirmToast({
  t,
  title,
  description,
  onConfirm,
  confirmLabel = "확인",
  cancelLabel = "취소",
  isDestructive = true,
}: ConfirmToastProps) {
  return (
    <div className="w-full flex flex-col gap-4 p-4 md:min-w-[350px] bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-gray-100 dark:border-[#333]">
      {/* 제목 & 설명 */}
      <div>
        <h3 className="font-bold text-base mb-1 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => toast.dismiss(t)}
          className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          {cancelLabel}
        </button>

        <button
          onClick={() => {
            toast.dismiss(t); // 확인 누르면 토스트 닫고
            onConfirm(); // 로직 실행
          }}
          className={`px-3 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-sm ${
            isDestructive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-black dark:bg-white dark:text-black hover:opacity-80"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

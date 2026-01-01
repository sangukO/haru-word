"use client";

import { toast } from "sonner";

export default function ContactButton() {
  const handleCopy = () => {
    const email = "help@haruword.com";

    navigator.clipboard.writeText(email);

    toast.success("이메일 주소가 복사되었습니다.", {
      description: email,
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 dark:bg-[#252525] hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors border border-transparent hover:border-gray-200 dark:hover:border-[#444] cursor-pointer"
    >
      <div className="flex items-center gap-2">
        {/* 편지 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-500"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          문의하기
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">help@haruword.com</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      </div>
    </button>
  );
}

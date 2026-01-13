"use client";

import { toast } from "sonner";
import { Copy, Mail } from "lucide-react";

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
        <Mail size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          문의하기
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">help@haruword.com</span>
        <Copy size={12} className="text-gray-400" />
      </div>
    </button>
  );
}

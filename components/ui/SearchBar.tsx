"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "검색할 단어를 입력하세요.",
  className = "",
}: SearchBarProps) {
  return (
    <div
      className={`
        flex items-center px-4 py-2.5 
        border border-gray-300 dark:border-[#333] 
        rounded-xl bg-white dark:bg-[#1E1E1E] 
        focus-within:border-black dark:focus-within:border-gray-400 
        transition-colors ${className}
      `}
    >
      {/* 검색 아이콘 */}
      <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />

      {/* 입력 필드 */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-400 text-gray-900 dark:text-white min-w-0"
      />

      {/* 초기화 버튼 */}
      {/* 검색어가 있을 때만 표시 */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

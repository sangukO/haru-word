"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

// 제네릭으로 구현
interface SelectProps<T> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  label?: string; // "Year:" 같은 라벨
  formatLabel?: (value: T) => string; // "2026" -> "2026년" 변환기 (선택사항)
}

export default function Select<T extends string | number>({
  value,
  options,
  onChange,
  label,
  formatLabel = (v) => String(v), // 기본값은 그냥 문자열 변환
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border transition-all cursor-pointer
          ${
            isOpen
              ? "bg-gray-100 border-gray-300 text-gray-900 dark:bg-[#2d333b] dark:border-gray-500 dark:text-white"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-[#1E1E1E] dark:border-[#333] dark:text-gray-300 dark:hover:bg-[#2d333b] dark:hover:border-gray-600"
          }
        `}
      >
        {label && <span>{label}</span>}
        <span className="font-bold text-gray-900 dark:text-white">
          {formatLabel(value)}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-32 z-50 origin-top-right bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#444] rounded-lg shadow-xl overflow-hidden ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            {label && (
              <div className="px-3 py-2 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-[#333] cursor-default">
                Select {label.replace(":", "")}
              </div>
            )}
            {options.map((option) => (
              <button
                key={String(option)}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#2d333b] transition-colors cursor-pointer"
              >
                <div className="w-4 flex justify-center">
                  {value === option && (
                    <Check
                      size={14}
                      className="text-gray-900 dark:text-white"
                    />
                  )}
                </div>
                <span
                  className={`flex-1 ${
                    value === option
                      ? "font-bold text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {formatLabel(option)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

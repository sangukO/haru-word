"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getFormatDateToString, getFormattedKoreanDate } from "@/utils/date";
import "react-day-picker/dist/style.css";
import { ko } from "react-day-picker/locale";

interface DatePickerProps {
  date: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
  className?: string;
}

export default function DatePicker({
  date,
  onChange,
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 문자열("2026-01-13") -> Date 객체 변환
  const selectedDate = date ? new Date(date) : undefined;

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

  // 날짜 선택 핸들러
  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      onChange(getFormatDateToString(newDate));
      setIsOpen(false);
    }
  };

  const defaultClassNames = getDefaultClassNames();
  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* 입력 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-3 py-2.5 text-sm rounded border cursor-pointer transition-colors text-left
          ${
            isOpen
              ? "bg-gray-100 border-gray-300 text-gray-900 dark:bg-[#2d333b] dark:border-gray-500 dark:text-white"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-[#2c2c2c] dark:border-[#444] dark:text-gray-300 dark:hover:bg-[#383838] dark:hover:border-gray-500"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon
            size={16}
            className="text-gray-500 dark:text-gray-400"
          />
          {selectedDate ? (
            <span className="font-medium text-gray-900 dark:text-white">
              {getFormattedKoreanDate(getFormatDateToString(selectedDate))}
            </span>
          ) : (
            <span className="text-gray-500">날짜를 선택하세요</span>
          )}
        </div>
      </button>

      {/* 캘린더 팝업 */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white p-5 dark:bg-[#2c2c2c] border border-gray-200 dark:border-[#444] rounded-lg shadow-xl animate-in fade-in zoom-in-95 w-auto min-w-75 flex justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={ko}
            classNames={{
              today: `text-gray-600`,
              selected: `bg-gray-400 dark:bg-[#616161] text-white dark:text-white font-extrabold rounded-md`,
              day: `rounded-md text-gray-300 dark:text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#3f3f3f]`,
              root: `${defaultClassNames.root}`,
              chevron: `${defaultClassNames.chevron} fill-gray-400! hover:fill-gray-600! dark:fill-gray-400! dark:hover:fill-gray-200!`,
            }}
          />
        </div>
      )}
    </div>
  );
}

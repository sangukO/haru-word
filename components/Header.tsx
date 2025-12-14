"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HitCounter from "@/components/HitCounter";
import LoginButton from "./LoginButton";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null; // 레이아웃에서 전달된 사용자 정보
  todayFormatted: string;
  initialView: number;
}

export default function Header({
  user,
  todayFormatted,
  initialView,
}: HeaderProps) {
  const supabase = createClient();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // 드롭다운이 열려 있을 때만 이벤트 리스너 추가
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // 메뉴 닫힐 때 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-[#121212]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 grid grid-cols-3 items-center border-b border-black dark:border-[#A0A0A0]">
        <div
          suppressHydrationWarning={true}
          className="text-left text-sm font-medium tracking-widest text-[#111111] dark:text-[#F1F1F1]"
        >
          {todayFormatted}
        </div>
        <h1 className="text-center text-lg font-bold tracking-tight cursor-pointer">
          <Link href="/">하루단어</Link>
        </h1>
        <div className="flex items-center justify-end gap-6 text-right">
          <div className="inline-block h-6">
            <HitCounter initialView={initialView} />
          </div>
          {user ? (
            <div ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`
                group relative flex items-center justify-center
                h-10 px-3 rounded-sm gap-3
                border transition-all duration-200 ease-in-out cursor-pointer`}
              >
                {/* (선택) 프로필 사진 작게 보여주기 */}
                {user.user_metadata.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="프로필"
                    className="w-8 h-8 rounded-full border border-gray-300"
                  />
                )}
                <span className="text-sm font-medium">
                  {user.user_metadata.full_name || "사용자"}님
                </span>
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute right-4 mt-2 w-48 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-md shadow-lg py-1 z-50 animate-fade-in-down">
                  {/* 내 정보 */}
                  <Link
                    href=""
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    내 정보
                  </Link>

                  {/* 내 단어장 */}
                  <Link
                    href=""
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    내 단어장
                  </Link>

                  {/* 구분선 */}
                  <div className="border-t border-gray-200 dark:border-[#333] my-1"></div>

                  {/* 로그아웃 */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#3A1E1E] transition-colors text-left"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <LoginButton text="로그인" className="px-3 text-sm font-medium" />
          )}
        </div>
      </div>
    </header>
  );
}

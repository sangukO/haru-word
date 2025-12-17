"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HitCounter from "@/components/HitCounter";
import LoginButton from "./LoginButton";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasWelcomeCookie = document.cookie.includes("welcome-toast=true");

    if (hasWelcomeCookie && user) {
      setTimeout(() => {
        toast.success(`반갑습니다, ${user.user_metadata.full_name}님!`, {
          description: "오늘도 하루 단어를 채워보세요.",
          icon: "👋",
        });
      }, 300);
    }
  }, [user]);

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

  // 모바일 메뉴 토글 시 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    toast("로그아웃 되었습니다.", {
      description: "다음에 또 만나요! 👋",
    });

    // 강제 새로고침 대신 부드러운 갱신 사용
    router.refresh();
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-[#121212]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex md:grid md:grid-cols-3 items-center justify-between border-b border-black dark:border-[#A0A0A0]">
          <div
            suppressHydrationWarning={true}
            className="hidden md:block text-left text-sm font-medium tracking-widest text-[#111111] dark:text-[#F1F1F1]"
          >
            {todayFormatted}
          </div>
          <h1 className="text-lg font-bold tracking-tight cursor-pointer absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:text-center">
            <Link href="/">하루단어</Link>
          </h1>
          <div className="hidden md:flex items-center justify-end gap-6 text-right">
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
                transition-all duration-200 ease-in-out cursor-pointer`}
                >
                  {/* 프로필 사진 */}
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
                    {/* 전체 단어 */}
                    <Link
                      href="/words"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      단어 검색
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

                    {/* 내 정보 */}
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      내 정보
                    </Link>

                    {/* 로그아웃 */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#3A1E1E] transition-colors text-left cursor-pointer"
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
          {/* 모바일 햄버거 버튼 */}
          <button
            className="md:hidden p-2 z-50 ml-auto"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-60 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 슬라이드 메뉴 패널 */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-white dark:bg-[#1E1E1E] z-70 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* 메뉴 상단: 닫기 버튼 */}
          <div className="flex justify-end">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 메뉴 컨텐츠 */}
          <div className="flex-1 flex flex-col gap-6">
            {/* 사용자 정보 및 메뉴 */}
            {user ? (
              <div className="flex flex-col gap-4">
                {/* 프로필 영역 */}
                <div className="flex items-center gap-3 mb-4">
                  {user.user_metadata.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-bold text-lg dark:text-white">
                      {user.user_metadata.full_name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* 네비게이션 링크 */}
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/words"
                    className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded font-medium dark:text-gray-200"
                  >
                    단어 검색
                  </Link>
                  <Link
                    href="#"
                    className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded font-medium dark:text-gray-200"
                  >
                    내 단어장
                  </Link>
                </nav>

                {/* 구분선 */}
                <div className="border-t border-gray-200 dark:border-[#333] my-1"></div>
                <nav className="flex flex-col gap-2">
                  <Link
                    href="#"
                    className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded font-medium dark:text-gray-200"
                  >
                    내 정보
                  </Link>
                  {/* 로그아웃 버튼 */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 font-medium py-3 px-2"
                  >
                    로그아웃
                  </button>
                </nav>
              </div>
            ) : (
              // 비로그인 시
              <div className="mt-4">
                <p className="text-gray-500 text-sm mb-4 text-center">
                  로그인하고 단어를 저장해보세요!
                </p>
                <div className="flex w-full justify-center">
                  <LoginButton text="Google 계정으로 로그인" />
                </div>
              </div>
            )}
          </div>

          {/* 하단 날짜 정보 */}
          {/* 방문자 수 */}
          <div className="flex justify-between items-center bg-gray-50 dark:bg-[#2A2A2A] p-4 rounded-lg">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Visits
            </span>
            <span className="font-bold text-lg dark:text-white">
              {initialView}
            </span>
          </div>
          <div className="mt-auto pt-6 text-center text-xs text-gray-400">
            {todayFormatted}
          </div>
        </div>
      </div>
    </>
  );
}

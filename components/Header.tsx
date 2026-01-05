"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LoginButton from "./LoginButton";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface HeaderProps {
  user: User | null;
  todayFormatted: string;
}

export default function Header({
  user: initialUser,
  todayFormatted,
}: HeaderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isScrolled, setIsScrolled] = useState(false); // 스크롤 감지용 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 드롭다운 관련
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();
  const router = useRouter();

  // 유저 상태 관리
  useEffect(() => {
    setUser(initialUser);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") setUser(null);
      else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")
        setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase, initialUser]);

  // 스크롤 감지 로직
  useEffect(() => {
    const handleScroll = () => {
      // 180px 이상 스크롤되면 스티키 헤더 보이기
      setIsScrolled(window.scrollY > 180);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    if (isDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // 모바일 메뉴 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
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

  // 공통 메뉴 리스트
  const NAV_LINKS = [
    { name: "오늘의 단어", href: "/" },
    { name: "전체 단어", href: "/words" },
    { name: "내 단어장", href: "/wordbook" },
    // { name: "마이 페이지", href: "/mypage" },
    { name: "서비스 소개", href: "/about" },
  ];

  return (
    <>
      {/* 메인 헤더 */}
      <header className="relative w-full md:max-w-[1200px] mx-auto bg-white dark:bg-[#121212] text-black dark:text-white border-b border-black dark:border-white z-40">
        {/* 상단 유틸리티 바 */}
        <div className="max-w-[1200px] mx-auto px-4 h-14 md:h-10 flex items-center justify-between text-[11px] md:text-xs font-medium tracking-wide md:border-b border-gray-200 dark:border-[#333]">
          {/* 왼쪽: 날짜 표시, 모바일은 로고 */}
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-gray-500 dark:text-gray-400">
              {todayFormatted}
            </span>
            <Link href="/" className="md:hidden flex items-center gap-2">
              <img src="/icon.png" alt="하루단어 로고" className="w-7 h-7" />
              <span className="text-lg font-bold">하루단어</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {/* 모바일 햄버거 */}
            <button
              className="md:hidden p-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg
                className="w-5 h-5"
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

            {/* 데스크탑 로그인 버튼 */}
            <div className="hidden md:block">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="font-bold hover:underline cursor-pointer"
                >
                  로그아웃
                </button>
              ) : (
                <Link
                  href="/login"
                  className="font-bold hover:underline cursor-pointer"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 중단 로고 */}
        <div className="hidden md:flex py-2 md:py-4 text-center justify-center w-fit mx-auto">
          <h1
            className="text-4xl font-bold
            tracking-tighter cursor-pointer
            transition-all duration-500 ease-in-out"
          >
            <Link href="/">하루단어</Link>
          </h1>
        </div>

        {/* 하단 메인 네비게이션 */}
        <div className="hidden md:block max-w-[1200px] mx-auto border-t border-gray-200 dark:border-[#333]">
          <nav className="flex items-center justify-center px-4 py-3 gap-8 text-sm font-bold tracking-wide">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-gray-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          {/* 이중 밑줄 */}
          <div className="md:max-w-[1200px] mx-auto border-b border-black dark:border-white w-full mb-[0.5px]"></div>
        </div>
      </header>

      {/* 스티키 헤더 */}
      <div
        className={`
          fixed top-0 left-0 w-full z-50 
          bg-white/95 dark:bg-[#121212]/95 backdrop-blur-sm 
          border-b border-gray-200 dark:border-[#333] shadow-md
          transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isScrolled ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* 왼쪽 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon.png" alt="하루단어 로고" className="w-7 h-7" />
            <span className="text-lg font-bold text-black dark:text-white">
              하루단어
            </span>
          </Link>

          {/* 중앙: 네비게이션 (데스크탑) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-black dark:text-white hover:text-gray-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 오른쪽: 유저 메뉴 & 햄버거 */}
          <div className="flex items-center gap-4">
            {/* 데스크탑 유저 정보 */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/mypage"
                    className="text-xs font-bold border border-black dark:border-white px-3 py-1 rounded-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    마이페이지
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-bold px-3 py-1 rounded-sm hover:underline text-black dark:text-white transition-all"
                >
                  로그인
                </Link>
              )}
            </div>

            {/* 모바일 햄버거 버튼 */}
            <button
              className="md:hidden p-1"
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
        </div>
      </div>

      {/* 모바일 슬라이드 메뉴 */}
      {/* 배경 오버레이 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 슬라이드 패널 */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-white dark:bg-[#1E1E1E] z-70 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* 닫기 버튼 */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-xl tracking-tight">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors"
            >
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

          {/* 메뉴 컨텐츠 영역 (flex-1로 꽉 채움) */}
          <div className="flex-1 flex flex-col h-full">
            {user ? (
              <>
                {/* 1. 프로필 영역 (클릭 시 마이페이지 이동) */}
                <Link
                  href="/mypage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group"
                >
                  <div className="flex items-center gap-4 py-3 px-2 -mx-2 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded-xl transition-colors cursor-pointer">
                    {user.user_metadata.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="profile"
                        className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 group-hover:border-gray-400 transition-colors"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-900 dark:text-white group-hover:underline underline-offset-4 decoration-2">
                        {user.user_metadata.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {/* 화살표 아이콘 */}
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </div>
                </Link>

                {/* 구분선 */}
                <div className="border-t border-gray-100 dark:border-[#333] my-6"></div>

                {/* 2. 메인 메뉴 그룹 (탐색) */}
                <div className="flex flex-col gap-1">
                  <p className="px-2 text-xs font-bold text-gray-400 mb-2">
                    탐색
                  </p>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 px-4 text-[16px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center gap-3"
                  >
                    <span>📅</span> 오늘의 단어
                  </Link>
                  <Link
                    href="/words"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 px-4 text-[16px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center gap-3"
                  >
                    <span>🔍</span> 전체 단어
                  </Link>
                </div>

                {/* 구분선 */}
                <div className="border-t border-gray-100 dark:border-[#333] my-4"></div>

                {/* 3. 개인 메뉴 그룹 (활동) */}
                <div className="flex flex-col gap-1">
                  <p className="px-2 text-xs font-bold text-gray-400 mb-2">
                    내 활동
                  </p>
                  <Link
                    href="/wordbook"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 px-4 text-[16px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center gap-3"
                  >
                    <span>📚</span> 내 단어장
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 px-4 text-[16px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center gap-3"
                  >
                    <span>💡</span> 서비스 소개
                  </Link>
                </div>

                {/* 4. 로그아웃 (맨 아래로 밀어내기) */}
                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-[#333]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 py-3 px-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-[#3A1E1E] rounded-lg transition-colors text-sm font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              // 비로그인 상태
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-1">
                  <p className="px-2 text-xs font-bold text-gray-400 mb-2">
                    탐색
                  </p>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 px-4 text-[16px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center gap-3"
                  >
                    <span>📅</span> 오늘의 단어
                  </Link>
                  <Link
                    href="/words"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 px-4 text-[16px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center gap-3"
                  >
                    <span>🔍</span> 전체 단어
                  </Link>
                </div>

                <div className="mt-auto bg-gray-50 dark:bg-[#2A2A2A] p-6 rounded-xl text-center mb-6">
                  <p className="text-gray-500 text-sm mb-4">
                    로그인하고 나만의 단어장을
                    <br />
                    만들어보세요.
                  </p>
                  <div className="flex justify-center">
                    <LoginButton text="Google 계정으로 로그인" />
                  </div>
                </div>
              </div>
            )}

            {/* 날짜 표시 (맨 아래) */}
            <div className="text-center text-[10px] text-gray-300 dark:text-gray-600 mt-4">
              {todayFormatted}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

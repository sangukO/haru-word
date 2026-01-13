"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 마운트 후 렌더링 (Hydration 에러 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // 로딩 시 빈 공간 유지
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center rounded-full cursor-pointer outline-none"
      aria-label="테마 변경"
    >
      {theme === "dark" ? (
        // 해 아이콘 (Light Mode)
        <Sun
          key="sun"
          size={20}
          className="text-black dark:text-white hover:text-orange-500 hover:fill-orange-500"
        />
      ) : (
        // 달 아이콘 (Dark Mode)
        <Moon
          key="moon"
          size={20}
          className="text-black dark:text-white hover:text-yellow-400 hover:fill-yellow-400"
        />
      )}
    </button>
  );
}

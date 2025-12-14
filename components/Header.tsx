import Link from "next/link";
import HitCounter from "@/components/HitCounter";
import LoginButton from "./LoginButton";

interface HeaderProps {
  todayFormatted: string;
  initialView: number;
}

export default function Header({ todayFormatted, initialView }: HeaderProps) {
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
          <LoginButton text="로그인" className="px-3 text-sm font-medium" />
        </div>
      </div>
    </header>
  );
}

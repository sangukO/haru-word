import LoginButton from "./LoginButton";
import { User } from "@supabase/supabase-js";

interface PageLoginSectionProps {
  user: User | null;
}

export default function PageLoginSection({ user }: PageLoginSectionProps) {
  // 로그인 되어 있다면 빈 화면 반환
  if (user) return <div className="mt-8 mb-12 h-[68px]"></div>;

  // 로그인이 안 되어 있다면 로그인 버튼 표시
  return (
    <div className="mt-8 mb-12 flex flex-col items-center gap-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        로그인하고 나만의 단어장을 만들어보세요
      </p>
      <LoginButton text="Google 계정으로 로그인" />
    </div>
  );
}

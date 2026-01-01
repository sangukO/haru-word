"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    toast("로그아웃 되었습니다.", {
      description: "다음에 또 만나요! 👋",
    });

    router.refresh();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors text-sm"
    >
      로그아웃
    </button>
  );
}

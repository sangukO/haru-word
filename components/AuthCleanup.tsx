"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function AuthCleanup() {
  const isToastShown = useRef(false);
  const supabase = createClient();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAuthCheck = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;

      // 로그인 성공
      if (searchParams.get("login") === "success") {
        if (isToastShown.current) return; // 중복 방지
        isToastShown.current = true;

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const userName =
            user.user_metadata.full_name || user.user_metadata.name || "사용자";

          // 토스트 메시지
          toast.success(`반갑습니다, ${userName}님!`, {
            description: "오늘도 하루 단어를 채워보세요.",
            icon: "👋",
          });
        }

        // URL 정리
        searchParams.delete("login");
        const newUrl =
          window.location.pathname +
          (searchParams.toString() ? `?${searchParams.toString()}` : "") +
          hash;

        window.history.replaceState(null, "", newUrl);
      }

      // 로그인 취소 처리 (access_denied)
      if (hash.includes("error=access_denied")) {
        const cleanUrl = window.location.pathname + window.location.search;
        window.history.replaceState(null, "", cleanUrl);
      }
    };

    handleAuthCheck();
  }, [supabase]);

  return null;
}

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createClient();

  useEffect(() => {
    // 현재 로그인 상태 확인
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        // 에러 발생 시 유저를 null로 설정
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // 실시간 상태 변경 감지 (로그인/로그아웃/토큰갱신)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => subscription.unsubscribe();
  }, []);
  return { user, loading };
}

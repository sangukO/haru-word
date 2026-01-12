"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTodayDate } from "@/utils/date";

export default function AttendanceChecker({ user }: { user: User | null }) {
  const router = useRouter();
  const checkAttendance = useCallback(async () => {
    // 유저가 없으면 중단
    if (!user) return;
    const today = getTodayDate(); // 한국 시간 오늘 날짜
    const lastCheckKey = `haruword_last_visit_${user.id}`;
    const lastVisit = localStorage.getItem(lastCheckKey);

    // 로컬 스토리지 확인 후 오늘 이미 기록했다면 서버 요청 안 함
    if (lastVisit === today) {
      return;
    }

    // 서버에 출석 요청
    const supabase = createClient();
    const { error } = await supabase.from("user_daily_visits").upsert(
      {
        user_id: user.id,
        visit_date: today,
      },
      { onConflict: "user_id, visit_date" } // 이미 있으면 무시
    );

    if (error) {
      console.error("출석 체크 실패:", error);
    } else {
      // 성공 시 로컬 스토리지 업데이트
      localStorage.setItem(lastCheckKey, today);

      toast.success("새로운 하루가 시작되었습니다! 출석 완료 ✅");

      router.refresh();
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    // 마운트 시 즉시 실행
    checkAttendance();

    // 1분마다 실행 (자정 감지)
    const intervalId = setInterval(checkAttendance, 60 * 1000);

    // 탭이 다시 활성화될 때 실행
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAttendance();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 정리
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, checkAttendance]);

  return null;
}

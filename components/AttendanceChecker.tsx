"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function AttendanceChecker({ user }: { user: User | null }) {
  useEffect(() => {
    // 유저가 없으면 중단
    if (!user) return;

    const checkAttendance = async () => {
      const today = new Date().toISOString().split("T")[0]; // "2024-01-11" (KST 기준 처리가 필요하면 수정 가능)
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
      }
    };

    checkAttendance();
  }, [user]);

  return null;
}

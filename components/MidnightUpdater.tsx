"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MidnightUpdater() {
  const router = useRouter();

  useEffect(() => {
    // 다음 자정까지 남은 시간 계산 함수
    const calculateTimeToMidnight = () => {
      const now = new Date();

      // 현재 시간을 KST로 변환 뒤 다시 Date 객체로 생성
      const kstString = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
      const kstNow = new Date(kstString);

      // 자정 설정
      const midnight = new Date(kstNow);
      midnight.setHours(24, 0, 0, 0);

      // 자정까지 남은 시간 반환
      return midnight.getTime() - kstNow.getTime();
    };

    const msUntilMidnight = calculateTimeToMidnight();

    const timer = setTimeout(() => {
      // 페이지 새로고침 없이 데이터만 갱신 (Soft Refresh)
      router.refresh();
    }, msUntilMidnight + 1000); // 1초 여유

    // 타이머 해제
    return () => clearTimeout(timer);
  }, [router]);

  return null;
}

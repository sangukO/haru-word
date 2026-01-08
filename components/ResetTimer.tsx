"use client";

import { useEffect, useState } from "react";

export default function ResetTimer({ className }: { className?: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // 내일 00:00:00

      const diff = midnight.getTime() - now.getTime();

      // 자정이 지났거나 에러일 경우
      if (diff <= 0) {
        setTimeLeft("초기화 진행 중");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const format = (num: number) => String(num).padStart(2, "0");

      // 원하는 포맷으로 변경 가능
      setTimeLeft(`${format(h)}:${format(m)}:${format(s)}`);
    };

    updateTimer(); // 초기 실행
    const timer = setInterval(updateTimer, 1000); // 1초마다 갱신

    return () => clearInterval(timer);
  }, []);

  // 서버 사이드 렌더링 불일치 방지를 위해 값이 없으면 렌더링 안 함
  if (!timeLeft) return null;

  return <span className={className}>{timeLeft}</span>;
}

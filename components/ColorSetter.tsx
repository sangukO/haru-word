"use client";

import { useEffect } from "react";

export default function NeonColorSetter({ color }: { color: string }) {
  useEffect(() => {
    if (!color) return;

    // 문서 전체에 CSS 변수 주입
    document.documentElement.style.setProperty("--neon-color", color);

    // 언마운트 시 제거
    return () => {
      document.documentElement.style.removeProperty("--neon-color");
    };
  }, [color]);

  return null;
}

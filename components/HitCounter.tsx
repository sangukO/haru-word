"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface Props {
  initialView: number;
}

export default function HitCounter({ initialView }: Props) {
  const [views, setViews] = useState<number>(initialView);

  useEffect(() => {
    const increment = async () => {
      // 방문자 수 +1 (RPC 함수 호출)
      if (process.env.NODE_ENV === "production") {
        await supabase.rpc("increment_views");
      } else {
        // 로컬 테스트
        // await supabase.rpc("increment_views");
      }

      // 미리 1 증가한 값을 보여줌 (낙관적 업데이트)
      setViews((prev) => prev + 1);
    };

    increment();
  }, []);

  return (
    <span className="ml-2 text-[10px] text-sub">
      Total Visits: {views.toLocaleString()}
    </span>
  );
}

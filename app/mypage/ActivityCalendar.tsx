"use client";

import { ActivityCalendar as AC } from "react-activity-calendar";
import type { ThemeInput, Activity } from "react-activity-calendar";
import { Tooltip } from "react-tooltip";
import { useTheme } from "next-themes";
import React, { useEffect, useState, useMemo } from "react";
import { SERVICE_START_DATE } from "@/constants/service";
import Select from "@/components/ui/Select";

interface ActivityData {
  date: string;
  count: number;
  level: number;
}

interface ActivityCalendarProps {
  data: ActivityData[];
}

export default function ActivityCalendar({ data }: ActivityCalendarProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  const startYear = useMemo(() => {
    const serviceStartYear = new Date(SERVICE_START_DATE).getFullYear();

    if (data.length === 0) return serviceStartYear;

    // 데이터에서 연도만 추출해서 최솟값 찾기
    const dataYears = data.map((item) => new Date(item.date).getFullYear());
    const minDataYear = Math.min(...dataYears);

    // 데이터에 오류가 있어서 미래 날짜가 있을 수 있으니 min 비교
    return Math.min(minDataYear, serviceStartYear);
  }, [data]);

  // 선택된 연도 상태 관리
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    setMounted(true);
    setSelectedYear(currentYear);
  }, [currentYear]);

  // 연도 옵션 리스트 생성 (2026 ~ 현재 연도)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = startYear; y <= currentYear; y++) {
      years.push(y);
    }
    return years.sort((a, b) => b - a); // 최신순 정렬
  }, [startYear, currentYear]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 총 학습 점수 계산
  const totalCount = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  const purpleTheme: ThemeInput = {
    light: ["#EFF2F5", "#d8b4fe", "#c084fc", "#a855f7", "#7e22ce"],
    dark: ["#252525", "#4a0f77", "#581c87", "#7e22ce", "#d8b4fe"],
  };

  if (!mounted) return null;

  return (
    <>
      <div className="w-full flex justify-between items-end mb-2">
        <div className="flex gap-1 justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-bold">
            2026년도 총 {totalCount}회 활동
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-info-icon lucide-info text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-help outline-none"
            data-tooltip-id="react-tooltip"
            data-tooltip-content="매일 출석과 AI 예문 생성 횟수가 합산된 총 활동 횟수입니다."
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <div>
          <Select
            label="Year:"
            value={selectedYear}
            options={yearOptions}
            onChange={setSelectedYear}
          />
        </div>
      </div>
      <div className="w-full flex flex-col items-center p-6 border border-gray-200 dark:border-[#333] rounded-xl bg-white dark:bg-[#1E1E1E]">
        <AC
          data={data}
          theme={purpleTheme}
          colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
          blockSize={12}
          blockMargin={4}
          fontSize={12}
          showWeekdayLabels
          labels={{
            months: [
              "1월",
              "2월",
              "3월",
              "4월",
              "5월",
              "6월",
              "7월",
              "8월",
              "9월",
              "10월",
              "11월",
              "12월",
            ],
            weekdays: ["일", "월", "화", "수", "목", "금", "토"],
            legend: {
              less: "적음",
              more: "많음",
            },
          }}
          // div 대신 cloneElement 사용
          renderBlock={(block: React.ReactElement, activity: Activity) => {
            return React.cloneElement(block, {
              "data-tooltip-id": "react-tooltip",
              "data-tooltip-content": `${activity.date}: ${activity.count}회 학습`,
            } as any);
          }}
        />
        <Tooltip
          id="react-tooltip"
          className="bg-black! px-2! py-1! rounded! text-xs! z-50!"
        />
      </div>
    </>
  );
}

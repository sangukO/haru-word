"use client";

import { ActivityCalendar as AC } from "react-activity-calendar";
import type { ThemeInput, Activity } from "react-activity-calendar";
import { Tooltip } from "react-tooltip";
import React, { useEffect, useState, useMemo } from "react";
import { SERVICE_START_DATE } from "@/constants/service";
import Select from "@/components/ui/Select";
import { Info, X } from "lucide-react";
import SentenceHistoryList from "@/components/ai/SentenceHistoryList";
import {
  getLocalDateFromISO,
  getFormattedKoreanMonthDay,
  getFormattedKoreanDate,
} from "@/utils/date";
import Modal from "@/components/ui/Modal";

type WordInfo = {
  id: number;
  word: string;
  meaning: string;
  categories?: { color: string }[] | null;
};

type Log = {
  id: number;
  created_at: string;
  generated_sentence: string | null;
  target_word_ids: number[] | null;
  status: string;
  user_id: string;
};

interface ActivityData {
  date: string;
  count: number;
  level: number;
}

interface ActivityCalendarProps {
  data: ActivityData[];
  logs: Log[];
  words: WordInfo[];
}

export default function ActivityCalendar({
  data,
  logs,
  words,
}: ActivityCalendarProps) {
  const [mounted, setMounted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const cssTheme: ThemeInput = {
    light: [
      "var(--grass-l0)",
      "var(--grass-l1)",
      "var(--grass-l2)",
      "var(--grass-l3)",
      "var(--grass-l4)",
    ],
    dark: [
      "var(--grass-l0)",
      "var(--grass-l1)",
      "var(--grass-l2)",
      "var(--grass-l3)",
      "var(--grass-l4)",
    ],
  };

  // 날짜 클릭 핸들러
  const handleBlockClick = (date: string, count: number) => {
    if (count > 0) {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  // 선택된 날짜의 로그 필터링
  const filteredLogs = useMemo(() => {
    if (!selectedDate) return [];

    return logs.filter((log) => {
      return getLocalDateFromISO(log.created_at) === selectedDate;
    });
  }, [selectedDate, logs]);

  if (!mounted) return null;

  return (
    <>
      <div className="w-full flex justify-between items-end mb-2">
        <div className="flex gap-1 justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-bold">
            2026년도 총 {totalCount}회 활동
          </span>
          <Info
            className="w-4.5 h-4.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-help outline-none"
            data-tooltip-id="react-tooltip"
            data-tooltip-content={`총 활동 = 출석 + 예문 생성 횟수\n클릭 시 그날 만든 예문을 볼 수 있어요.`}
          />
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
          theme={cssTheme}
          colorScheme="light"
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
          renderBlock={(
            block: React.ReactElement<{ style?: React.CSSProperties }>,
            activity: Activity
          ) => {
            const isClickable = activity.count >= 0;

            const dateText = getFormattedKoreanMonthDay(activity.date);

            return React.cloneElement(block, {
              "data-tooltip-id": "react-tooltip",
              "data-tooltip-content": `${dateText}: ${activity.count}회 학습`,
              style: {
                ...block.props.style,
                outline: "none",
                cursor: isClickable ? "pointer" : "default",
              },
              onClick: () => {
                if (isClickable) {
                  handleBlockClick(activity.date, activity.count);
                }
              },
            } as any);
          }}
        />
        <Tooltip
          id="react-tooltip"
          className="bg-black! px-2! py-1! rounded! text-xs! z-50! whitespace-pre-wrap!"
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${getFormattedKoreanDate(selectedDate || "")} 기록`}
      >
        <div className="flex flex-col h-full gap-4">
          {/* 리스트 컴포넌트 */}
          <SentenceHistoryList
            logs={filteredLogs}
            words={words}
            emptyMessage="이 날은 출석만 하고 예문은 안 만들었네요!"
          />
        </div>
      </Modal>
    </>
  );
}

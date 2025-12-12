// 캐나다 표준 형식(YYYY-MM-DD)으로 한국 시간을 가져옴
export const getTodayDate = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Seoul",
  });
};

// 'YYYY.MM.DD' 형식으로 반환
export const getFormattedDate = () => {
  const date = getTodayDate();
  return date.replaceAll("-", ".");
};

// 날짜 더하거나 빼기
export const offsetDate = (dateStr: string, days: number) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

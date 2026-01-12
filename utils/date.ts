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

export const getFormattedKoreanMonthDay = (dateStr: string) => {
  if (!dateStr) return "";
  const [_, m, d] = dateStr.split("-");
  return `${Number(m)}월 ${Number(d)}일`;
};

// 'YYYY년 MM월 DD일' 형식으로 변환
export const getFormattedKoreanDate = (dateStr: string) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${y}년 ${m}월 ${d}일`;
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

// UTC ISO 문자열을 로컬 날짜 문자열로 변환
export const getLocalDateFromISO = (isoString: string) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-CA");
};

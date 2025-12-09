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

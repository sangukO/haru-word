export type Category = {
  id: string;
  name: string;
  color: string;
  sort_order: number;
};

export type Word = {
  id: number;
  word: string;
  meaning: string;
  date: string;

  // 상세 페이지용 선택적 필드
  hanja?: string;
  example?: string;
  refined_word?: string;
  detail?: string;

  // 쿼리에서 가져올 때 별칭에 따라 이름이 다름
  // 상세 페이지: category
  // 목록 페이지: categories
  category?: Category | null;
  categories?: Category | null;
};

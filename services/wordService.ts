import { SupabaseClient } from "@supabase/supabase-js";
import { getTodayDate } from "@/utils/date";

// ID로 단어 가져오기 (상세 페이지용)
export async function getWordById(supabase: SupabaseClient, id: string) {
  return await supabase
    .from("words")
    .select(`*, category: categories (name, color)`)
    .eq("id", id)
    .single();
}

// 날짜로 단어 가져오기 (메인 페이지용)
export async function getWordByDate(supabase: SupabaseClient, date: string) {
  return await supabase
    .from("words")
    .select(`*, category: categories (name, color)`)
    .eq("date", date)
    .single();
}

// 가장 최신 단어 가져오기 (오류 시 대체용)
export async function getLatestWord(supabase: SupabaseClient) {
  return await supabase
    .from("words")
    .select("id, date")
    .order("date", { ascending: false })
    .limit(1)
    .single();
}

// 이전 글 가져오기 (공통)
export async function getPrevWord(
  supabase: SupabaseClient,
  currentDate: string
) {
  return await supabase
    .from("words")
    .select("id, date")
    .lt("date", currentDate)
    .order("date", { ascending: false })
    .limit(1)
    .single();
}

// 다음 글 가져오기 (공통)
export async function getNextWord(
  supabase: SupabaseClient,
  currentDate: string
) {
  const today = getTodayDate();
  return await supabase
    .from("words")
    .select("id, date")
    .gt("date", currentDate)
    .lte("date", today) // 미래 단어 방지
    .order("date", { ascending: true })
    .limit(1)
    .single();
}

import { createClient } from "@/utils/supabase/server";
import AdminDashboard from "./components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  // 단어 목록 가져오기
  const { data: words, error: wordsError } = await supabase
    .from("words")
    .select("*, categories(*)") // 카테고리 정보도 조인해서 가져옴
    .order("date", { ascending: false });

  // 카테고리 목록 가져오기
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-8 pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🛠️ 단어 관리
        </h1>
      </div>

      <AdminDashboard
        initialWords={words || []}
        categories={categories || []}
      />
    </div>
  );
}

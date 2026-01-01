import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { getCategories } from "@/services/wordService";
import WordsList from "@/components/WordList";

export default async function WordsPage() {
  const supabase = await createClient();

  const { data: categories } = await getCategories(supabase);

  return (
    <Suspense>
      <WordsList initialCategories={categories || []} />
    </Suspense>
  );
}

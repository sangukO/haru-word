"use server";

import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";
import { AI_DAILY_LIMIT, AI_LIMIT_MESSAGE } from "@/constants/service";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type TargetWord = {
  id: number;
  word: string;
  meaning: string;
};

type AIResponse = {
  success: boolean;
  message?: string;
  data?: string;
};

export async function generateSentencesWithAI(
  words: TargetWord[]
): Promise<AIResponse> {
  const supabase = await createClient();

  // 유저 인증
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "로그인이 필요한 기능입니다." };
  }

  // 오늘 사용량 체크
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("ai_usage_logs")
    .select("*", { count: "exact", head: true }) // 데이터 제외, count만 가져옴
    .eq("user_id", user.id)
    .gte("created_at", todayStart.toISOString());

  if (error) {
    console.error("사용량 조회 에러:", error);
    return {
      success: false,
      message: "사용량을 확인하는 중 오류가 발생했습니다.",
    };
  }

  // 제한 횟수 초과 시 차단
  if (count !== null && count >= AI_DAILY_LIMIT) {
    return {
      success: false,
      message: AI_LIMIT_MESSAGE,
    };
  }

  // 로그 데이터 성공/실패/에러 메시지 변수
  let status = "SUCCESS";
  let errorMessage = null;
  let generatedText = "";

  try {
    const wordListString = words
      .map((w) => `"${w.word}(${w.meaning})"`)
      .join(", ");
    const prompt = `
      다음 단어들을 모두 포함하여 자연스러운 한국어 문장 1개를 만들어줘.
      각 단어의 뜻(괄호 안의 내용)을 고려해서 문맥에 맞게 써야 해.
      
      단어 목록: [${wordListString}]
      
      조건:
      1. 문장은 150자 이내.
      2. 이모지 사용 금지.
      3. 결과에는 괄호 안의 뜻을 적지 말고, '단어'만 자연스럽게 포함할 것.
      4. 따옴표 없이 문장 내용만 반환할 것.
    `;

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    generatedText = completion.choices[0].message.content || "";

    if (!generatedText) {
      throw new Error("AI 응답이 비어있습니다.");
    }

    return { success: true, data: generatedText };
  } catch (err: any) {
    console.error("OpenAI API 호출 에러:", err);

    // 에러 발생 시 상태 변경
    status = "FAILURE";
    errorMessage = err.message || "알 수 없는 에러";

    return {
      success: false,
      message: "AI 예문 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
    };
  } finally {
    // 성공/실패 여부와 관계 없이 무조건 로그 저장
    await supabase.from("ai_usage_logs").insert({
      user_id: user.id,
      feature_name: "sentence-generation",
      target_word_ids: words.map((w) => w.id),
      generated_sentence: status === "SUCCESS" ? generatedText : null, // 실패 시 문장 없음
      status: status,
      error_message: errorMessage,
    });
  }
}

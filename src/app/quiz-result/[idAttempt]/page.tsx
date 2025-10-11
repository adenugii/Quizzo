import { cookies } from "next/headers";
import QuizResultPageClient from "@/components/quiz-result/QuizResultPageClient";
import { getDetailAttempt } from "@/services/quizservices";

export default async function QuizResultAttemptPage({ params }: { params: { idAttempt: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  let resultData = null;
  let error = null;
  try {
    resultData = await getDetailAttempt(params.idAttempt, token);
  } catch (e) {
    error = (e instanceof Error) ? e.message : "menunggu hasil quiz";
  }
  return <QuizResultPageClient resultData={resultData} error={error} />;
}

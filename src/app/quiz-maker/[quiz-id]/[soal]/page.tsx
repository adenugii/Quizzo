import { cookies } from "next/headers";
import QuizSoalClient from "@/components/quiz/QuizSoalClient";

export default async function QuizSoalPage({ params }: { params: Promise<{ "quiz-id": string; soal: string }> }) {
  const { "quiz-id": quizId, soal } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  return <QuizSoalClient quizId={quizId} soalId={soal} token={token} />;
}
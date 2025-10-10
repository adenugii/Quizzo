import QuizSoalClient from "@/components/quiz/QuizSoalClient";
import { cookies } from "next/headers";

export default async function QuizSoalPageServer({ params }: { params: { "quiz-id": string; soal: string } }) {
  const cookieStore = cookies();
  const token = typeof (await cookieStore).get === "function" ? (await cookieStore).get("token")?.value || "" : "";
  const quizId = params["quiz-id"];
  const soalId = params["soal"];
  return <QuizSoalClient quizId={quizId} soalId={soalId} token={token} />;
}
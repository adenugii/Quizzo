import QuizDetailSection from "@/components/quiz-detail/QuizDetailSection";
import { cookies } from "next/headers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getQuizById } from "@/services/quizservices";

export default async function QuizDetailPage({ params }: { params: { "quiz-id": string } }) {
  const quizId = params["quiz-id"];
  const cookieStore = cookies();
  const token = typeof (await cookieStore).get === "function" ? (await cookieStore).get("token")?.value || "" : "";
  let quiz = null;
  let error = null;
  try {
    quiz = await getQuizById(token, quizId);
    if (!quiz) {
      error = "Quiz not found or API response invalid";
      console.error(error, { token, quizId });
    } else {
      console.log("Quiz detail fetched:", quiz);
    }
  } catch (e) {
    if (e instanceof Error) {
      error = e.message;
    } else {
      error = "Unknown error";
    }
    console.error("Fetch quiz error:", error);
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        {!quiz && !error && (
          <div className="text-center py-12 text-[#2563eb] font-semibold text-lg animate-pulse">Loading quiz...</div>
        )}
        {quiz && <QuizDetailSection quiz={quiz} />}
        {error && (
          <div className="text-center py-12 text-red-500 font-semibold text-lg">{error}</div>
        )}
      </main>
      <Footer />
    </div>
  );
}

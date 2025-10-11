"use client";
import QuizResultPageSection from "@/components/quiz-result/QuizResultPageSection";
import Footer from "@/components/common/Footer";
import Link from "next/link";

interface QuizResultQuestion {
  id: string;
  question_text: string;
  my_answer: string;
  correct_answer: string;
  choices?: string[];
  explanation: string;
}

interface QuizResultType {
  title: string;
  total_correct: number;
  total_questions: number;
  time_limit?: number;
  timer_left?: number;
  questions: QuizResultQuestion[];
}

export default function QuizResultPageClient({ resultData, error }: { resultData: QuizResultType | null; error?: string | null }) {
  if (error) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full flex flex-col items-center">
          <div className="text-2xl font-bold text-red-500 mb-4">{error}</div>
          <Link href="/" className="text-[#2563eb] underline">Kembali ke Beranda</Link>
        </div>
        <Footer />
      </div>
    );
  }
  if (!resultData) {
    return <div className="text-center mt-10 text-[#2563eb]">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
        <QuizResultPageSection result={resultData} />
      </main>
      <Footer />
    </div>
  );
}

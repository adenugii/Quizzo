"use client";
import QuizResultPageSection from "@/components/quiz-result/QuizResultPageSection";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
      <main className="max-w-6xl mx-auto px-0 py-8 flex-1 flex">
        <div className="flex-1">
          <QuizResultPageSection result={resultData} />
        
        </div>
        {/* Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0 flex flex-col">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center mb-4">
            <div className="text-yellow-500 text-2xl mb-2">🏆</div>
            <div className="font-bold text-lg mb-1 text-center">Achievement Unlocked!</div>
            <div className="font-semibold text-base mb-1 text-center">Sharpshooter</div>
            <div className="text-gray-600 text-sm text-center mb-2">Jawab 15+ soal dengan benar dalam satu quiz</div>
            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold mb-2">+100 Bonus XP</div>
          </div>
          <button
            className="w-full py-3 rounded-lg bg-[#2563eb] text-white font-semibold text-base shadow hover:bg-[#1e40af] transition mb-2"
            onClick={() => router.push("/history")}
          >
            Kembali ke Dashboard
          </button>
          <button
            className="w-full py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold text-base shadow hover:bg-gray-200 transition"
            onClick={() => alert("Fitur coming soon")}
          >
            Bagikan Hasil
          </button>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

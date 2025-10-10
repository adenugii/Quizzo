import Navbar from "@/components/common/Navbar";
import { cookies } from "next/headers";
import { getQuizAttempts, getQuizById } from "@/services/quizservices";

interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_questions: number;
  submitted_at: string;
  is_completed: boolean;
}

interface QuizMeta {
  [quizId: string]: {
    title?: string;
    difficulty?: string;
  };
}

async function QuizHistorySection() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value || "";
  let attempts: QuizAttempt[] = [];
  const quizMeta: QuizMeta = {};
  try {
    const res = await getQuizAttempts(token);
    attempts = res.attempts || [];
    // Ambil meta quiz untuk setiap quiz_id unik
    const uniqueQuizIds = [...new Set(attempts.map((a) => a.quiz_id))];
    for (const quizId of uniqueQuizIds) {
      const meta = await getQuizById(token, quizId);
      if (meta) quizMeta[quizId] = meta;
    }
  } catch {
    attempts = [];
  }
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {attempts.length === 0 && (
          <div className="text-gray-500 col-span-3">Belum ada riwayat quiz.</div>
        )}
        {(() => {
          // Filter hanya attempt dengan skor tertinggi untuk setiap quiz_id
          const bestAttempts: Record<string, QuizAttempt> = {};
          (attempts || []).forEach((a: QuizAttempt) => {
            if (!bestAttempts[a.quiz_id] || a.score > bestAttempts[a.quiz_id].score) {
              bestAttempts[a.quiz_id] = a;
            }
          });
          // Ambil 3 attempt terbaru dari bestAttempts
          const sorted = Object.values(bestAttempts).sort((a: QuizAttempt, b: QuizAttempt) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
          return sorted.slice(0, 10).map((q: QuizAttempt) => {
            const meta = quizMeta[q.quiz_id] || {};
            const percent = q.total_questions > 0 ? (q.score / q.total_questions) * 100 : 0;
            const lulus = percent >= 50;
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-2 min-h-[180px] relative"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 rounded-lg p-3">
                    {/* Icon */}
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#3b82f6" fillOpacity="0.1"/><path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" fill="#3b82f6"/></svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-base leading-tight">{meta.title || "Quiz"}</div>
                    <div className="text-gray-500 text-sm">Tingkat: {meta.difficulty || "-"}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold h-fit ${lulus ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>{lulus ? "Lulus" : "Tidak Lulus"}</span>
                </div>
                <div className="text-gray-400 text-xs mb-1">{new Date(q.submitted_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</div>
                <div className="font-bold text-lg mb-2 text-[#3b82f6]">{q.score}/{q.total_questions}</div>
                <button className={`w-full rounded-lg py-2 text-white font-semibold bg-[#3b82f6] mt-auto`}>
                  View Details
                </button>
              </div>
            );
          });
        })()}
      </div>
    </section>
  );
}

async function PerformanceOverviewSectionServer() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value || "";
  let attempts: QuizAttempt[] = [];
  try {
    const res = await getQuizAttempts(token);
    attempts = res.attempts || [];
  } catch {
    attempts = [];
  }
  // Total quiz unik
  const uniqueQuiz = new Set(attempts.map((a) => a.quiz_id));
  // Jumlah lulus
  const passed = attempts.filter((a) => a.total_questions > 0 && (a.score / a.total_questions) * 100 >= 50).length;
  // Rata-rata skor
  const avg = attempts.length > 0 ? Math.round(attempts.reduce((acc, a) => acc + (a.total_questions > 0 ? (a.score / a.total_questions) * 100 : 0), 0) / attempts.length) : 0;
  // Current streak dummy
  const streak = 1;
  const stats = [
    { icon: <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#6366f1" fillOpacity="0.1"/><path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" fill="#6366f1"/></svg>, value: uniqueQuiz.size, label: "Total Quizzes" },
    { icon: <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#22c55e" fillOpacity="0.1"/><path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, value: passed, label: "Lulus" },
    { icon: <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#a78bfa" fillOpacity="0.1"/><path d="M4 17l6-6 4 4 6-6" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, value: avg, label: "Average Score" },
    { icon: <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#f59e42" fillOpacity="0.1"/><path d="M12 8v4l3 3" stroke="#f59e42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, value: streak, label: "Current Streak" },
  ];
  return (
    <section className="mt-8">
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Performance Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <div>{s.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{s.value}</div>
              <div className="text-gray-500 text-sm text-center">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Quiz History
          </h1>
          <p className="text-gray-500 text-base">
            lacak perkembanganmu dan hasil dari quiz yang sudah kamu kerjakan
          </p>
        </div>
        <QuizHistorySection />
        <PerformanceOverviewSectionServer />
      </div>
    </div>
  );
}

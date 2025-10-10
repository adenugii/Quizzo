"use client";
import { useEffect, useState } from "react";
import { getQuizAttempts, getQuizById } from "@/services/quizservices";
import { FaCalculator } from "react-icons/fa6";

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

export default function QuizHistory({ token }: { token?: string })  {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [quizMeta, setQuizMeta] = useState<QuizMeta>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const tokenStr = token || "";
      let res: { attempts?: QuizAttempt[] } = {};
      try {
        res = await getQuizAttempts(tokenStr);
      } catch {
        res = { attempts: [] };
      }
      // Filter hanya attempt dengan skor tertinggi untuk setiap quiz_id
      const bestAttempts: Record<string, QuizAttempt> = {};
      (res.attempts || []).forEach((a: QuizAttempt) => {
        if (!bestAttempts[a.quiz_id] || a.score > bestAttempts[a.quiz_id].score) {
          bestAttempts[a.quiz_id] = a;
        }
      });
      // Ambil 3 attempt terbaru dari bestAttempts
      const sorted = Object.values(bestAttempts).sort((a: QuizAttempt, b: QuizAttempt) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
      setAttempts(sorted.slice(0, 3));
      // Fetch meta quiz
      const meta: QuizMeta = {};
      await Promise.all(sorted.slice(0, 3).map(async (a: QuizAttempt) => {
        if (!a.quiz_id || typeof a.quiz_id !== 'string') return;
        const quiz = await getQuizById(tokenStr, a.quiz_id);
        if (quiz) meta[a.quiz_id] = { title: quiz.title, difficulty: quiz.difficulty };
      }));
      setQuizMeta(meta);
      setLoading(false);
    }
    fetchHistory();
  }, [token]);

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-bold text-lg text-gray-900 mb-4">
        Quiz History
      </h3>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : attempts.length === 0 ? (
          <div className="text-gray-400">Belum ada riwayat quiz.</div>
        ) : attempts.map((a) => {
          const meta = quizMeta[a.quiz_id] || {};
          const percent = a.total_questions > 0 ? (a.score / a.total_questions) * 100 : 0;
          const lulus = percent >= 50;
          return (
            <div key={a.id} className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <FaCalculator className="text-blue-500 text-xl" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">
                  {meta.title || "Quiz"}
                </div>
                <div className="text-xs text-gray-400">{new Date(a.submitted_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`font-bold text-lg leading-none ${lulus ? "text-green-500" : "text-red-500"}`}>
                  {a.score}/{a.total_questions}
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  {lulus ? "Lulus" : "Tidak Lulus"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
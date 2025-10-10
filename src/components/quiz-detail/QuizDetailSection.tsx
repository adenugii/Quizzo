"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface QuizDetail {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time_limit?: { String: string; Valid: boolean };
  created_by: string;
  questions: { id: string; quiz_id: string; question_text: string; options: { id: string; content: string }[] }[];
  created_at: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDifficultyLabel(difficulty: string) {
  if (difficulty === "easy") return { text: "easy", color: "bg-green-100 text-green-600" };
  if (difficulty === "medium") return { text: "medium", color: "bg-yellow-100 text-yellow-700" };
  if (difficulty === "hard") return { text: "hard", color: "bg-red-100 text-red-600" };
  return { text: difficulty, color: "bg-gray-100 text-gray-600" };
}

export default function QuizDetailSection({ quiz }: { quiz: QuizDetail }) {
  const router = useRouter();
  useEffect(() => {
    if (!quiz) {
      console.log("[CLIENT COMPONENT] Quiz detail section: quiz is null or undefined");
    } else {
      console.log("[CLIENT COMPONENT] Quiz detail section: quiz data", quiz);
    }
  }, [quiz]);

  if (!quiz) {
    return <div className="text-center py-12 text-[#2563eb] font-semibold text-lg">Quiz tidak ditemukan.</div>;
  }
  const diff = getDifficultyLabel(quiz.difficulty);
  const firstQuestionId = quiz.questions && quiz.questions.length > 0 ? quiz.questions[0].id : null;
  const handleStartQuiz = () => {
    if (firstQuestionId) {
      router.push(`/quiz-maker/${quiz.id}/${firstQuestionId}`);
    }
  };
  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1">
          <h2 className="font-bold text-xl text-gray-900 mb-1">{quiz.title}</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${diff.color}`}>{diff.text}</span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-[#f8fafc] rounded-lg p-3 flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Jumlah Soal</div>
          <div className="font-bold text-lg text-[#2563eb]">{quiz.questions ? quiz.questions.length : 0} Soal</div>
        </div>
        <div className="bg-[#f8fafc] rounded-lg p-3 flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Estimasi Waktu</div>
          <div className="font-bold text-lg text-[#2563eb]">{quiz.time_limit?.String ? quiz.time_limit.String + " Menit" : "30 Menit"}</div>
        </div>
        <div className="bg-[#f8fafc] rounded-lg p-3 flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Tanggal</div>
          <div className="font-bold text-lg text-[#2563eb]">{formatDate(quiz.created_at)}</div>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-1">Deskripsi Quiz</div>
        <div className="text-gray-700 text-sm">{quiz.description}</div>
      </div>
      <div className="mb-4">
        {/* <div className="font-semibold mb-1">Topik yang Dibahas</div> */}
        {/* <div className="flex gap-2 flex-wrap">
          {(quiz.topics || ["Aljabar", "Fungsi Linear", "Persamaan Kuadrat", "Sistem Persamaan"]).map((topic: string, idx: number) => (
            <span key={idx} className="bg-blue-100 text-[#2563eb] px-3 py-1 rounded-lg text-xs font-semibold">{topic}</span>
          ))}
        </div> */}
      </div>
      <div className="flex gap-3 mb-6">
        <button className="bg-[#2563eb] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#174bbd] transition flex-1 flex items-center justify-center gap-2" onClick={handleStartQuiz}>
          Mulai Quiz
        </button>
        <button className="bg-gray-100 text-gray-700 font-semibold px-6 py-2 rounded-lg shadow flex-1">&larr; Kembali</button>
        <button className="bg-gray-100 text-gray-700 font-semibold px-6 py-2 rounded-lg shadow flex-1">Lihat Materi</button>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-2">
        <div className="font-bold text-yellow-700 mb-2 flex items-center gap-2">
          <span className="material-icons text-yellow-400">lightbulb</span> Tips Pengerjaan
        </div>
        <ul className="text-sm text-yellow-700 list-disc pl-5">
          <li>Baca setiap soal dengan teliti sebelum menjawab</li>
          <li>Gunakan waktu dengan bijak, jangan terlalu lama di satu soal</li>
          <li>Periksa kembali jawaban sebelum submit</li>
          <li>Pastikan koneksi internet stabil selama mengerjakan</li>
        </ul>
      </div>
    </section>
  );
}

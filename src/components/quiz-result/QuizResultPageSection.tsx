import { useState } from "react";

interface QuizResultQuestion {
  id: string;
  question_text: string;
  my_answer: string;
  correct_answer: string;
  explanation: string;
}

interface QuizResultPageSectionProps {
  result: {
    title: string;
    total_correct: number;
    total_questions: number;
    time_limit?: number;
    timer_left?: number; // detik
    questions: QuizResultQuestion[];
  };
}

export default function QuizResultPageSection({ result }: QuizResultPageSectionProps) {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPage = Math.ceil(result.questions.length / perPage);
  const startIdx = (page - 1) * perPage;
  const endIdx = startIdx + perPage;
  const questions = result.questions.slice(startIdx, endIdx);

  // Nilai
  const benar = result.total_correct;
  const total = result.total_questions;
  const salah = total - benar;
  const akurasi = Math.round((benar / total) * 100);
  const xp = benar;
  // Waktu pengerjaan
  let waktu = 15; // default 15 menit
  if (result.time_limit && result.timer_left !== undefined) {
    waktu = Math.round((result.time_limit - result.timer_left) / 60);
    if (waktu < 1) waktu = 1;
  } else if (result.time_limit) {
    waktu = Math.round(result.time_limit / 60);
  }

  return (
    <div className="w-full flex flex-col md:flex-row">
      {/* Main Section */}
      <div className="flex-1 flex flex-col gap-0">
        {/* Judul & Checklist */}
        <div className="flex flex-col items-center mb-2">
          <div className="text-green-500 text-5xl mb-2">
            <svg width="48" height="48" fill="none"><circle cx="24" cy="24" r="24" fill="#D1FAE5"/><path d="M16 24l6 6 10-10" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 className="font-bold text-2xl text-gray-900 mb-1">Quiz Selesai!</h2>
          <div className="text-gray-500 text-base mb-4">Berikut adalah hasil quiz Anda</div>
        </div>
        {/* Nilai */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center mb-2">
          <div className="text-4xl font-bold text-[#2563eb] mb-2">{benar} / {total}</div>
          <div className="flex gap-6 mb-2">
            <span className="text-green-600 font-bold">{benar} Benar</span>
            <span className="text-red-500 font-bold">{salah} Salah</span>
            <span className="text-[#2563eb] font-bold">{akurasi}% Akurasi</span>
          </div>
          <div className="flex gap-6 text-base">
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">+{xp} XP</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">{waktu} menit</span>
          </div>
        </div>
        {/* Pembahasan Soal */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg text-gray-900 mb-4">Pembahasan Soal</div>
          <div className="flex flex-col gap-4">
            {questions.map((q, idx) => {
              let color = "bg-yellow-50 border-yellow-200";
              let label = "Tidak Dijawab";
              if (q.my_answer && q.my_answer === q.correct_answer) {
                color = "bg-green-50 border-green-200";
                label = "Benar";
              } else if (q.my_answer && q.my_answer !== q.correct_answer) {
                color = "bg-red-50 border-red-200";
                label = "Salah";
              }
              return (
                <div key={startIdx + idx} className={`relative border rounded-xl p-4 ${color}`}>
                  <div className="absolute top-2 right-4 text-xs font-bold">
                    {label === "Benar" && <span className="text-green-600">Benar</span>}
                    {label === "Salah" && <span className="text-red-500">Salah</span>}
                    {label === "Tidak Dijawab" && <span className="text-yellow-600">Tidak Dijawab</span>}
                  </div>
                  <div className="font-semibold mb-2">{startIdx + idx + 1}. {q.question_text}</div>
                  <div className="mb-1 text-sm">
                    <span className="font-semibold">Jawaban Anda: </span>
                    {q.my_answer ? (
                      <span className={label === "Benar" ? "text-green-700" : label === "Salah" ? "text-red-700" : "text-yellow-700"}>{q.my_answer}</span>
                    ) : <span className="text-yellow-700 italic">Tidak dijawab</span>}
                  </div>
                  <div className="mb-1 text-sm">
                    <span className="font-semibold">Jawaban Benar: </span>
                    <span className="text-green-700">{q.correct_answer}</span>
                  </div>
                  <div className="mb-1 text-sm">
                    <span className="font-semibold">Pembahasan: </span>
                    <span className="text-gray-700">{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Navigasi halaman pembahasan */}
          {totalPage > 1 && (
            <div className="flex gap-2 justify-center mt-6">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-100 text-gray-500 font-bold disabled:opacity-50">Sebelumnya</button>
              {Array.from({ length: totalPage }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded font-bold ${page === i + 1 ? "bg-[#2563eb] text-white" : "bg-gray-100 text-gray-500"}`}>{i + 1}</button>
              ))}
              <button disabled={page === totalPage} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-100 text-gray-500 font-bold disabled:opacity-50">Selanjutnya</button>
            </div>
          )}
        </div>
      </div>
      {/* Sidebar (opsional, bisa diisi aksi, achievement, dsb) */}
      <aside className="w-full md:w-80 flex-shrink-0 flex flex-col">
        {/* Tempatkan komponen sidebar di sini jika perlu */}
      </aside>
    </div>
  );
}

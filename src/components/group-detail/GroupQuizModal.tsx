// src/components/group-detail/GroupQuizModal.tsx

import { FaTimes, FaCheckCircle } from "react-icons/fa";

interface GroupQuizModalProps {
  show: boolean;
  onClose: () => void;
  quizzes: any[]; // Prop ini yang kadang bisa undefined
  loading: boolean;
  selectedQuizId: string | null;
  onSelectQuiz: (quizId: string) => void;
  onSubmit: () => void;
}

export default function GroupQuizModal({
  show,
  onClose,
  quizzes, // Terima prop seperti biasa
  loading,
  selectedQuizId,
  onSelectQuiz,
  onSubmit,
}: GroupQuizModalProps) {
  if (!show) return null;

  // ✅ PERBAIKAN DI SINI:
  // Buat variabel baru dengan fallback ke array kosong.
  // Jika 'quizzes' adalah undefined atau null, 'quizList' akan menjadi [].
  const quizList = quizzes || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
          onClick={onClose}
          aria-label="Tutup"
        >
          <FaTimes />
        </button>
        <h2 className="font-bold text-xl text-gray-900 mb-6">Pilih Quiz untuk Ditambahkan</h2>
        
        <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2">
          {loading && <p className="text-gray-500 text-center py-4">Memuat kuis Anda...</p>}

          {/* Gunakan 'quizList' yang sudah aman */}
          {!loading && quizList.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">Anda belum membuat kuis.</p>
              <a href="/quiz/create" className="text-violet-500 hover:underline font-medium">Buat kuis sekarang</a>
            </div>
          )}

          {/* Gunakan 'quizList' yang sudah aman */}
          {!loading && quizList.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => onSelectQuiz(quiz.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                selectedQuizId === quiz.id
                  ? "bg-violet-50 border-violet-500"
                  : "bg-gray-50 border-gray-200 hover:border-violet-300"
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{quiz.title}</p>
                <p className="text-sm text-gray-500">{quiz.description}</p>
                <p className="text-xs text-gray-400 mt-1">{quiz.total_questions} Soal</p>
              </div>
              {selectedQuizId === quiz.id && (
                <FaCheckCircle className="text-violet-500 text-xl flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 w-full py-2 rounded-lg bg-violet-500 text-white font-semibold text-base shadow hover:bg-violet-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={onSubmit}
          disabled={!selectedQuizId || loading}
        >
          Tambahkan Quiz ke Grup
        </button>
      </div>
    </div>
  );
}
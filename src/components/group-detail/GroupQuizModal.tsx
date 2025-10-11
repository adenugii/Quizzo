// src/components/group-detail/GroupQuizModal.tsx

import { FaTimes } from "react-icons/fa";
import { assignQuizToStudyGroup } from "@/services/groupservices";
import { useState } from "react";

interface GroupQuiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time_limit?: { Int64: number; Valid: boolean };
  created_by: string;
  total_questions: number;
  created_at: string;
}

interface GroupQuizModalProps {
  show: boolean;
  onClose: () => void;
  quizzes: GroupQuiz[];
  loading: boolean;
  selectedQuizId: string | null;
  onSelectQuiz: (quizId: string) => void;
  onSubmit: () => void;
  groupId: string;
  token?: string;
  onRefresh?: () => void;
}

export default function GroupQuizModal({
  show,
  onClose,
  quizzes,
  loading,
  selectedQuizId,
  onSelectQuiz,
  onSubmit,
  groupId,
  token,
  onRefresh,
}: GroupQuizModalProps) {
  const [addingQuizId, setAddingQuizId] = useState<string | null>(null);
  const [notif, setNotif] = useState<string | null>(null);
  if (!show) return null;
  const quizList = quizzes || [];

  const handleAddQuiz = async (quizId: string) => {
    if (!groupId || !token) return;
    setAddingQuizId(quizId);
    setNotif(null);
    try {
      await assignQuizToStudyGroup(quizId, groupId, token);
      setNotif("Quiz berhasil ditambahkan ke grup!");
      if (onRefresh) onRefresh();
    } catch {
      setNotif("Gagal menambahkan quiz ke grup.");
    }
    setAddingQuizId(null);
  };

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
          {!loading && quizList.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">Anda belum membuat kuis.</p>
            </div>
          )}
          {!loading && quizList.map((quiz) => (
            <div key={quiz.id} className="w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-4 bg-gray-50 border-gray-200 hover:border-violet-300">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{quiz.title}</p>
                <p className="text-sm text-gray-500">{quiz.description}</p>
                <p className="text-xs text-gray-400 mt-1">{quiz.total_questions} Soal</p>
              </div>
              <button
                className="bg-violet-500 text-white px-3 py-1 rounded font-semibold text-xs hover:bg-violet-600 transition disabled:bg-gray-300"
                onClick={() => handleAddQuiz(quiz.id)}
                disabled={addingQuizId === quiz.id}
              >
                {addingQuizId === quiz.id ? "Menambahkan..." : "Tambahkan Quiz"}
              </button>
            </div>
          ))}
        </div>
        {notif && <div className="text-center text-green-600 mt-4 text-sm">{notif}</div>}
      </div>
    </div>
  );
}
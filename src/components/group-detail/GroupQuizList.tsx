import { FaRegChartBar, FaRegClock, FaUserFriends, FaStar, FaRegEye, FaRegPlayCircle } from "react-icons/fa";
import Link from "next/link";

export interface GroupQuizListProps {
  quizzes: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: string;
    time_limit?: { Int64: number; Valid: boolean };
    created_by: string;
    total_questions: number;
    created_at: string;
  }>;
  token?: string;
  groupId?: string;
  showAll?: boolean;
}

export default function GroupQuizList({ quizzes, token, groupId, showAll = false }: GroupQuizListProps) {
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Belum ada quiz di grup ini.
      </div>
    );
  }
  // Sort by created_at desc
  const sortedQuiz = [...quizzes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const displayQuiz = showAll ? sortedQuiz : sortedQuiz.slice(0, 3);
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-900">Daftar Quiz Grup</h3>
        {!showAll && groupId && quizzes.length > 3 && (
          <Link href={`/group-detail/quiz-group?id=${groupId}`} className="text-sm text-[#2563eb] hover:underline font-medium">
            Lihat Semua
          </Link>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {displayQuiz.map((quiz) => (
          <div key={quiz.id} className={`bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 border-t-4 ${quiz.difficulty === "easy" ? "border-green-400" : quiz.difficulty === "medium" ? "border-yellow-400" : quiz.difficulty === "hard" ? "border-red-400" : "border-gray-400"}`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${quiz.difficulty === "easy" ? "bg-green-100 text-green-600" : quiz.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" : quiz.difficulty === "hard" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>{quiz.difficulty}</span>
              <span className="text-xs text-gray-400 ml-auto">Uploaded {new Date(quiz.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-base truncate" style={{maxWidth: '100%'}}>{quiz.title}</h3>
            <p className="text-sm text-gray-500">{quiz.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">{quiz.total_questions ?? 0} soal</span>
              <Link href={`/quiz-maker/${quiz.id}`}>
                <button className="bg-[#2563eb] text-white text-sm font-medium px-4 py-1.5 rounded shadow hover:bg-[#1e40af] transition">Mulai Quiz</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}